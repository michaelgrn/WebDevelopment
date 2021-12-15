(function () {

	'use strict';

	const sanitizeHtml = require('sanitize-html');

	class WebpageService {

		constructor() {

		}

		isVideo(url) {
			return isVideo(url);
		}

		isSubscription(html) {
			return isSubscription(html);
		}

		numberOfImages(html) {
			return numberOfImages(html);
		}

		stripHtml(html) {
			return stripHtml(html);
		}

	}

	/**
	 * Checks if an html string is only a snippet
	 * from a subscription-required article.
	 * @param  {string}  html - html string
	 * @return {Boolean} true if subscription, false otherwise
	 */
	function isSubscription(html) {
		// TODO: other checks for being subscription based, check for patterns in HTML
		return numberOfOccurrences(html, 'article_snippet') > 0;
	}

	/**
	 * Checks if a url contains a reference to a video.
	 * @param  {string}  url - url to check
	 * @return {Boolean} true if video, false otherwise
	 */
	function isVideo(url) {
		return url.includes('video');
	}

	/**
	 * Counts and returns the number of images
	 * in an html string.
	 * @param  {string} html - html string
	 * @return {int} number of images
	 */
	function numberOfImages(html) {
		return numberOfOccurrences(html, '<img');
	}

	/**
	 * Strips html tags and attributes out
	 * of an html string.
	 * @param  {string} html - string of html
	 * @return {string} stripped html
	 */
	function stripHtml(html) {
		return sanitizeHtml(html, {
			allowedTags: [],
			allowedAttributes: []
		}).trim();
	}

	/*-- Helper Functions --*/

	/**
	 * Counts and returns the number of occurrences
	 * of an expression in an html string.
	 * @param  {string} html - html string
	 * @param  {string} expression - expression to search for
	 * @return {int} number of occurrences
	 */
	function numberOfOccurrences(html, expression) {
		let regex = new RegExp(expression, 'g');
		return (html.match(regex) || []).length;
	}

	/*-- /Helper Functions --*/

	module.exports = WebpageService;

})();
