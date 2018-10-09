# Simple build status radiator view

Many continuous integration services lack a nice and simple radiator view / dashboard.
This project simply displays all your projects and selected branches with status based coloring.

Supported backends are [CircleCI](https://circleci.com/), [Travis CI](https://travis-ci.org/) and
[Jenkins](https://jenkins.io).

![Circle CI Radiator view](/readme_radiator.png?raw=true "Circle CI Radiator view")

*Pull requests are welcome.*


## Setup for CircleCI

1. Get your API token from [your CircleCI account settings](https://circleci.com/account/api)
2. Open `index.html`


## Setup for Travis CI

1. Get your API token from (https://travis-ci.org/profile/<your_profile>)
2. Open `index.html?mode=travis`

## Setup for Jenkins

1. Create a user and a token for the user in your job settings
2. Open `index.html?mode=jenkins` and add the job end point URL (eg. http://host/jenkins/job/My%20Job)

## Query parameters

All options can be set either with a query parameter or from the setup form, which is shown when
any required parameters are missing.

- mode

   select backend to use, _circle_ (default), _travis_ or _jenkins_

- repositories

  Use for declaring wanted repositories in comma-separated format: `my-cool-project,helloWorldProject`
  By default all repositories will be shown

- branch

   Select the branch to show (from all repos found in the API end point).
   Useful if your repos contain only a single branch (master, release etc) that should be visible
   in the radiator view.

- token

   The auth token token to use. NOTE: CircleCI API tokens have read and write access. When you
   use the query parameter, the token is visible in your browser history.

- url

   Only for jenkins, really: the Jenkins job URL


Example with all parameters in use:

   https://yourdomain.com/?mode=circle&branch=release&token=835li2ixxxxxxxxxxxxxxxxxxxxxxxxxx1sd41


Example where the token is entered in an input field:

   https://yourdomain.com/?mode=travis&branch=master


Jenkins example:

   https://yourdomain.com/?mode=jenkins&token=jenkins_token&url=http://localhost:8080/jenkins/job/My%20Job


## Hosted version

Available here: https://sampsakuronen.github.io/circleci-radiator-view/


## Licence

The MIT License (MIT)

Copyright (c) 2016 Sampsa Kuronen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
