'use strict';

const mocha = require('mocha');

// TODO currently there are issues with setting timeout
const describeTest = function(name, test, driver, timeout) {
	const webdriver = require('selenium-webdriver');
	const firefox = require('selenium-webdriver/firefox');	
	timeout = timeout || 40000;

	return describe(name, function() {
		// this.timeout = timeout;
		// TODO there is a bug with firefox currently that has to do with killing browser
		// afterEach(function () {
		// 	driver.close();
		// });

		beforeEach(function () {
			// mocha.timeout = timeout;
		});

		after(function() {
			driver.quit();
		});

		test();

	}, driver);
}

const describePostgres = function(name, test, client, timeout) {
	timeout = timeout || 40000;

	return describe(name, function () {
		// this.timeout = timeout;
		// TODO there is a bug with firefox currently that has to do with killing browser
		// afterEach(function () {
		// 	driver.close();
		// });

		beforeEach(function () {
			// mocha.timeout = timeout;
		});

		after( async function () {

		});

		test();

	}, client);
}

module.exports = {
	describeTest,
	describePostgres
};