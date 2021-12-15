(function () {

  'use strict';

  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const Readability = require('../libraries/Readability.js');
  const fetch = require('node-fetch');

  class MozillaReadability {
  	
  	constructor() {
      
  	}

  	getWebpageData(url) {
      return getWebpageData(url);
  	}

  }
  
  /**
   * Retrieves the html of a webpage from a
   * url and returns extracted data. 
   * @param  {string} url - webpage url
   * @return {Promise}: resolves with ParsePage results
   */
  function getWebpageData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.text())
        .then(body => {
          resolve(parsePage(url, body));
        }).catch(err => {
          reject('error:', err);
        });
    });
  }

  /*-- Helper Functions --*/

  /**
   * Parses the html of a page and extracts 
   * data using the mozilla readability library.
   * Returns data as an object.
   * @param  {string} url - webpage url
   * @param  {string} html - html of webpage
   * @return {Object}:
   * {
      uri: article url
      title: article title
      content: HTML string of processed article content
      length: length of article, in characters
      excerpt: article description, or short excerpt from content
      byline: author metadata
      dir: content direction
    }
   */
  function parsePage(url, html) {
    const OPTIONS = {features: {
      FetchExternalResources: false,
      ProcessExternalResources: false
    }};
    const dom = new JSDOM(html, OPTIONS);
    const doc = dom.window.document;
    global.Node = dom.window.Node;
    const reader = new Readability(url, doc);
    return reader.parse();
  }

  /*-- /Helper Functions --*/

  module.exports = MozillaReadability;

})();