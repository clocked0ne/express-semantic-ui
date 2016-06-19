'use strict';

var path         = require('path');
var express      = require('express');
var favicon      = require('serve-favicon');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var compress     = require('compression');
var swig         = require('swig');
var session      = require('express-session');
var FileStore    = require('session-file-store')(session);
var config       = require('./config/config');
var bundle       = require('./bundle.result.json');
var index        = require('./routes/index');
var utils        = require('./lib/utils');

var app = express();

var fileStoreOptions = {
	reapAsync: true
};

// view engine setup
swig.setFilter('stringToNumber', utils.stringToNumber);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Configure ETag on headers
// Explicitly set this to enabled with weak mode.
// Express ETag is based on body and encoding not on inode
//
// http://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation
app.set('etag', 'weak');

if(config.requestLogging){
	// Logger docs - http://www.senchalabs.org/connect/logger.html
	morgan.token('node-info', function getNodeInformation() {
		return process.env.HOSTNAME + ':' + config.port + '/' + 'PID:'+ process.pid;
	});
	morgan.token('host', function getHostInformation(req) {
		return req.headers.host || '-';
	});
	// We define a function to get the ip address from
	// special headers otherwise we will get load balancer IP.
	morgan.token('ip-addr', function getNode(req) {
		return req.headers['x-forwarded-for'] || req.connection.remoteAddress || '-';
	});
	app.use(morgan(':ip-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"; ":user-agent" HOST::host "Stingray Node" :node-info :response-time ms -'));
}

// Remove powered by Express from the headers. Securitz
app.disable('x-powered-by');

// Value used to control max-age on Header - "Cache-Control:public, max-age=?"
// https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#defining-optimal-cache-control-policy
// One year is standard - https://www.ietf.org/rfc/rfc2616.txt
var cacheOneYear = 31536000000;
app.use(compress());

if(!config.frontend.useCDN) app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheOneYear }));

var sessionObj = {
	secret: config.session.secret,
	name:   config.session.name,
	store:  new FileStore(fileStoreOptions),
	cookie: {},
	resave: false,
	saveUninitialized: false
};
if (app.get('env') === 'production') {
	app.set('trust proxy', 1); // trust first proxy
	sessionObj.cookie.secure = true; // serve secure cookies
}

app.use(cookieParser(config.session.secret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionObj));
// If using Passport, initialise it here

// Set custom headers for all routes. Securitz
app.use(function (req, res, next) {
	res.set('Cache-Control', 'no-cache="Set-Cookie, Set-Cookie2"');
	res.set('X-Content-Type-Options', 'nosniff');
	res.set('X-Frame-Options', 'DENY');
	res.set('X-XSS-Protection', '1; mode=block');
	if (req.secure) res.set('Strict-Transport-Security', 'max-age=10886400; includeSubDomains; preload');
	next();
});

// Middleware to set response local variables scoped to the request
app.use(function(req, res, next){
	res.locals.frontend = config.frontend;
	res.locals.bundle = bundle;
	next();
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
	console.log("Turning caching off in development\n");
	app.set("view cache", false);
	swig.setDefaults({ cache: false });

	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		if(err.status===404)
			res.render('404');
		else
			res.render('error', {
				message: err.stack,
				error: err
			});
	});
}

// production error handler, no stack traces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	if(err.status===404)
		res.render('404');
	else
		res.render('error', {
			message: 'Something went terribly wrong. Please come back later.',
			error: {}
		});
	console.error(err.message);
});

module.exports = app;
