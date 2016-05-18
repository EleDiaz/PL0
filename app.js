var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var users = require('login-mongo');

var home = require('./routes/index');
var example = require('./routes/example');
var about = require('./routes/about');
var compile = require('./routes/compile');
var user = require('./routes/users');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('ip', (process.env.IP || '0.0.0.0'));

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    indentedSyntax: true,
    outputStyle: 'compressed',
    prefix: ''
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/features', home);
app.use('/examples', example);
app.use('/about', about);
app.use('/compile', compile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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


module.exports = app;
