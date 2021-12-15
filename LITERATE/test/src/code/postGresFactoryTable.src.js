'use strict'

const { expect, assert } = require("chai");
const { Client } = require('pg');


module.exports = {
	connectToTable: async function (client) {
		client = client || new Client({
			user: "my_user",
			host: "postgres",
			database: "my_database",
			password: "password123",
			port: 5432,
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});

		return await client.connect()
	},

	executeQueryOnDatabase: async function (client, col, query) {

		//checks to verify that the columns of alphatwo match the array created with expected order and columns
		const result = await client.query({
			rowMode: 'array',
			text: query
		})

		for(let i = 0;i < col.length; i++)
		{
			await expect(result.fields[i].name).to.equal(col[i])
		}
	},

	disconnectFromDatabase: async function (client) {
		await client.end()
	},

	//Following tests are designed for end to end testing

	getMostRecentSearch: async function (client,query,usrStr) {

			const result = await client.query({
				rowMode: 'array',
				text: query
			})
			console.log(result)
			await expect(result).to.contain(usrStr)
			//var search = Object.values(JSON.parse(JSON.stringify(res)).rows[0]['eventdata'])
			//return search

	},

	getMostRecentSessionId: async function (client) {

			//returns the most recent sessionID according to the time stamp
			await client.query('SELECT sessionID FROM alphatwo ORDER BY timestamp DESC LIMIT 1;', (err, res) => {
				var id = JSON.parse(JSON.stringify(res)).rows[0]['sessionid']
				console.log(id)
				return id
			})
	}

}