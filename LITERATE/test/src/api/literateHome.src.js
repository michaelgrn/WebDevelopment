'use strict';

require('geckodriver');
const { describePostgres } = require('../../utils/start.config')
const { Client } = require('pg')
const PostGresClass = require('../../src/code/postGresFactoryTable.src');

const expect = require('chai').expect;
const webdriver = require('selenium-webdriver');

module.exports = {
	shouldBeLiterate: async function(driver) {
		await driver.get('http://localhost:3000');

		const title = await driver.getTitle();
		expect(title).to.equal('LITERATE');
	},

	centerfoldShouldBeLiterate: async function (driver) {
		await driver.get('http://localhost:3000');

		const centerfold = await driver.findElement(webdriver.By.id('home-title')).getText();

		expect(centerfold).to.equal('LITERATE');
	},

	searchForString: async function (driver, usrStr) {
		await driver.get('http://localhost:3000');

		const searchBox = await driver.findElement(webdriver.By.id('queryField')).sendKeys(usrStr);
		const searchButton = await driver.findElement(webdriver.By.id('search-button'));

		await searchButton.click();
		// await driver.wait( driver => {
		// 	return driver.executeScript('if(window.hasOwnProperty("article-title")) return true;');
		// }, 10000)

		const result = await driver.wait(function () {
			return driver.executeScript('return document.readyState').then(function (readyState) {
				return readyState === 'complete';
			});
		});

		return expect(result).to.be.true; // TODO some better verification could be done here
	},

	//For future use in testing end to end

	/*searchedStringisinDB: async function (usrStr) {
		const client = new Client({
			user: "my_user",
			host: "postgres",
			database: "my_database",
			password: "password123",
			port: 5432,
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});

		const query = 'SELECT eventdata from alphatwo ORDER BY timestamp DESC LIMIT 1;'
		PostGresClass.connectToTable(client);
		PostGresClass.getMostRecentSearch(client,query,usrStr);
		//expect(search).to.contain(usrStr);
	}*/
}
