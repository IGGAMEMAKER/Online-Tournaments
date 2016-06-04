var express = require('express');
//var parseurl = require('parseurl');

var app = express();
var server;

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var configs = require('./configs');
var sessionDBAddress = configs.session;

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+sessionDBAddress+'/sessionDB');


var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(session({
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: true,
}));

requestCounter=0;

app.use(function(req,res,next){
  requestCounter++;
	console.log('request: '+ requestCounter);
  res.locals.session = req.session;
  next();
});


var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies

//var gifts = require('./routes/gifts');
var tournaments = require('./routes/tournaments');//(mongoose);
/*var admin = require('./routes/admin');
var money = require('./routes/money');
var clientStats = require('./routes/clientStats');*/

//app.use('/api/gifts', gifts);

app.set('views', ['./frontend/views', './frontend/views/admin', './frontend/games/PingPong', './frontend/games/Questions']);


app.set('view engine', 'jade');

app.use('/api/tournaments', tournaments);

app.get('/', function(req, res){
	console.log('aaaaa');
	res.end('aaa');
});

/*app.use('/api/admin', admin);
app.use('/api/money', money);
app.use('/api/user', user);
app.use('/api/clientStats', clientStats);*/



/*var routes = require('./routes/index');



app.use('/', routes);
app.use('/users', users);*/

server = app.listen(7000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});