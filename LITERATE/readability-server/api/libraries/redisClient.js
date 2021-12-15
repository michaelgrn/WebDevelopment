/////////////////////////////////////////////////
// Singleton for Redis cache database client.
//
// @file: redisClient.js
// @author: Anurag Bhandari
/////////////////////////////////////////////////

var redis = require('redis');
const cluster = require('cluster');

var redisClient = (function () {

  'use strict';

  // Start with a fake client so that we have a client that works
  // even when Redis server is down
  var client = {
    get: (key, cb) => {
      cb(null, null);
    },
    setex: (key, time, value) => {
      // Do nothing in particular
    }
  };

  // Attempt to create a new instance of an actual redis client
  let host = process.env.REDIS_HOST || 'localhost';
  var connectionString = process.env.REDIS_URL || 'redis://'+host+':6379';
  var c = redis.createClient(connectionString, {
    retry_strategy: function (options) {
      if (!options.error) {
        console.log('Lost connection to Redis Server.\n Quitting...');
        process.exit(0);
      }
      if (options.error.code === 'ECONNREFUSED') {
        if (cluster.isMaster)
          console.log('REDIS SERVER IS NOT RUNNING! CACHING WILL NOT BE USED.\n' +
                      'To enable caching, start a redis server: ' + 
                      'redis-server and restart the readability-server');
        // This will suppress the ECONNREFUSED unhandled exception
        // that results in app crash
        return;
      }
    }
  });

  // Set the "client" variable to the actual redis client instance
  // once a connection is established with the Redis server
  c.on('ready', () => {
    if (cluster.isMaster)
      console.log('ESTABLISHED CONNECTION WITH REDIS SERVER!\n' +
                  'Caching enabled.');
    client = c;
  });

  /**
   * Get a redis client
   * @return {Object} client - eventually a proper redis client object (if redis is up) or a fake client object (if redis is down)
   */
  var getClient = () => {
    return client;
  };

  return {
    getClient: getClient
  }

})();

module.exports = redisClient;