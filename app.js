var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var database = require("./scripts/SQLConnection");
var SQLOP = require("./scripts/SQLOperation");

var indexRouter = require('./routes/index');
var appScriptsRouter = require('./routes/appScript');
var expressValidator = require('express-validator');
var session = require('express-session')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// We are using SESSION variables, so we need middleware for it.
app.use(session( {
  secret: "Super Secret Awesome Password 3",
  resave: false,
  saveUninitialized: false, 
  cookie: { 
		secure: false, //Set to false to save SESSION variables over non-https
		maxAge: 20 * 60 * 1000 //20 Minutes
	  }
}))

app.use('/resources', express.static(path.join(__dirname, '/public/images')));

app.use('/', indexRouter);
app.use('/App_Scripts', appScriptsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

//Must happen on startup
SQLOP.createDatabase(database.db, "Silent_Voyager");

SQLOP.query(database.db, "CREATE TABLE SilentVoyagerCoordinates(Username varchar(50), Latitude varchar(20)," +
				" Longitude varchar(20), Altitude varchar(20), City varchar(30), DateStamp varchar(50));");

SQLOP.query(database.db, "CREATE TABLE SilentVoyagerEmails(Username varchar(50), Email varchar(40));");

SQLOP.query(database.db, "CREATE TABLE SilentVoyagerNames(Username varchar(50), Name varchar(30));");

SQLOP.query(database.db, "CREATE TABLE SilentVoyagerPasswords(Username varchar(50), Password varchar(30));");

SQLOP.query(database.db, "CREATE TABLE SilentVoyagerUsernames(Username varchar(50));");

module.exports = app;


