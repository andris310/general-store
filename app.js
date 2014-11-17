var express = require('express');
var app = express();

var jade = require('jade');
var stylus = require('stylus');

var staticRt = require('./routes/staticRt');

var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(
//   stylus.middleware({
//     src: __dirname + '/public',
//     compile: compile
//   })
// );

app.use(
  stylus.middleware({
    src: path.resolve(__dirname),
    dest: path.resolve(__dirname, 'public'),
    compile: compile
  })
);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));
console.log('SECRET: ', process.env.SESSION_SECRET)
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));

app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// passport config

app.use('/', staticRt);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development only
if ('development' == app.get('env')) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function compile(str, path) {
  return stylus(str).set('filename', path);
}

module.exports = app;
