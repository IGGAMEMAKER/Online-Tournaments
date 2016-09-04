var express         = require('express');
var app = express();

var jade = require('jade'); // can remove

var logger = require('./helpers/logger');

var API = require('./helpers/API');

var middlewares = require('./middlewares');
var addQuestion = require('./middlewares/add-quiz-question');

var sender = require('./requestSender');

app.use(express.static('./frontend/public'));

// sessions and passport
var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo')(session);

var configs = require('./configs');

var mongoose = require('mongoose');
var sessionDBAddress = configs.session;
mongoose.connect('mongodb://' + sessionDBAddress + '/sessionDB');


var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new VKontakteStrategy({
    clientID:     configs.vk.app_id, // VK.com docs call it 'API ID'
    clientSecret: configs.vk.secret_id,
    callbackURL:  configs.vk.url
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(accessToken, refreshToken, profile);
    //console.log('passport.use', profile);

    sender.sendRequest("findOrCreateUser", profile, '127.0.0.1', 'DBServer', null, function (err, response, body, res){
      if (err) {
        API.errors.add(null, 'passport.use', { profile:profile, err:err });
        return done(err, null);
      }

      if (!body) {
        API.errors.add(null, 'passport.use.body.null', { err:err });
        // done(null, {})
        // return done(12, null);
        done(null, {})
      }

      return done(null, body);
    });

    //done(null, profile);

    //User.findOrCreate({ vkontakteId: profile.id }, function (err, user) { return done(err, user); });
  }
));

var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var SESSION_EXPIRATION_HOURS = 24 * 30;
var maxAge = SESSION_EXPIRATION_HOURS * 60 * 60 * 1000;

console.log('maxAge', maxAge);

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: '1234567890QWERTY',
  cookie: { maxAge: new Date(Date.now() + maxAge) },
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


var requestCounter = 0;

app.use(function(req, res, next) {
  //console.log('req.user', req.user, 'req.session', req.session);

  requestCounter++;

  res.locals.session = req.session;
  //res.locals.vkUser = req.user;
  next();
});

// app.use('/VK/', require('./routes/VK'));

//var handler = require('./errHandler')(app, Log, serverName);
/*
app.use(function(err, req, res, next){
  console.error('ERROR STARTS!!');
  //console.error(err.stack);
  //console.error('-------------');
  Log('Error happened in ' + serverName + ' : ' + err, 'Err');
  Log('Description ' + serverName + ' : ' + err.stack, 'Err');
  console.error(err);
  console.error('CATCHED ERROR!!!! IN: ' + req.url);
  res.status(500).send('Something broke!');
  next(err);
});
*/

var views = [
  './frontend/views',
  './frontend/views/admin',
  './frontend/games/PingPong',
  './frontend/games/Questions',
  './frontend/games/Football'
];

app.set('views', views);
//app.set('games/PingPong', './views');

app.set('view engine', 'jade');

//var compression = require('compression');
//app.use(compression());

if (configs.cacheTemplates) {
  app.set('view cache', true);
}

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://', host, port);
});

// socket land
var SOCKET_ON = 1;
var socket_enabled = SOCKET_ON;
var io;
//var io = require('socket.io')(app);
var SOCKET = require('./socket')(app, server);
if (socket_enabled) {
  io = SOCKET.io;
}
var aux = require('./models/auxillary');
aux.io(SOCKET); // set socket in aux

var realtime = require('./helpers/realtime')(io);

var templateData = () => ({
  collections: realtime().collections,
  cards: realtime().cards,
  packs: realtime().userpacks(),
  tournaments: realtime().tournaments
});

var application_page = (req, res) => {
  // res.render('index', { msg: templateData() })
  res.render('index');
};

var admin_page = (req, res) => {
  res.render('layout-admin', { msg: templateData() })
};

var markPaymentPageOpening = (req, res, next) => {
  var ammount = req.query.ammount || null;
  var type = req.query.buyType || null;
  var login = req.login || 'user-undefined';

  API.actions.add(login, 'Payment-page-opened', { ammount, type });

  next();
};

app.get('/', application_page);
app.get('/about', application_page);
app.get('/Tournaments', application_page);
app.get('/Frees', application_page);
app.get('/Elite', application_page);
app.get('/Crowd', application_page);
app.get('/Chat', application_page);
app.get('/Demo', application_page);

app.get('/Packs', middlewares.authenticated, application_page);
app.get('/Support', middlewares.authenticated, application_page);
app.get('/MyCollections', middlewares.authenticated, application_page);
app.get('/Cards', middlewares.authenticated, application_page);
app.get('/Payment', middlewares.authenticated, markPaymentPageOpening, application_page);

app.get('/admin/support', middlewares.isAdmin, admin_page);
app.get('/admin/support-chat', middlewares.isAdmin, admin_page);
app.get('/admin/packs', middlewares.isAdmin, admin_page);

app.get('/Football', function (req, res) { res.render('Football'); });

require('./Modules/site/gifts')(app, aux);
require('./Modules/site/admin')(app);
require('./Modules/site/money')(app, aux);

require('./Modules/site/user')(app);
require('./Modules/site/tournaments')(app, aux);
require('./Modules/site/clientStats')(app, aux);

require('./routes/mailchimp')(app, aux);
require('./routes/messages')(app, aux);

// function Log(data, topic){
//   JSLog({ msg: data }, topic);
// }


//Error: Failed to serialize user into session
/*app.get('/vk-auth', function (req, res){
 var uid = req.query.uid;
 var first_name = req.query.first_name;
 log('uid: ' + uid + '. '+ first_name, 'Users');
 //var last_name =
 res.end('uid ' + uid + ' OK!');
 })*/

function vkAuthSuccess(req, res, next) {
  var login = req.user.login;
  req.login = login;
  // Log("SetInviter " + inviter + " for " + login, "Users");

  API.actions.add(login, 'login', { auth:'vk' });
  next();
  // saveSession(req, res, inviter, login);
}

function session_save(req, res, next){
  var login = req.login;

  req.session.save(function (err){
    if (err) {
      API.errors.add(login, 'session_save', { err:err });
      // res.render(inviterUrl,{msg:err});
      return next(err);
    }

    req.session.login = login;

    res.redirect('/');// AUTH_SUCCESS_REDIRECT_PAGE
    // next();
  })
}

var vkAuth = passport.authenticate('vkontakte', { failureRedirect: '/', display: 'mobile' });

app.get('/vk-auth', vkAuth, vkAuthSuccess, session_save);


function isAuthenticated(req){ return (req.session && req.session.login); } // || req.user;

function Landing(landing, picture) {
  return function (req, res) {
    if (isAuthenticated(req)) {
      res.redirect('/');
      return;
    }

    res.render('landing/' + landing, { landing, picture });
  }
}

app.get('/realmadrid', Landing('realmadrid', 'realmadrid.jpg'));
app.get('/b.gareth', Landing('bgareth', 'realmadrid.jpg'));

// tournaments ....

var tournament_finisher = require('./chains/finishTournament')(aux);

app.post('/FinishGame', function (req, res){
  res.json({ result:'OK', message: 'FinishGame' });

  var data = req.body;

  logger.log('FinishGame', data);

  tournament_finisher.finish(data);
});

app.all('/StartTournament', function (req, res) {
  res.end();
  logger.log('Site starts tournament');

  var data = req.body;

  sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);

  var obj = {
    tournamentID: data.tournamentID,
    port: data.port,
    host: data.host,
    logins: data.logins
  };

  Send('StartTournament', obj);
  //+req.body.tournamentID
});

app.post('/tellToFinishTournament', function (req, res){
  res.json({ result: 'OK', message: 'FinishGame' });

  var data = req.body;
  logger.log('tellToFinishTournament', data);
  var tournamentID = data.tournamentID;

  Send('FinishTournament', { tournamentID, data })
});

app.post('/Winners', function (req, res){
  res.end('OK');
  var winners = req.body.winners;
  var tournamentID = req.body.tournamentID;

  Send('winners', { winners, tournamentID });
});
// --tournaments end

function Send(tag, message, force) {
  if (socket_enabled || force){
    io.emit(tag, message);
    // deleted here
  }
}

// etc
app.get('/counter', function (req, res){ res.json({ requests: requestCounter }); });

app.get('/Alive', function (req, res){ res.render('Alive'); });

app.get('/realtime/update', middlewares.isAdmin, function(req, res){
  realtime().UPDATE_ALL();
  res.end('OK');
});

app.post('/Log', function (req, res){
  //res.end('sended');
  res.end('');
  var msg = req.body;
  var topic = req.body.topic || 'Logs';
  //console.log(topic);
  Send(topic, JSON.stringify(msg));
});

app.get('/Log', function (req, res){
  res.sendFile(__dirname + '/Logs.html');
});

app.get('/SpecLogs/:topic', function (req, res){
  //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
  var topic = req.params.topic || 'Forever';
  res.render('SpecLogs', { topic });
});

app.post('/addQuestion', middlewares.authenticated, addQuestion);

// pulse
var players = {};
var unauthenticated = 0;

setInterval(function () {
  var authenticated = Object.keys(players).length;
  logger.debug('Online: ' + unauthenticated + ' unauthenticated users and' + authenticated, 'Users');

  // API.pulse.add(parseInt(unauthenticated) + parseInt(authenticated), 'online-count');
  // API.pulse.add(players, 'online');

  players = {};
  unauthenticated = 0;
}, 2 * 60000);

app.post('/mark/Here', function (req, res){
  // var login = req.params.login;
  var login = req.login;
  if (login) {
    // logger.debug('Online: ' + login);
    players[login] = 1;
  } else {
    unauthenticated++;
  }

  res.end('');
});
