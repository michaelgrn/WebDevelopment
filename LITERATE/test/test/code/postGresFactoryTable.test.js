'use strict';

const { expect, assert } = require('chai');
const { Client } = require('pg')
const { describePostgres } = require('../../utils/start.config')
const PostGresClass = require('../../src/code/postGresFactoryTable.src');
const waitPort = require('wait-port');

before(async function() {
  this.timeout(30000);
  await waitPort({host: 'postgres', port: 5432, timeout: 0});
});

describePostgres('PostGres Tables', function () {

	describe('Checking if alphatwo exists in the database', function() {
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

		it('should pass if we connect and the table alphatwo exists', () => PostGresClass.connectToTable(client));
		it('should disconnect from database nicely' , () => PostGresClass.disconnectFromDatabase(client));
	});

	describe('Checking if alphatwo was correctly built', function() {
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

		const col = [
			'sessionid',
			'queryid',
			'timestamp',
			'eventtype',
			'eventdata'
		];

		const query = 'select * from alphatwo limit 1;';

		it('should pass if we connect and the table alphatwo exists', () => PostGresClass.connectToTable(client))
		it('should pass if alphatwo is correctly built', () => PostGresClass.executeQueryOnDatabase(client, col, query));
		it('should disconnect from database', () => PostGresClass.disconnectFromDatabase(client))
	},);

	describe('Checking if alpharead exists in the database', function() {
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

		it('should pass if we connect and the table alpharead exists', () => PostGresClass.connectToTable(client))
		it('should disconnect from database', () => PostGresClass.disconnectFromDatabase(client))
	},);

	describe('Checking if alpharead was correctly built', function() {
		const col = [
			'pkey',
			'utcdate',
			'url',
			'source',
			'title',
			'description',
			'author',
			'content',
			'flesch',
			'urltoimages',
			'publishedat',
			'imagecount',
			'subscription',
			'video',
			'wordcount',
			'keywords',
			'hastags'
		];

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

		const query ='select * from alpharead limit 1;';

		it('should pass if we connect and the table alpharead exists', () => PostGresClass.connectToTable(client))
		it('should pass if alpharead is correctly built', () => PostGresClass.executeQueryOnDatabase(client, col, query))
		it('should disconnect from database', () => PostGresClass.disconnectFromDatabase(client))
	},);
});


