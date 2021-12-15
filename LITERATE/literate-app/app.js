const express = require('express'); // imports the express module
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const index = require('./routes/index');
const expressVue = require("express-vue");

var app = express(); // creates an express application

// ExpressVue Setup
const vueOptions = {
  rootPath: path.join(__dirname, "routes"),
  vueVersion: "2.5.13",
  head: {
    styles: [
      { style: "/scripts/bootstrap/dist/css/bootstrap.min.css" },
      { style: "https://use.fontawesome.com/releases/v5.0.10/css/all.css" },
      { style: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"},
      { style: "stylesheets/style.css" },
      { style: "stylesheets/animation.css" }
    ]
  },
  scripts: [
    {src: '/scripts/axios/dist/axios.min.js'}
  ],
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// view engine setup
app.set('views', path.join(__dirname, 'views')); // set directory to contain the templates
app.set('view engine', 'hbs'); // set view engine to use handlebars

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'js')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
