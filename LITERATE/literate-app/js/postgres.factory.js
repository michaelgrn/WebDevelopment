(function () {

	/*
	*	The current build is using the bitnami postgres image. In order to access
	* the database one has to go into the docker instance of the image.
	*
	* 1. docker container ls
	* 2. docker exec -it xxxxxxxxxx bash (where xxxxxxxxxx is the pid of bitnami)
		* 3. psql -h localhost -p 5432 -U postgres -W
	*
	* The schema is
	*
		create table alphatwo(
			sessionID VARCHAR(100),
			queryID VARCHAR(100),
			timeStamp TIMESTAMP WITH TIME ZONE,
	  	eventType VARCHAR(100),
			eventData json
		);
	*
		CREATE TABLE alphaRead(
			pKey serial not null
			constraint alphaRead_pkey
			primary key,
			utcDate TIMESTAMP WITH TIME ZONE,
			url VARCHAR,
			source JSON,
			title VARCHAR,
			description VARCHAR,
			author VARCHAR,
			content TEXT,
			flesch JSON,
			urlToImages VARCHAR,
			publishedAt DATE,
			imageCount INTEGER,
			subscription BOOLEAN,
			video BOOLEAN,
			wordCount INTEGER,
			keywords VARCHAR,
			hasTags BOOLEAN
		);
	* GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO my_user;
	*	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO my_user;
	*/
	//Good news: node-postgres ships with built in client pooling. Client pooling allows your application to use a pool of already connected clients and reuse them for each request to your application. If your app needs to make more queries than there are available clients in the pool the queries will queue instead of overwhelming your database & causing a cascading failure.

	'use strict'
	const { Client } = require('pg');
	var Pool = require('pg-pool')
	const cookieParser = require('cookie-parser');

	// create a config to configure both pooling behavior
	// and client options
	// note: all config is optional and the environment variables
	// will be read if the config is not present

	// changing host from postgresql to postgres



	var config = {
		user: 'my_user',
		host: 'postgres',
		database: 'my_database',
		password: 'password123',
		port: 5432,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	};


	//var config = 'postgres://my_user:password123@localhost:5432/my_database';

	//this initializes a connection pool
	//it will keep idle connections open for a 30 seconds
	//and set a limit of maximum 10 idle clients
	var pool = new Pool(config);

	// var pg = require('pg');
	// pg.defaults.poolSize = 20;
	// const { Pool } = require('pg');

	/*
	*	This information is established in the docker file and can be changed
	* based on preference.
	*/

	// const pool = new Pool({
	// 	user: 'my_user',
	// 	host: 'postgresql',
	// 	database: 'my_database',
	// 	password: 'password123',
	// 	port*/: 5432,
	// 	max: 20,
	// 	idleTimeoutMillis: 30000,
	// 	connectionTimeoutMillis: 2000,
	// });

	const uuidv1 = require('uuid/v1');
	var username;
	var sid;
	var pid;
	var dt = new Date();

	module.exports = class PostGres {
		/*
		*  Constructor establishes session ID
		*/
		constructor() {
			sid = uuidv1();
			username = "None Set"
		}

		/*
		*  Used to reset session ID and establish a 'username'
		*/
		setName(name) {
			username = name;
		}
		getName() {
			return username;
		}
		/*
		*	Used to log events into the database
		*/
		logEvent(eventType, eventData, eSid, ePid) {
			dt = new Date();
			var utcDate = dt.toUTCString();
			sid = eSid;
			pid = ePid;

			if (eventType == "Set Name/New Session") {
				this.setName(eventData)
			}
			pool.connect()
				.then(client => {
					return client.query('INSERT INTO public.alphatwo(sessionid, queryid, timestamp, eventtype, eventdata) VALUES ($1, $2, $3, $4, $5)', [sid, pid, utcDate, eventType, eventData])

						.then(res => {
							console.log("successfully insterted data into alphatwo");
							client.release();
						})
						.catch(e => {
							console.log("didnt find database alphatwo or doesnt exist");
							console.log(e);
							client.release();
						})
				})
				.catch(e => {
					console.log("CAUGHT ERROR in connecting to database")
					console.log(e)
					client.release();
				})
		}

		getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}

		logEventTwo(eventData) {
			var utcDate = dt.toUTCString();
			let url = eventData["url"];
			let source = eventData["source"];
			let title = eventData["title"];
			let description = eventData["description"];
			let author = eventData["author"];
			let content = eventData["content"];
			let flesch = eventData["flesch"];
			let urlToImage = eventData["urlToImage"];
			let publishedAt = eventData["publishedAt"];
			let imageCount = eventData["imageCount"];
			let subscription = eventData["subscription"];
			let video = eventData["video"];
			let wordCount = eventData["wordCount"];
			let keywords = eventData["keywords"];
			let hasTags = eventData["hasTags"];

			pool.connect()
				.then(client => {
					return client.query('INSERT INTO public.alphaRead(utcDate, url, source, title, description, author, content, flesch, urlToImages, publishedAt, imageCount, subscription, video, wordCount, keywords, hasTags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [utcDate, url, source, title, description, author, content, flesch, urlToImage, publishedAt, imageCount, subscription, video, wordCount, keywords, hasTags])
						.then(res => {
							console.log("successfully inserted data into alphaRead");
							client.release();
						})
						.catch(e => {
							console.log("didnt find database alpharead or doesnt exist");
							console.log(e);
							client.release();
						})
				})



		}
	}


})();
