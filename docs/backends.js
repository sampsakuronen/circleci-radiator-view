/*
Build type:
{
   repository: name,
   branch: 'master',
   started: new Date(),
   state: 'success',
   commit: {
      created: new Date(),
      author: 'Tester',
      hash: 'shahash'
   }
}
*/

function buildBackend(settings, callback) {
   var backend = circleBackend
   if (settings.mode === 'travis') {
      backend = travisBackend
   } else if (settings.mode === 'jenkins') {
      backend = jenkinsBackend
   } else if (settings.mode === 'cloudwatch') {
      backend = cloudWatchBackend
   }
   var branchFilter = function(build) {
      return settings.branch ? build.branch.match(settings.branch) : true
   }
   return function() {
      backend(settings, function(err, data) {
         if (err) {
            return callback(err)
         }
         var builds = data.filter(branchFilter)
         builds = _.uniqBy(builds, function(b) {return b.repository + b.branch})
         builds = builds.sort(function(a, b) {return a.started.getTime() - b.started.getTime()})
         callback(undefined, builds)
      })
   }
}

function backendOptions() {
   return {
      'circle': {
         name: 'Circle CI',
         url: 'https://circleci.com/api/v1/projects',
         token: undefined
      },
      'travis': {
         name: 'Travis CI',
         url: 'https://api.travis-ci.com/repos',
         token: undefined
      },
      'jenkins': {
         name: 'Jenkins CI',
         url: undefined,
         token: undefined
      },
      'cloudwatch': {
         name: 'AWS CloudWatch',
         url: 'https://monitoring.eu-west-1.amazonaws.com/',
         token: undefined
      }
   }
}

function httpRequest(url, handler /*, headers */) {
   var request = new XMLHttpRequest()
   var headers = arguments[2] || {}
   request.open('GET', url, true)
   Object.keys(headers).forEach(function(headerName) {
      request.setRequestHeader(headerName, headers[headerName])
   })
   request.onload = function() {
      if (request.status === 401 || request.status === 403) {
         handler('Invalid API token (' + request.status + ' ' + request.responseText + ')')
      } else if (request.status >= 200 && request.status < 400) {
         try {
            var data = JSON.parse(request.responseText)
            handler(undefined, data)
         } catch(exc) {
            console.log('Error fetching URL', url, request.responseText)
            handler(exc)
         }
      } else {
         handler('Error getting URL ' + url + ':' + request.status)
      }
   }
   request.send()
}

var travisBackend = function(settings, resultCallback) {
   var travisRequest = function(url, cb) {
      var handler = function(err, data) {
         if (err) {
            return resultCallback(err)
         }
         cb(data)
      }
      httpRequest(url, handler, {
         Accept: 'application/vnd.travis-ci.2+json',
         Authorization: 'token ' + settings.token
      })
   }

   var translateBuild = function(reponame, commits) {
      var findCommit = function(commit) {
         return commits.find(function(c) {
            return c.id == commit
         })
      }
      return function(b) {
         var commit = findCommit(b.commit_id)
         return {
            repository: reponame,
            branch: commit.branch,
            started: new Date(b.started_at),
            state: b.state,
            commit: {
               created: new Date(commit.committed_at),
               author: commit.author_name,
               hash: commit.sha
            }
         }
      }
   }

   var parseBuilds = function(repos) {
      var responses = []
      repos.forEach(function(r) {
         travisRequest(settings.url + '/' + r.name + '/builds', function(data) {
            var reponame = r.name.split('/')[1]
            var builds = data.builds.map(translateBuild(reponame, data.commits))
            responses.push(builds)
            if (responses.length === repos.length) {
               var result = responses.reduce(function(acc, item) {
                  return item.length > 0 ? acc.concat(item) : acc
               }, [])
               resultCallback(undefined, result)
            }
         })
      })
   }

   travisRequest(settings.url, function(data) {
      parseBuilds(data.repos.map(function(repo) {return {id: repo.id, name: repo.slug}}))
   })
}

var circleBackend = function(settings, resultCallback) {
   var url = settings.url + '?circle-token=' + settings.token

   httpRequest(url, function(err, data) {
      if (err) {
         return resultCallback(err)
      }
      var builds = data.reduce(function(acc, repository) {
         return acc.concat(Object.keys(repository.branches).map(function(branchName) {
            var branch = repository.branches[branchName]
            var buildIsRunning = branch.running_builds.length != 0
            var build = buildIsRunning ? branch.running_builds[0] : branch.recent_builds[0]
            var status = buildIsRunning ? build.status : build.outcome
            return {
               repository: repository.reponame,
               branch: branchName,
               started: new Date(build.pushed_at),
               state: status,
               commit: {
                  created: new Date(build.pushed_at),
                  author: null,
                  hash: build.vcs_revision
               },
            }
         }))
      }, [])
      resultCallback(undefined, builds)
   }, {
      Accept: 'application/json'
   })
}

var jenkinsBackend = function(settings, resultCallback) {
   var jenkinsRequest = function(url, cb) {
      var handler = function(err, data) {
         if (err) {
            return resultCallback(err)
         }
         cb(data)
      }
      var headers = {}
      if (settings.token) {
         headers.Authorization = 'Basic ' + window.btoa(settings.token)
      }
      httpRequest(url, handler, headers)
   }

   var findLastCommit = function(builds) {
      if (! builds) {
         return undefined
      }
      var lastBuildWithCommits = builds.filter(function(b) {
         return b.changeSets && b.changeSets.length > 0
      })[0]
      if (! lastBuildWithCommits) {
         return undefined
      }
      var lastCommits = lastBuildWithCommits.changeSets[0].items.map(function(item) {
         return {
            created: new Date(item.timestamp),
            author: item.author.fullName,
            hash: item.commitId
         }
      })
      return lastCommits[lastCommits.length - 1]
   }

   var findBuildReason = function(builds) {
      if (! builds) {
         return undefined
      }
      var lastBuildWithActions = builds.filter(function(b) {
         return b.actions && b.actions.length > 0
      })[0]
      if (! lastBuildWithActions) {
         return undefined
      }
      var reason = lastBuildWithActions.actions.filter(function(a) {
         return a._class == 'hudson.model.CauseAction'
      }).reduce(function(acc, a) {
         return acc.concat(a.causes.map(function(c) {return c.shortDescription}))
      }, []).join(';')

      return {
         author: reason,
      }
   }

   var findResponsible = function(job) {
      if (! job.actions) {
         return undefined
      }
      var contributorActions = job.actions.filter(function(action) {return action.contributor || action.contributorDisplayName})
      var contributor = contributorActions[0]
      if (! contributor) {
         return undefined
      }
      return {
         created: new Date(job.timestamp),
         author: contributor.contributorDisplayName || contributor.contributor
      }

   }

   var url = settings.url + '/api/json?depth=4&tree=name,url,jobs[name,url,jobs[name,url,actions[contributor,contributorDisplayName,contributorEmail],buildable,builds[result,building,actions[causes[shortDescription]],changeSets[items[author[fullName],timestamp,commitId]],timestamp]]]'
   jenkinsRequest(url, function(data) {
      var builds = data.jobs.reduce(function(acc, project) {
         return acc.concat(project.jobs.reduce(function(acc, job) {
            if (!job.buildable) {
               return acc
            }
            var build = job.builds[0] || {}
            var result = 'failed'
            if (build.building) {
               result = 'started'
            } else if (build.result === 'ABORTED') {
               result = 'canceled'
            } else if (build.result === 'SUCCESS') {
               result = 'success'
            }

            return acc.concat({
               repository: project.name,
               branch: job.name,
               started: new Date(build.timestamp),
               state: result,
               commit: findLastCommit(job.builds) || findResponsible(job) || findBuildReason(job.builds)
               })
         }, []))
      }, [])
      resultCallback(undefined, builds)
   })
}

var cloudWatchBackend = function(settings, resultCallback) {
   var creds = settings.token.split(':')
   var region = settings.url.split('.')[1]
   var cloudwatch = new AWS.CloudWatch({
      accessKeyId: creds[0],
      secretAccessKey: creds[1],
      region: region,
   })
   var params = {}
   cloudwatch.describeAlarms(params, function(err, data) {
      if (err) {
         return resultCallback(err)
      }
      var builds = data.MetricAlarms.map(function(alarm) {
         var result = 'canceled'
         if (alarm.StateValue === 'OK') {
            result = 'success'
         } else if (alarm.StateValue === 'ALARM') {
            result = 'failed'
         }
         return {
            repository: alarm.AlarmName,
            started: alarm.StateUpdatedTimestamp,
            state: alarm.StateValue === 'OK' ? 'success' : 'failed'
         }
      })
      resultCallback(undefined, builds)
   })
}
