"use strict";
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
require('geckodriver');
async function example() {
	try{
	
		var driver = new webdriver.Builder().forBrowser('firefox').build();
		await driver.get('http://localhost:3000');
		var search = await driver.findElement(driver.By.id('queryField'));
	        await search.sendKeys('president');
		await Search.submit();
	}
	catch(err){
		handleFailure(err,driver)
	}
}

example();

function handleFailure(err, driver){
	console.error(err.stack);
//	driver.quit();
}
