var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();
var schedule = require('node-schedule');

var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo')(session);
//var io = require('socket.io')(app);

var serverName = 'site';
var logger = require('./helpers/logger');
var server;


var respond = require('./middlewares/api-response');
var SOCKET_ON=1;
var socket_enabled=SOCKET_ON;

app.use(express.static('./frontend/public'));

var configs = require('./configs');

var mongoose = require('mongoose');
var sessionDBAddress = configs.session;
mongoose.connect('mongodb://'+sessionDBAddress+'/sessionDB');

var Users = require('./models/users');
var Actions = require('./models/actions');
var Errors = require('./models/errors');
var Tournaments = require('./models/tournaments');

var Packs = require('./models/packs');

var Money = require('./models/money');

var c = require('./constants');

var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
//console.log(configs, configs.vk);

var request = require('request');


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
        Errors.add(null, 'passport.use', { profile:profile, err:err });
        return done(err, null);
      }

      if (!body) {
        Errors.add(null, 'passport.use.body.null', { err:err });
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

/*app.use(session({
  store: new MongoStore({
    url: 'mongodb://root:myPassword@mongo.onmodulus.net:27017/3xam9l3'
  }),
  secret: '1234567890QWERTY'
}));*/

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


var requestCounter=0;

app.use(function(req,res,next){
  //console.log('req.user', req.user, 'req.session', req.session);

  requestCounter++;
  
  res.locals.session = req.session;
  //res.locals.vkUser = req.user;
  next();
});

// app.use('/leagues', require('./routes/leagues'));
// app.use('/VK/', require('./routes/VK'));

//var handler = require('./errHandler')(app, Log, serverName);
/*app.use(function(err, req, res, next){
  console.error('ERROR STARTS!!');
  //console.error(err.stack);
  //console.error('-------------');
  Log('Error happened in ' + serverName + ' : ' + err, 'Err');
  Log('Description ' + serverName + ' : ' + err.stack, 'Err');
  console.error(err);
  console.error('CATCHED ERROR!!!! IN: ' + req.url);
  res.status(500).send('Something broke!');
  next(err);
});*/



/*app.set('views', './views');
app.set('views', './games/PingPong');*/
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

var sender = require('./requestSender');
var sort = require('./helpers/sort');

//var compression = require('compression');
//app.use(compression());
if (configs.cacheTemplates) app.set('view cache', true);

server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
// socket land

var io;
var SOCKET = require('./socket')(app, server);
if (socket_enabled) {
  io = SOCKET.io;
}
var aux = require('./models/auxillary');
aux.io(SOCKET); // set socket in aux

// var realtime = require('./helpers/realtime')(app, io);
var realtime = require('./helpers/realtime')(io);

// var collections = require('./Modules/site/collections')(app, Answer, sender, Log, aux);
var gifts = require('./Modules/site/gifts')(app, aux);
var admin = require('./Modules/site/admin')(app, AsyncRender);
var money = require('./Modules/site/money')(app, aux);

var user = require('./Modules/site/user')(app, AsyncRender);
var tournaments = require('./Modules/site/tournaments')(app, aux);
var clientStats = require('./Modules/site/clientStats')(app, AsyncRender, aux);

var mailchimp = require('./routes/mailchimp')(app, aux);
var messages = require('./routes/messages')(app, aux);

// var category = require('./routes/category')(app, aux, realtime, SOCKET, io);

// var teamz = require('./routes/teams')(app, aux, realtime, SOCKET, io);

// var TournamentReg = require('./models/tregs');

var middlewares = require('./middlewares');
var isAdmin = middlewares.isAdmin;

function AsyncRender(targetServer, reqUrl, res, options, parameters){ //options: parameters, renderPage, callback, sender, failCallback
  var basicInfo = targetServer+': /' + reqUrl + ' ';
  if (parameters) basicInfo += JSON.stringify(parameters);
  // res==null generally means that I will use AsyncRender in promise cascade
  Log('AsyncRender', 'Transport');
  if (targetServer && reqUrl){
    sender.sendRequest(reqUrl, parameters || {}, '127.0.0.1', targetServer, res||null, function (err, response, body, res){
      Log(JSON.stringify(body), 'Transport');
      //if (err) return handleError(err, targetServer, reqUrl, res || null, options || null, 'ERR');
      if (!options){
        // We don't know, which page to render or what to do with this data, 
        // so we ... 
        if (res) { sender.Answer(res, body); } //send data to client Server or client ajax script
        else{ return body; } // or return an answer if it is used in promise
      }

      else{
        if (options.callback){ // if we have a callback - run it!
          if (options.failCallback){
            Log('failCallback exists!! body.result: ' + body.result, 'Transport');
            switch (body.result){
              case 'OK': break;
              default: 
                options.failCallback(res || null, body, options, parameters);
                return;
              break;
            }
          }
          Log(' execute normal callback: ' + reqUrl + ' ', 'Transport');
          //else - execute normally
          options.callback(res || null, body, options, parameters);
        }
        else{ // ... or try to render page/ answer JSON/ return value(answer)
          Log(' No callback found... try to deal with it ' + basicInfo, 'Transport');
          if (options.renderPage) { //if renderPage is specified we try render it
            if (res) { res.render(options.renderPage, {msg:body} ); } //we can send data properly
            else { Log('Oops, you specified a renderPage |' + options.renderPage + '.jade| but forgot to pass res(ponse) object ', 'WARN'); }
          } 
          else{
            if (res){ sender.Answer(res, body); }
            else{ return body; }
          }
        }

      }

    });

  }
}

// var CRON_TASK = schedule.scheduleJob('33 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });


function Log(data, topic){
  JSLog({msg:data}, topic);
}

var Fail = { result:'fail' };

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
  var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //


  var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;



function isNumeric(num) { return !isNaN(num); }

app.get('/counter', function (req, res){
  res.json({requests:requestCounter});
});

app.post('/FinishGame', FinishGame);


app.get('/realmadrid', Landing('realmadrid', 'realmadrid.jpg'));
app.get('/b.gareth', Landing('bgareth', 'realmadrid.jpg'));

function Landing(name, picture){
  return function (req, res){
    var obj = { landing: name };
    if (picture) obj.picture = picture;

    if (isAuthenticated(req)){
      return res.redirect('/')
    }
    res.render('landing/'+name, obj);
  }
}

app.get('/realtime/update', middlewares.isAdmin, function(req, res){
  realtime().UPDATE_ALL();
  res.end('OK');
});

var tournament_finisher = require('./chains/finishTournament')(aux);

function FinishGame(req, res){
  var data = req.body;
  sender.Answer(res, { result:'OK', message: 'FinishGame' } );

  // sender.sendRequest("FinishGame", data, '127.0.0.1', 'DBServer');
  logger.log('FinishGame', data);

  tournament_finisher.finish(data);
}


app.all('/StartTournament', function (req, res){
  logger.log('Site starts tournament');
  var data = req.body;

  sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer

    var obj = {
      tournamentID: data.tournamentID,
      port: data.port,
      host: data.host,
      logins: data.logins
    };
    Send('StartTournament', obj);
    // io.emit('StartTournament', obj);
  //+req.body.tournamentID
  res.end();
});

function isAuthenticated(req){ return (req.session && req.session.login); } // || req.user;

app.post('/Log', function (req, res){
  //res.end('sended');
  res.end('');
  var msg = req.body;
  var topic = req.body.topic;
  //console.log(topic);
  JSLog(msg, topic || null);
});

app.get('/Log', function (req, res){
  res.sendFile(__dirname + '/Logs.html');
});

app.get('/Football', function (req, res) {
  res.render('Football');
});

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

  Actions.add(req.login || 'user-undefined', 'Payment-page-opened', { ammount, type });

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

// packs + cards

// --- end packs

app.get('/Total', (req, res) => { res.render('Total')});

app.get('/SpecLogs/:topic', function (req, res){
  //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
  var topic = req.params.topic||'Forever';
  res.render('SpecLogs', {topic:topic});
});

function JSLog(msg, topic){
  if (socket_enabled) {
    io.emit(topic?topic:'Logs', JSON.stringify(msg));
  }
}

app.get('/Alive', function (req, res){ res.render('Alive'); });
app.get('/test-chat', function (req, res){ res.sendFile(__dirname + '/sock.html'); });

app.post('/addQuestion', middlewares.authenticated, function (req, res){
  var login = req.login;
  var data = req.body;
  var question = data.question;

  //
  var answer1 = data.answer1;
  var answer2 = data.answer2;
  var answer3 = data.answer3;
  var answer4 = data.answer4;

  var topic = data.topic;

  var answers = [];
  answers.push(answer1);
  answers.push(answer2);
  answers.push(answer3);
  answers.push(answer4);

  var correct = data.correct;
  var obj = {
    createdBy: login,
    question: question,
    answers: answers,
    correct: correct
  };

  if (topic) {
    obj.topic = topic;
  }
  console.log(obj);

  var question_is_valid = login && question && answer1 && answer2 && answer3 && answer4 && correct && !isNaN(correct);
  if (!question_is_valid) return res.json({ code:0, msg: 'Произошла ошибка' })

  sender.customSend("offerQuestion", obj, '127.0.0.1', 5010, res, function (error, response, body, res){
    if (error) return res.json({ code:0, msg: 'Ошибка сервера. Повторите вашу попытку чуть позже' })
    if (body){
      var code=0;
      var message = 'Ошибка';

      if (body.result=='ok') {
        code = 1;
        message = 'Добавление произошло успешно, вопрос отправлен на модерацию!';

        Send('activity', { type:'addQuestion', sender: login, about: topic||' всё обо всём' })
      }
      res.json({ code:code , msg:message });
    }
  });

  // if (login && question && answer1 && answer2 && answer3 && answer4 && correct && !isNaN(correct)){
  //   sender.customSend("offerQuestion", obj, '127.0.0.1', 5010, res, function (error, response, body, res){
  //     if (error) return res.render('AddQuestion', { code:0, msg: 'Ошибка сервера. Повторите вашу попытку чуть позже' })
  //     if (body){
  //       var code=0;
  //       var message = 'Ошибка';
  //       if (body.result=='ok') {
  //         code = 1;
  //         message = 'Добавление произошло успешно, вопрос отправлен на модерацию!'
  //       }
  //       res.render('AddQuestion', { code:code , msg:message });
  //     }
  //   });
  // } else {
  //   res.render('AddQuestion', { code:0, msg: 'Произошла ошибка' });
  // }
});

//Error: Failed to serialize user into session
/*app.get('/vk-auth', function (req, res){
  var uid = req.query.uid;
  var first_name = req.query.first_name;
  Log('uid: ' + uid + '. '+ first_name, 'Users');
  //var last_name = 
  res.end('uid ' + uid + ' OK!');
})*/

function vkAuthSuccess(req, res, next) {
  var login = req.user.login;
  req.login = login;
  // Log("SetInviter " + inviter + " for " + login, "Users");

  Actions.add(login, 'login', { auth:'vk' });
  next();
  // saveSession(req, res, inviter, login);
}

var AUTH_SUCCESS_REDIRECT_PAGE='/';

function session_save(req, res, next){
  var login = req.login;

  req.session.save(function (err){
    if (err) {
      Errors.add(login, 'session_save', { err:err });
      // res.render(inviterUrl,{msg:err});
      return next(err);
    }

    req.session.login = login;
    
    res.redirect(AUTH_SUCCESS_REDIRECT_PAGE);
    // next();
  })
}

var vkAuth = passport.authenticate('vkontakte', { failureRedirect: '/', display: 'mobile' });

app.get('/vk-auth', vkAuth, vkAuthSuccess, session_save);

app.post('/tellToFinishTournament', function (req, res){
  var data = req.body;
  console.log('tellToFinishTournament', data);
  var tournamentID = data.tournamentID;
 
  sender.Answer(res, { result:'OK', message:'FinishGame' } );

  aux.system('tellToFinishTournament', { tournamentID });
  // Actions.add('SYSTEM' ,'stopTournament', { tournamentID:tournamentID });

  Send('FinishTournament', { tournamentID, data })
});

app.get('/Tell', isAdmin, function (req, res){
  res.render('Tell');
  //res.sendFile(__dirname + '/sock1.html');
});

app.post('/Tell', isAdmin, function (req, res){
  var message = req.body.message;
  var action = req.body.action;

  console.log('Tell', message, req.body);
  Send('Tell', { message:message, action:action || null });

  res.render('Tell');
});


app.get('/ModalTest', aux.answer('ModalTest'));

// server = app.listen(8888, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });
// // socket land

// var io;
// var SOCKET = require('./socket')(app, server)
// if (socket_enabled){
//   io = SOCKET.io;
// }

function Send(tag, message, force){
  if (socket_enabled || force){
    io.emit(tag, message);
    // deleted here
  }
}

app.post('/Winners', function (req, res){
  res.end('OK');
  var winners = req.body.winners;
  var tournamentID = req.body.tournamentID;

  Send('winners', { winners, tournamentID });
});


var players = [];
setInterval(function (){
  // Send('players', {msg: players});
  Log('Online: ' + JSON.stringify(players), 'Users');
}, 20000);

setInterval(function () { players=[]; }, 60000);

app.post('/mark/Here/:login', function (req, res){
  var login = req.params.login;
  // strLog('Online: ' + login, 'Users');
  players.push(login);

  res.end('');
});
