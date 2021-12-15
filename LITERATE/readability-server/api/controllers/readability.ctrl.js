(function () {

	'use strict';

	const WebpageService = require('../services/webpage.service');
	const webpageService = new WebpageService();

	const MozillaService = require('../services/mozilla-readability.service');
	const mozillaService = new MozillaService();

	const TextService = require('../services/text-stats.service');
	const textService = new TextService();

	const FleschService = require('../services/flesch.service');
	const fleschService = new FleschService();

	let redisClient = require('../libraries/redisClient');
	let client = redisClient.getClient();

	/**
	 * Returns readability data based on an article's url.
	 * @param  {object} req - request object
	 * @param  {object} res - response object
	 * @return {object} readability data
	 */
	function getReadabilityData(req, res) {
		console.log('request for:', req.params.url);
		let url = req.params.url;
		client = redisClient.getClient();
	  client.get(url, (err, result) => { // Check the cache data from the redis server
	    if (result) // result is null if the url is not cached
	    	res.json(JSON.parse(result));
	    else
	      generateReadabilityData(req, res);
	  });
	}

	/*-- Helper Functions --*/

	/**
   * Checks if an article has tags to be displayed.
   * @param  {Object} article - article to check
   * @return {boolean} true if has tags, false otherwise
   */
  function articleHasTags(article) {
    return (article.subscription || article.video);
  }

  /**
	 * Generates readability data based on an article's url.
	 * @param  {object} req - request object
	 * @param  {object} res - response object
	 * @return {object} readability data
	 */
	function generateReadabilityData(req, res) {
		let url = req.params.url;
		mozillaService.getWebpageData(url)
			.then(results => {
				let articleText = webpageService.stripHtml(results.content)
				//console.log("Before Sub");
				let data = {
					content: articleText,
					flesch: fleschService.flesch(articleText),
					imageCount: webpageService.numberOfImages(results.content),
					subscription: webpageService.isSubscription(results.content),
					video: webpageService.isVideo(url),
					wordCount: textService.wordCount(articleText),
					keywords: fleschService.keywords(articleText)
				};
				//console.log("After Sub");
				data.hasTags = articleHasTags(data);
				client = redisClient.getClient();
	      client.setex(url, 86400, JSON.stringify(data)); // Set cache expiration to 24 hours (in seconds)
				res.json(data);
				console.log(req.params.url, ' response time:',
										res.get('X-Response-Time'), ' done by ', process.pid);
    })
	}

  /*-- /Helper Functions --*/

	exports.getReadabilityData = getReadabilityData;

})();
