(function () {

	'use strict';
	const axiosPrime = require('axios')
  const axios = axiosPrime.create({

  timeout: 100000,

});

	class ReadabilityFactory {

		constructor() {

		}

		getData(url) {
			return getReadabilityData(url);
		}

	}

	 /**
   * Retrieves an article's readability data through its url from
   * the readability server.
   * @param  {string} url - url of the article
   * @return {Promise} - promise that returns a JS object with data
   */
	function getReadabilityData(url) {
		return new Promise((resolve, reject) => {
      let host = process.env.READABILITY_HOST || 'localhost';
			let apiUrl = 'http://'+host+':5000/readability/' + encodeURIComponent(url);
      axios.get(apiUrl)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log('ReadabilityFactory error:', error.code);
          reject(error.code);
        });
    });
	}

	module.exports = ReadabilityFactory;

})();
