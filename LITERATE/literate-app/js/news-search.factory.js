(function () {

  'use strict';

  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('956baf17474f4718a026c1f2c32e6c55'); // this is our access key, use this as an environment variable instead?

  let sources = ['bbc-news', 'nbc-news', 'the-new-york-times'];//, 'the-wall-street-journal'];
  let sortBy = 'relevancy';
  let startDate = new Date('2018-01-01');
  let today = new Date();
  let page = 1;
  let numResults = 100;

  class NewsSearch {

    constructor() {

    }

    getResults(query) {
      return getSearchResults(query);
    }

    setPageNumber(number) {
      page = number;
    }
  }

  /**
   * Calls NewsApi with a query and returns
   * the results as a promise.
   * @param  {string} query - search parameters
   * @return {Promise} - resolves when NewsApi gives a response
   */
  function getSearchResults(query) {
    return new Promise((resolve, reject) => {
      newsapi.v2.everything({
        q: query,
        sources: sources.join(', '),
        // domains: 'bbc.co.uk, techcrunch.com',
        from: startDate,
        to: today,
        language: 'en',
        sortBy: sortBy,
        page: page,
        pageSize: numResults
      }).then(response => {
        if(response.status = 'ok') {
          delete response.status;
          resolve(response);
        } else {
          reject('error');
        }
      });
    });
  }

  module.exports = NewsSearch;

})();
