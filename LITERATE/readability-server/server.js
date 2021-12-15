(function () {

	'use strict';

	const express = require('express');
	const responseTime = require('response-time');
	const cluster = require('cluster');
	const numCPUs = require('os').cpus().length;

  var app = express();
  let port = process.env.PORT || 5000;
  let bodyParser = require('body-parser');

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(responseTime()); // Create a middleware that adds a X-Response-Time header to responses

	var routes = require('./api/routes/readability.routes'); // importing routes
	routes(app); // register the routes

	// Middleware: redirect and respond to incorrect routes
	app.use(function(req, res) {
	  res.status(404).send({url: req.originalUrl + ' not found'})
	});

	if (cluster.isMaster) {
	  console.log(`Master ${process.pid} is running`);
	  
	  // Fork workers
	  for (let i = 0; i < numCPUs; i++)
	    cluster.fork();

	  console.log('Readability API server started on: ' + port);

	  //Check if worker has died
	  cluster.on('exit', (worker, code, signal) => {
	    console.log(`worker ${worker.process.pid} died`);
	  });

	} else {
	  // console.log(`Worker ${process.pid} started`);
	  app.listen(port, () => { 
	  	// console.log('Readability API server started on: ' + port);
	  });
	}

})();