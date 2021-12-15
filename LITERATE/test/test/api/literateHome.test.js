'use strict';
const literateHome = require('../../src/api/literateHome.src');
const { describeTest } = require('../../utils/start.config');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const driver = new webdriver.Builder().forBrowser('firefox').build();
//const driver = new webdriver.Builder().forBrowser('firefox').usingServer('http://localhost:4444/wd/hub').build();


describeTest('Home Page Defaults', function () {
	describe('home page texts should be correct', function() {
		it('title should be LITERATE', () => literateHome.shouldBeLiterate(driver)).timeout(50000);
		it('centerfold should be LITERATE', () => literateHome.centerfoldShouldBeLiterate(driver)).timeout(50000);
	}, driver);

	describe('home page should search for specified string', function () {
		const usrStr = require("../../utils/defaults/string.default.json").string;
		it('should search from VIDEO GAMES', () => literateHome.searchForString(driver, usrStr)).timeout(50000);
	}, driver);

	//For future testing in end to end

	/*describe('postgres should have most recent search as video games', function () {
		const usrStr = require("../../utils/defaults/string.default.json").string;
		it('should pass if find video games as most recent search', () => literateHome.searchedStringisinDB(usrStr))
	})*/
}, driver);
