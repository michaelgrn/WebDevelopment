(function () {

  'use strict';

  var express = require('express');
  var router = express.Router();

  const NewsSearch = require('../js/news-search.factory');
  const newsSearch = new NewsSearch();

  const ReadabilityFactory = require('../js/readability.factory');
  const readabilityFactory = new ReadabilityFactory();

  const PostGres = require('../js/postgres.factory');
  const postgres = new PostGres();

  const Window = require('window');
  const window = new Window();

  const uuidv1 = require('uuid/v1');

  const vueOptions = {
    head: {
      title: 'LITERATE',
      scripts: [
        {src: '/scripts/axios/dist/axios.min.js'}
      ],
    }
  };

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if(req.cookies.sid == null){
      let sid = uuidv1();
      res.cookie('sid', sid);
    }
    //sets cookie values to default
    res.cookie('edLow', 5);
    res.cookie('edHigh', 14);
    res.cookie('wordLow', 0);
    res.cookie('wordHigh', 100000);

    const data = {
      title: 'LITERATE'
    };
    res.renderVue('../views/home.vue', data, vueOptions);
  });

  /* GET debug page. */
  router.get('/debug', function(req, res, next) {
    const data = {
      title: 'Debug'
    };
    let pid = uuidv1();
    res.cookie('pid', pid);
    res.renderVue('../views/debug.vue', data, vueOptions);
  });

  /* GET search page. */
  router.get('/searchPage', function(req, res) {
    let pid = uuidv1();
    res.cookie('pid', pid);
    var searchedFor = req.param('queryField');
    const data = {
      title: 'LITERATE',
      searchQuery: searchedFor,
    };
    res.renderVue('../views/search.vue', data, vueOptions);
  });

  /* GET reroutes after right click. */
  router.get('/reroute', function(req, res) {
    var url = req.param('url');
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;

    var text = {
      'Link': url,
    }
    postgres.logEvent("Right Click New Tab", text, sid, pid);

    res.redirect(url);
  });

  /* POST listener for search input */
  router.post('/search', performSearch);

  /* POST listener for articles to analyze */
  router.post('/readability', analyzeArticle);

  /*POST listener for database logging*/
  router.post('/logContextMenu', logContextMenu);
  router.post('/logFilterChange', logFilterChange);
  router.post('/logReadability', logReadability);
  router.post('/logFilteredContextMenu', logFilteredContextMenu);
  router.post('/logFilteredRedirect', logFilteredRedirect);
  router.post('/logGradeChange', logGradeChange);
  router.post('/logRedirect', logRedirect);
  router.post('/logRedirectClick', logRedirectClick);
  router.post('/logSearch', logSearch);
  router.post('/logSetName', logSetName);
  router.post('/logToggleInfo', logToggleInfo);
  router.post('/logWordCountChange', logWordCountChange);

  /**
  * Router function for analyzing readability
  * of an article.
  * Responds with data containing updated
  * article.
  * @param  {object} req - request object
  * @param  {object} res - response object
  * @return {object} analyzed article data
  */
  function analyzeArticle(req, res) {
    let article = req.body.article;
    getReadabilityData(article)
    .then(updatedArticle => {
      Object.assign(updatedArticle, article);
      updatedArticle.show = false;
      updatedArticle.resultsLoaded = true;
      updatedArticle.filtered = {
        educationLevel: false,
        wordCount: false
      };
      const data = {
        article: updatedArticle,
        error: '',
      };

      res.json(data);
    })
    .catch(error => {
      const data = {
        article: article,
        error: 'Unable to reach Readability Server',
      }
      res.json(data);
    });
  }

  /**
  * Fix the publishedAt property of each article to
  * a more readable string.
  * @param  {Array[objects]} articles - array of articles to be fixed
  * @return {Array[Objects]} array of fixed articles
  */
  function fixArticleDates(articles) {
    articles.forEach(article => {
      article.publishedAt = new Date(article.publishedAt).toLocaleDateString();
    });
    return articles;
  }

  /**
  * Gets readability data from the server for an article.
  * @param  {Object} article - object representing an article
  * @return {Promise}
  */
  function getReadabilityData(article) {
    return readabilityFactory.getData(article.url);
  }
  /**
  * Logger function for logging an event.
  * This one logs a right click on an article.
  * @param  {object}   req - request object
  */
  function logContextMenu(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let link = req.body.ArticleURL;
    let index = req.body.ArticleIndex;
    var text = {
      'Index': index,
      'Link': link,
    }
    postgres.logEvent("Right Clicked on Link", text, sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs the toggle of filter hidden events.
  * @param  {object}   req - request object
  */
  function logFilterChange(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let stats = req.body.hideFilteredOutResults;
    var text = {
      'Filter Status': stats
    }
    postgres.logEvent("Filter Results Changed", JSON.stringify(text), sid, pid)
    res.send()
  }

  /**
  * Logger function for logging an event.
  * This one logs readability data for each article.
  * @param  {object}   req - request object
  */
  function logReadability(req, res){
    let content = req.body.content;
    let source = req.body.source;
    let author = req.body.author;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let urlToImage = req.body.urlToImage;
    let publishedAt = req.body.publishedAt;
    let flesch = req.body.flesch;
    let imageCount = req.body.imageCount;
    let subscription = req.body.subscription;
    let video = req.body.video;
    let wordCount = req.body.wordCount;
    let keywords = req.body.keywords;
    let hasTags = req.body.hasTags;

    var text = {
      'url': url,
      'content': content,
      'source':  source,
      'author': author,
      'title': title,
      'description': description,
      'urlToImage': urlToImage,
      'publishedAt': publishedAt,
      'flesch': flesch,
      'imageCount': imageCount,
      'subscription': subscription,
      'video': video,
      'wordCount': wordCount,
      'keywords': keywords,
      'hasTags': hasTags,
    }
    postgres.logEventTwo(text)
    res.send()
  }

  /**
  * Logger function for logging an event.
  * This one logs a right click on a filtered out article.
  * @param  {object}   req - request object
  */
  function logFilteredContextMenu(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let link = req.body.ArticleURL;
    let index = req.body.ArticleIndex;
    var text = {
      'Index': index,
      'Link': link,
    }
    postgres.logEvent("Right Clicked on Filtered Out Link", text, sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs a redirect from a filtered out article.
  * @param  {object}   req - request object
  */
  function logFilteredRedirect(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let link = req.body.ArticleURL;
    let index = req.body.ArticleIndex;
    var text = {
      'Index': index,
      'Link': link,
    }
    postgres.logEvent("Clicked on Filtered out Link", text, sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs a change in the grade slider filter.
  * @param  {object}   req - request object
  */
  function logGradeChange(req,res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let NewLow = req.body.NewLow;
    let NewHigh = req.body.NewHigh;
    let OldLow = req.body.OldLow;
    let OldHigh = req.body.OldHigh;
    var text = {
      'Old Low': OldLow,
      'Old High': OldHigh,
      'New Low': NewLow,
      'NewHigh': NewHigh,
    }
    postgres.logEvent("Grade Range Changed", JSON.stringify(text), sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs the toggle of filter hidden articles.
  * @param  {object}   req - request object
  */
  function logRedirect(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let link = req.body.ArticleURL;
    let index = req.body.ArticleIndex;
    var text = {
      'Index': index,
      'Link': link,
    }
    postgres.logEvent("Clicked on Link", text, sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs the right click new tab
  * @param  {object}   req - request object
  */
  function logRedirectClick(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let link = req.body.ArticleURL;

    var text = {
      'Link': link,
    }
    postgres.logEvent("Right Click New Tab", text, sid, pid);
    res.send();
  }

  /**
  * Logger function for logging an event.
  * This one logs a search query (but not the results).
  * @param  {object}   req - request object
  */
  function logSearch(req, res) {
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let query = req.body.searchQuery;
    var text = {
      'search term': query
    }
    postgres.logEvent("Searched For",JSON.stringify(text), sid, pid);
    res.send()

  }

  /**
  * Logger function for logging an event.
  * This one sets a new name for a session.
  * @param  {object}   req - request object
  */
  function logSetName(req, res) {
    let setSid = uuidv1();
    res.cookie('sid', setSid);
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let name = req.body.sessionName;
    var text = {
      'Set Name/New Session': name
    }
    postgres.logEvent("Set Name/New Session",JSON.stringify(text), setSid, pid);
    res.send()
  }

  /**
  * Logger function for logging an event.
  * This one logs the toggle of the more/less button.
  * @param  {object}   req - request object
  */
  function logToggleInfo(req, res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let show = req.body.Show;
    let index = req.body.ArticleIndex;
    let url = req.body.ArticleURL;
    let keywords = req.body.ArticleKeywords;
    let flesch = req.body.Flesch;
    let wordcount = req.body.WordCount;
    let imagecount = req.body.Images;
    if(show){
      var text = {
        'Show': show,
        'Index': index,
        'URL': url,
        'Flesch': flesch,
        'WordCount': wordcount,
        'Number of Images': imagecount,
        'Keywords' : keywords,

      }
    }else{
      var text = {
        'Show': show,
        'Index': index,
      }
    }
    postgres.logEvent("More Info Toggled", text, sid, pid)
    res.send()
  }

  /**
  * Logger function for logging an event.
  * This one logs a change in the word counter slider.
  * @param  {object}   req - request object
  */
  function logWordCountChange(req,res){
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let NewLow = req.body.NewLow;
    let NewHigh = req.body.NewHigh;
    let OldLow = req.body.OldLow;
    let OldHigh = req.body.OldHigh;
    var text = {
      'Old Low': OldLow,
      'Old High': OldHigh,
      'New Low': NewLow,
      'NewHigh': NewHigh,
    }
    postgres.logEvent("Word Count Changed", JSON.stringify(text), sid, pid)
    res.send()
  }


  /**
  * Router function for performing a search.
  * Uses news search to fetch articles from
  * the specified query.
  * Responds with data from the search.
  * @param  {object}   req - request object
  * @param  {object}   res - response object
  * @return {object} search data
  */
  function performSearch(req, res) {
    let sid = req.cookies.sid;
    let pid = req.cookies.pid;
    let query = req.body.searchQuery;
    newsSearch.getResults(query).then(results => {
      const data = {
        title: 'LITERATE',
        numArticles: results.articles.length,
        articles: fixArticleDates(results.articles),
        queryString: query,
        error: '',
      };
      postgres.logEvent("Search Returned", JSON.stringify(data), sid, pid);

      res.json(data);
    });
  }

  module.exports = router;

})();
