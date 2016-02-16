var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo')(session);
//var io = require('socket.io')(app);

var serverName = 'site';

var server;

var SOCKET_ON=1;
var socket_enabled=SOCKET_ON;

app.use(express.static('./frontend/public'));
//app.use(express.static('./frontend/public'));

var configs = require('./configs');

var mongoose = require('mongoose');
var sessionDBAddress = configs.session;
mongoose.connect('mongodb://'+sessionDBAddress+'/sessionDB');

var Users = require('./models/users');
var Actions = require('./models/actions');

var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
//console.log(configs, configs.vk);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



passport.use(new VKontakteStrategy({
    clientID:     configs.vk.app_id, // VK.com docs call it 'API ID'
    clientSecret: configs.vk.secret_id,
    callbackURL:  configs.vk.url
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(accessToken, refreshToken, profile);
    //console.log('passport.use', profile);

    sender.sendRequest("findOrCreateUser", profile, '127.0.0.1', 'DBServer', null, function (err, response, body, res){
      if (err) return done(err, null);
      if (!body) return done(12, null);

      return done(null, body);
    });

    //done(null, profile);


    //User.findOrCreate({ vkontakteId: profile.id }, function (err, user) { return done(err, user); });
  }
));


var bodyParser = require('body-parser')
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

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


var requestCounter=0;

app.use(function(req,res,next){
  //console.log('req.user', req.user, 'req.session', req.session);

  requestCounter++;
  switch(req.url){
    case '/Log':
    case '/Admin':
    break;
    case '/Profile':
      //asd();
      //var a = 1/0;
      //console.error(a);
      //throw new Error('Catch Me If You Can');
    break;
    default:
      //console.log('Site: Request! ' + req.url);
    break;
  }
  
  res.locals.session = req.session;
  //res.locals.vkUser = req.user;
  next();
});



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
app.set('views', ['./frontend/views', './frontend/views/admin', './frontend/games/PingPong', './frontend/games/Questions']);
//app.set('games/PingPong', './views');




app.set('view engine', 'jade');

var sender = require('./requestSender');

var sort = require('./helpers/sort');


//var compression = require('compression');
//app.use(compression());
if (configs.cacheTemplates) app.set('view cache', true);


var gifts = require('./Modules/site/gifts')(app, AsyncRender, Answer, sender, Log, proxy);
var tournaments = require('./Modules/site/tournaments') (app, AsyncRender, Answer, sender, Log, proxy);
var admin =       require('./Modules/site/admin')       (app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);
var money =       require('./Modules/site/money')       (app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy);

var user = require('./Modules/site/user')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);

var clientStats = require('./Modules/site/clientStats')(app, AsyncRender, Answer, sender, Log, proxy, getLogin);


var TournamentReg = require('./models/tregs');

function AsyncRender(targetServer, reqUrl, res, options, parameters){//options: parameters, renderPage, callback, sender, failCallback
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



function handleError(err, targetServer, reqUrl, res, options, parameters){
  Log('Error in AsyncRender: ' + renderInfo(targetServer, reqUrl, res || null, options || null, parameters||null) + ':::'+ JSON.stringify(err), 'Err');
  if (res){
    res.send(500); 
  }
  return err;
}

function renderInfo(targetServer, reqUrl, res, options, parameters){
  var resIsSet = res?' res is set ':' no res ';
  var optionsDescription = ' options: ';
  if (options) {
    optionsDescription+= 'null';
  }
  else{
    optionsDescription += 'rendPage: ' + options.renderPage + ' parameters: ' + parameters + ' sender: ' + options.sender + ' callback is ';
    if (!options.callback) optionsDescription+= ' not ';
    optionsDescription+= ' set ';
  }
  return targetServer + ' Url: ' + reqUrl + resIsSet + optionsDescription ;
}

function siteProxy( res, FSUrl, data, renderPage, server, title){
  if (FSUrl && res){
    sender.expressSendRequest(FSUrl, data?data:{}, '127.0.0.1', 
      server, res, function (error, response, body, res){
        if (!error){
          res.render(renderPage?renderPage:FSUrl, { title: title?title:'Tournaments!!!', message: body});
        } else {
          sender.Answer(res, { result:error });
        }
          console.log('***SITE_ANSWER***');
      });
  }
  else {
    console.log('INVALID siteAnswer');
  }
}




function Log(data, topic){
  JSLog({msg:data}, topic);
}


function proxy(error, response, body, res){
  Answer(res, body);
}

var Fail = { result:'fail'};

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
  var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //


  var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;

var Answer = sender.Answer;



app.get('/CheckServer', function (req, res){
  var serv = req.query.serv;
  sender.expressSendRequest('Alive', {msg:'CheckServer'}, '127.0.0.1', serv, res, sender.printer);

});

app.get('/counter', function (req, res){
  res.json({requests:requestCounter});
})

app.get('/about', function (req, res){
  res.render('about');
})

app.post('/FinishGame', FinishGame);

app.get('/realmadrid', Landing('realmadrid'));

function Landing(name){
  return function(req, res){
    res.render('landing/'+name);
  }
}

app.post('/new_tournament', function (req, res){
  res.end();
  var tournament = req.body;
  Send("NewTournament", tournament);
})

function FinishGame(req, res){
  var data = req.body;
  sender.Answer(res, { result:'OK', message:'FinishGame' } );
  sender.sendRequest("FinishGame", data, '127.0.0.1', 'DBServer');
  Log(data, 'Tournaments');
  
  console.log('FinishGame', data);
  var winners = data.scores//sort.winners(data.scores);
  var winnerCount = data.places[1] || null;
  var prizes = data.prizes || null;

  Send('FinishTournament', { tournamentID : data.tournamentID, winners:winners, count:winnerCount, prizes:prizes });
}


app.all('/StartTournament', function (req, res){
  console.log('Site starts tournament');
  var data = req.body;

  sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer

  if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
  res.end();
});


function isAuthenticated(req){
  return (req.session && req.session.login);// || req.user;
}

function getLogin(req){
  if (isAuthenticated(req)){
    return req.session.login;
    /*if (req.session && req.session.login) return req.session.login;
    return req.user.login;*/
  } else {
    return 0;
  }
}

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



app.get('/SpecLogs/:topic', function (req, res){
  //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
  var topic = req.params.topic||'Forever';
  res.render('SpecLogs', {topic:topic});
});

function JSLog(msg, topic){
  if (socket_enabled) io.emit(topic?topic:'Logs', JSON.stringify(msg));
}

app.get('/Alive', function (req, res){ res.render('Alive'); })
app.get('/chat', function (req, res){ res.sendFile(__dirname + '/sock.html'); });

const GET_TOURNAMENTS_INFO = 4;
const GET_TOURNAMENTS_USER = 1;

app.get('/', function (req,res){
  if (isAuthenticated(req)){
    var data = req.body;
    data.queryFields = 'tournamentID buyIn goNext gameNameID players Prizes';
    data.purpose = GET_TOURNAMENTS_USER;
    //res.render()
    AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'Tournaments'}, data);
  } else {
    res.render('main');
  }
})

app.post('/', function (req, res){
  var data = req.body;
  console.log('social auth', data);

  data.queryFields = 'tournamentID buyIn goNext gameNameID players';
  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'GetTournaments'}, data);                
})

//Error: Failed to serialize user into session
/*app.get('/vk-auth', function (req, res){
  var uid = req.query.uid;
  var first_name = req.query.first_name;
  Log('uid: ' + uid + '. '+ first_name, 'Users');
  //var last_name = 
  res.end('uid ' + uid + ' OK!');
})*/

function saveSession(req, res, inviterUrl, login){
  if (!inviterUrl) inviterUrl = "Login"; 
  setTimeout(function(){
    req.session.save(function (err) {
      // session saved
      if (err) {
        console.error('SESSION SAVING ERROR', 'Err'); 
        res.render(inviterUrl,{msg:err});
      } else {
        req.session.inviter = null;
        req.session.login = login;
        res.redirect('Tournaments');
      }
    })
  }, 1000);
}

function vkAuthSuccess(){
  return function (req, res) {
    var login = req.user.login;
    var user = req.user;

    //var inviter = req.inviter;
    var inviter = req.session.inviter;
    //console.log("inviter", inviter);

    Log("SetInviter " + inviter + " for " + login, "Users");
    /*if (!inviter) {
      inviter = null;
      Log("no Inviter, no RM PAGE", "Users");
    }*/

    if (inviter) { 
      Users.setInviter(login, inviter);
      Actions.add(login, 'login', { auth:'vk', inviter:inviter });
    } else {
      Actions.add(login, 'login', { auth:'vk' });
    }
    saveSession(req, res, inviter, login);
  }
}

function setInviter(inviter){
  return function (req, res, next){
    req.session.save(function (err){
      if (err){
      } else {
        req.session.inviter = inviter;
      }
      console.log("setInviter middleware :", err, inviter);
      next();
    })
  }
}

var vkAuth = passport.authenticate('vkontakte', { failureRedirect: '/', display: 'mobile' })

function redirectToAuth(req, res){
  res.redirect('/vk-auth');
}

app.get('/vk-auth/realmadrid', setInviter("realmadrid"), redirectToAuth);//vkAuth

app.get('/vk-auth', vkAuth, vkAuthSuccess());

//app.get('/vk-auth', vkAuth, vkAuthSuccess());

app.post('/tellToFinishTournament', function (req, res){
 var data = req.body;
  sender.Answer(res, { result:'OK', message:'FinishGame' } );

  Send('FinishTournament', { tournamentID : data.tournamentID, data:data })
})

var middlewares = require('./middlewares');
var authenticated = middlewares.authenticated;
var isAdmin = middlewares.isAdmin;

app.get('/Tell', isAdmin, function (req, res){
  res.render('Tell');
  //res.sendFile(__dirname + '/sock1.html');
})

app.post('/Tell', isAdmin, function (req, res){
  var message = req.body.message;
  var action = req.body.action;

  console.log('Tell', message, req.body);
  Send('Tell', {message:message, action:action||null});

  res.render('Tell');
})

/*app.get('/vk-auth', function (req, res){
  var uid = req.params.uid;
  var first_name = req.params.first_name;
  //var last_name = 
  res.render('testVK');
})*/

/*app.get('/close', function (req, res){
  console.log('closing');
  res.render('Alive');
  
  io.close();
  server.close();
  console.log(process.pid);
  process.exit(0);
  process.kill(process.pid, 'SIGHUP');
  //app.close();
})*/



server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



var clients = [];
var io;
if (socket_enabled){
  io = require('socket.io')(server);
  /*io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);*/
  /*io.set('transports', [
      'websocket'
    , 'polling'
  ]);*/
  io.on('connection', function(socket){
    //console.log('IO connection');
    //socket.join('/111');
    socket.on('chat message', function(msg){
      console.log(msg);
      io.emit('chat message', msg);
      var message = {
        text : msg
        , sender:'common'
      }
      console.log(message, 'message');
      sender.sendRequest("AddMessage", message, '127.0.0.1', 'DBServer', null, sender.printer);//sender.printer
    });

    //socket.on('')

    socket.on('event1', function(data){
      SendToRoom('/111', 'azz', 'LALKI', socket);
      //io.of('/111').emit('azz','LALKI');
    });
  });
}
function Send(tag, message, force){
  if (socket_enabled || force){
    io.emit(tag, message);
  }
}

function SendToRoom( room, event, msg, socket){
  if (socket_enabled) io.of(room).emit(event, msg);
}

function compare(tournaments, previous){

}

app.post('/Winners', function (req, res){
  res.end('OK');
  var winners = req.body.winners;
  var tournamentID = req.body.tournamentID;

  Send('winners', {winners:winners, tournamentID:tournamentID});
})

var previousTournaments=[];

const GET_TOURNAMENTS_UPDATE = 6;
var frontendVersion;

RealtimeProvider(1000);
UpdateFrontendVersion(20000);
get_Leaderboard(8000);

function RealtimeProvider(period){
  sender.sendRequest("GetTournaments", { purpose:GET_TOURNAMENTS_UPDATE }, "127.0.0.1", "DBServer", null, function (error, response, body, res){
    if (!error){
      var tournaments = body;

      var message = {
        tournaments:tournaments
      }

      if (frontendVersion) message.frontendVersion= frontendVersion;
      io.emit('update', message);
      //compare(body, previousTournaments);
    }
  })
  setTimeout(function(){
    RealtimeProvider(period)
  }, period);
}

function UpdateFrontendVersion(period){
  sender.sendRequest("GetFrontendVersion", { }, "127.0.0.1", "DBServer", null, function (error, response, body, res){
    if (!error){
      frontendVersion = body? body.frontendVersion || null : null;
      //compare(body, previousTournaments);
    }
  })

  setTimeout(function(){
    UpdateFrontendVersion(period)
  }, period);
}

function getShortActivityBoard(leaderboard){
  var short_activity_board=[];
  for (var i=0; (i<leaderboard.length) && (i<10); i++ ){
    short_activity_board.push(leaderboard[i]);
  }
  return short_activity_board;
}

function get_Leaderboard(period){
  TournamentReg.leaderboard()
  .then(function (leaderboard){
    //res.json(leaderboard);
    activity_board = getShortActivityBoard(leaderboard);
    io.emit('leaderboard', activity_board);
  })
  .catch(function (err){
    //console.log('error', 'get_Leaderboard', err);
    //Errors.add('login', 'leaderboard', { code:err })
    //res.json({code:'err', message:'Ошибка'})
  })

  setTimeout(function(){
    get_Leaderboard(period)
  }, period);
}

var activity_board;



app.post('/Leaderboard', function (req, res){

  /*TournamentReg.leaderboard()
  .then(function (leaderboard){
    res.json(leaderboard);
  })
  .catch(function (err){
    Errors.add('login', 'leaderboard', { code:err })
    res.json({code:'err', message:'Ошибка'})
  })*/
})