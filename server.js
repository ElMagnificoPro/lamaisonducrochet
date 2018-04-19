// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
const https = require('https');
const fs = require('fs');
var sanitize = require('sanitize');
//var port     = process.env.PORT  || 8080;
//var path	 = require ('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var request = require('request');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

//openshift
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


//https

var forceHttps = function (req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  return next();
};
app.use(forceHttps);


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
//require('./config/articleConfig');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/resources', express.static(__dirname + '/resources'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'YammaLasmarDounyHEY',
  cookie: {
    maxAge: 3600000 * 24 * 30
  },
  rolling: true,
  resave: true,
  saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(sanitize.middleware); //sanitizer
// routes ======================================================================
require('./app/routes.js')(app, passport, nodemailer, smtpTransport, request); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
//app.listen(port);
/*
app.listen(port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + port)
});
console.log('The magic happens on port ' + port);
*/

const httpsOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(port, server_ip_address, () => {
  console.log('the magic happens on ' + server_ip_address + ":" + port);
});