# Radiator view for Circle CI

Cirle CI lacks a nice radiator view / dashboard. This project simply displays all your projects and branches with status based coloring.

*Pull requests are welcome.*

## Setup

1. Get your API token from [your CirleCI account settings](https://circleci.com/account/api)
2. Open `index.html`

Hosted version is available here:: https://sampsakuronen.github.io/circleci-radiator-view/

CirleCI API tokens have read and write access. When you use the query parameter, the token is visible in your browser history.

Enter the token via a form on the page or send it as a query parameter:

    https://yourdomain.com/?token=835li2ixxxxxxxxxxxxxxxxxxxxxxxxxx1sd41

![Circle CI Radiator view](/readme_radiator.png?raw=true "Circle CI Radiator view")

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
