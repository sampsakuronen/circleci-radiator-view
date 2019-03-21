# Simple build status and alarm radiator view

Many continuous integration services lack a nice and simple radiator view / dashboard.
This project simply displays all your projects and selected branches with status based coloring.

Production (or any other) environment monitoring is another good practice. Radiate your alarms as well as builds!

Supported CI backends are [CircleCI](https://circleci.com/), [Travis CI](https://travis-ci.org/), [Jenkins](https://jenkins.io), [Drone](https://drone.io).

For alarm monitoring, [AWS CloudWatch Alarms](https://aws.amazon.com) is supported.

![Circle CI Radiator view](/readme_radiator.png?raw=true "Circle CI Radiator view")

*Pull requests are welcome.*


## Setup for CircleCI

1. Get your API token from [your CirleCI account settings](https://circleci.com/account/api)
2. Open `index.html`
3. Add your token to the token field

## Setup for Travis CI

1. Get your API token from (https://travis-ci.org/profile/<your_profile>)
2. Open `index.html?mode=travis`
3. Add your token to the token field

## Setup for Jenkins

1. Create a user and a token for the user in your job settings
2. Open `index.html?mode=jenkins` and
  * Add the job end point URL (eg. http://host/jenkins/job/My%20Job)
  * Set the user name and the generated token in the token field, separated by a colon, ie. *userid:thetokenhash*.

## Setup for AWS CloudWatch

1. Create a monitor user with read-only access in IAM
2. Open `index.html?mode=cloudwatch` and
  * Modify the URL to contain the proper region (defaults to eu-west-1)
  * Set the access key and secret key as token, separated by a colon, ie. *ACCESSKEY:longsecretkey*.

## Setup for Drone

1. Get your personal token from (https://drone.host/account)
2. Open `index.html?mode=drone`
3. Add your Drone address to the URL field.
4. Add your token to the token field
   * Set optional comma separated namespace filter(s) into the token field, separated by a colon, ie. *ns,ns2:thetokenhash*

## Query parameters

All options can be set either with a query parameter or from the setup form, which is shown when
any required parameters are missing.

- mode

   select backend to use, _circle_ (default), _travis_, _jenkins_, _cloudwatch_ or _drone_

- branch

   Select the branch to show (from all repos found in the API end point).
   Useful if your repos contain only a single branch (master, release etc) that should be visible
   in the radiator view.

   The branch is understood as a regular expression, so you can say something like _master|PR.*_

- token

   The auth token token to use. NOTE: CirleCI API tokens have read and write access. When you
   use the query parameter, the token is visible in your browser history.

- url

   Only for _jenkins_ and _drone_, really: the Jenkins job URL or the Drone base URL.


Example with all parameters in use:

   https://yourdomain.com/?mode=circle&branch=release&token=835li2ixxxxxxxxxxxxxxxxxxxxxxxxxx1sd41


Example where the token is entered in an input field:

   https://yourdomain.com/?mode=travis&branch=master


Jenkins example:

   https://yourdomain.com/?mode=jenkins&token=user:jenkins_token&branch=master|PR.*&url=http://localhost:8080/jenkins/job/My%20Job


## Hosted version

Available here:

- https://sampsakuronen.github.io/circleci-radiator-view/
- https://langma.github.io/radiator-view/
- https://rofafor.github.io/radiator-view/


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
