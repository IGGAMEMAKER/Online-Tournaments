var express = require('express');
//var parseurl = require('parseurl');

var app = express();


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var configs = require('./configs');
var sessionDBAddress = configs.session;

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+sessionDBAddress+'/sessionDB');

app.use(require('cookie-parser'));

app.use(session({
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: true,
}));

app.use(function(req,res,next){
  requestCounter++;
  res.locals.session = req.session;
  next();
});

var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies


var gifts = require('./routes/gifts');
var tournaments = require('./routes/tournaments');
var admin = require('./routes/admin');
var money = require('./routes/money');
var user = require('./routes/user');
var clientStats = require('./routes/clientStats');

app.use('/api/gifts', gifts);
app.use('/api/tournaments', tournaments);
app.use('/api/admin', admin);
app.use('/api/money', money);
app.use('/api/user', user);
app.use('/api/clientStats', clientStats);



/*var routes = require('./routes/index');
var users = require('./routes/users');



app.use('/', routes);
app.use('/users', users);*/