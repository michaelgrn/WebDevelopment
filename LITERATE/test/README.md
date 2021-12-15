# TESTING OVERVIEW

For the purpose of testing we chose to use Mocha - a JavaScript test framework that runs on Node.js and in the browser.

To allow the test results to more clearly describe the test outcomes we've included the Chai assertion library.

We are initially using Selenium web-driver with Geckodriver for Firefox browser web driven test automation. The Selenium web-driver also supports other extensions installed such as ChromeDriver - however this is not currently implemented.

> More information about how to use Mocha and Docker can be found over on this repository's wiki page [here](https://github.com/BoiseState/literate-webapp/wiki).

## Getting Started
When starting from a fresh clone or download there are two steps you must do to properly run.
- run "install npm" from home directory

## Running Tests

For mocha tests navigate to the internal test folder (literate-webapp/test/test) and simple use mocha on the directory or file you want to run the tests on.

To run the tests using mocha you can use the following format:

- `mocha test/test/<dir>/<suite> [-g] ["test name"]`

ie: `mocha test/test/api/literateHome.test.js -g "home page texts should be correct"`

The directory is which ever portion of the product that you wish to test; the `-g` means grep for which ever test you specify. You are not required to use the `-g` option if you instead want to run the whole suite.

Tests can also be run with Docker (this is explained in more detail in the Docker documentation which can be found over on the wiki). Currently, spring 2019, there are known issues with Selenium and Docker (explained on the wiki) meaning that testing with Docker is strictly limited to the **postgres** tests.

## Creating Tests

One of the reasons we chose Mocha as our test suite is that it is primarily self-documenting. The tests you run are simply a set of descriptions. An example of this is provided in the example folder: example.test.js.

The reason this code is able to remain simplified is because the underlying functions that it's using to provide the test results are kept separately in a source file and are then exported to the test file. Once again we've provided an example: example.src.js.

The .src and .test naming conventions are not required - but simplify finding which functions correspond with which tests.

Within the .src files - if testing functions from another file you may need to "require" that file. Similarly, in the .test files you "require" the corresponding source file in order to use it's exported functions.

More information about writing automated tests can be found [here](https://github.com/BoiseState/literate-webapp/wiki/Automated-Test-Guide) on the repository's wiki.

## File Structure

Within the main test folder there is a src subfolder and another test subfolder, as the naming suggests the src folder holds all the source files for the tests in the test file. These have been further categorized into folders based on the type of test they are performing (API, DB (database), or regular source code).

## Potential Improvements

In the course of our research and implementation of a test suite there were a number of improvements that could be used within our existing framework. The tests could log the results in an easier to read browser window, be conducted within their own docker file, and would be more end-to-end based using the webdriver. As the project continues to grow these may be things worth further consideration.

Another thing that was considered for package organization was Lerna - a link for which will be provided below.

## Helpful Links:

https://mochajs.org/

https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElementPromise.html

https://nodejs.org/en/

https://www.docker.com/

https://github.com/lerna/lerna
