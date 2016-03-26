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

var configs = require('./configs');

var mongoose = require('mongoose');
var sessionDBAddress = configs.session;
mongoose.connect('mongodb://'+sessionDBAddress+'/sessionDB');

var Users = require('./models/users');
var Actions = require('./models/actions');
var Errors = require('./models/errors');
var Tournaments = require('./models/tournaments');
var Message = require('./models/message');
var Gifts = require('./models/gifts');

var Packs = require('./models/packs')

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



passport.use(new VKontakteStrategy({
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

var SESSION_EXPIRATION_HOURS = 24*30;
var maxAge = SESSION_EXPIRATION_HOURS * 60 * 60 * 1000;

console.log('maxAge', maxAge);

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: '1234567890QWERTY',
    cookie: { maxAge: new Date(Date.now() + maxAge) },
    resave: true,
    saveUninitialized: true,
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

server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
// socket land

var io;
var SOCKET = require('./socket')(app, server)
if (socket_enabled){
  io = SOCKET.io;
}
var aux = require('./models/auxillary')
aux.io(SOCKET); // set socket in aux

var updatables = {};

var realtime = require('./helpers/realtime')(app, io)

var gifts = require('./Modules/site/gifts')(app, AsyncRender, Answer, sender, Log, proxy, aux);
var admin = require('./Modules/site/admin')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);
var money = require('./Modules/site/money')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy, aux);

var user = require('./Modules/site/user')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, aux);
var tournaments = require('./Modules/site/tournaments') (app, AsyncRender, Answer, sender, Log, proxy);
var clientStats = require('./Modules/site/clientStats')(app, AsyncRender, Answer, sender, Log, proxy, getLogin, aux);


var TournamentReg = require('./models/tregs');
var Marathon = require('./models/marathon');

var middlewares = require('./middlewares');
var isAdmin = middlewares.isAdmin;

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

// setInterval(function(){
//   console.log(realtime().counter);
// }, 3000)

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


function cancel(res, code, tag){ 
  return res.json({
    result:0, 
    code: code||CODE_INVALID_DATA, 
    tag:tag||null 
  }); 
}

function isNumeric(num) { return !isNaN(num); }

const CODE_INVALID_DATA='Неправильные данные';

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


app.get('/realmadrid', Landing('realmadrid', 'realmadrid.jpg'));
app.get('/b.gareth', Landing('bgareth', 'realmadrid.jpg'));

app.get('/Transfers', middlewares.isAdmin, function (req, res, next){
  
})

// app.get('/Gifts', function (req, res, next){
//   Gifts.all()
//   .then(
//   //   function (giftList){
//   //   req.data = giftList
//   // }
//   aux.setData(req, next)
//   )
//   .catch(next)
// }, aux.raw, aux.err)

// app.get('/updateLinks', middlewares.isAdmin, function (req, res, next){
//   Users.mailers()
//   .then(function(users){
//     req.data = 'found';
//     next();
//     Users.update_auth_links(users)
//   })
//   .catch(next)
// }, aux.raw, aux.err)

function Landing(name, picture){
  return function (req, res){
    var obj = { landing:name }
    if (picture) obj.picture = picture;

    res.render('landing/'+name, obj);
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

  var obj = { 
    tournamentID : data.tournamentID,
    winners:winners,
    count:winnerCount,
    prizes:prizes 
  }

  // Send('FinishTournament', obj);
  
  console.log('FinishTournament FinishGame', obj);

  var is_money_tournament = (prizes[0] >= 2);
  console.log('is_money_tournament', is_money_tournament);
  if (is_money_tournament){
    //show win or lose message
    for (var i = 0; i < winners.length; i++) {
      var winner = winners[i];
      var login = winner.login;

      if (i<winnerCount){
        //send winning message
        console.log(login, 'WINS TOURNAMENT')
        aux.alert(login, c.NOTIFICATION_WIN_MONEY, obj)
      } else {
        //send lose message
        console.log(login, 'LOSES TOURNAMENT')
        aux.alert(login, c.NOTIFICATION_LOSE_TOURNAMENT, obj)
      }

    }
  } else {
    //send custom messages
    Marathon.get_current_marathon()
    .then(function (marathon){
      var mainPrize = marathon.prizes[0];

      for (var i = 0; i < winners.length; i++) {
        var user = winners[i];
        var login = user.login
        
        sendAfterGameNotification(login, mainPrize);
      }
    })
  }
}

function getMarathonUser(login){
  return MarathonPlaces[login];
  // return {
  //   points: 3,
  //   place: 10,
  //   accelerator: 7,
  //   pretends: 34
  // }
}


// Users.update_user_status('Raja', c.USER_STATUS_READ_FIRST_MESSAGE)
// .catch(function (err){
//   console.error('update_user_status failed', err);
// })

function sendAfterGameNotification(login, mainPrize){
  Users.profile(login)
  .then(function (profile){
    if (!profile) return null;
    var profileInfo = profile.info;
    
    var notificationCode='';

    // if (!profileInfo) {
    //   // notificationCode 
    // } else {
      // what we can send?
      // win
      // lose

      // advise (if newbie)
      // rating +

      // check
      // was it money tournament?
      // did he win money?
      // is
      var is_newbie = (!profileInfo || !profileInfo.status || profileInfo.status==c.USER_STATUS_NEWBIE) ;
      if (is_newbie){
        // //show newbie messages
        // //analyze, what he knows about us

        // show hello message
        aux.alert(login, c.NOTIFICATION_FIRST_MESSAGE, {mainPrize: mainPrize})

        console.log('mark, that user received first message','USER_STATUS_READ_FIRST_MESSAGE')

        Users.update_user_status(login, c.USER_STATUS_READ_FIRST_MESSAGE)
        .catch(function (err){
          console.error('update_user_status failed', err);
        })

      } else {
        // send rating
        // console.log('send NOTIFICATION_MARATHON_CURRENT. must be function of getMarathonUser');

        var marathonUser = getMarathonUser(login);
        marathonUser.mainPrize = mainPrize;

        aux.alert(login, c.NOTIFICATION_MARATHON_CURRENT, marathonUser)


        // send advices
        // send bonuses
      }
  })
  .catch(function (err){
    console.error('sendAfterGameNotification', err);
  })
}

app.all('/StartTournament', function (req, res){
  console.log('Site starts tournament');
  var data = req.body;

  sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer

  if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
  res.end();
});




function isAuthenticated(req){ return (req.session && req.session.login); } // || req.user; 

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

app.get('/main', function (req, res){
  res.render('main2');
})

app.get('/Packs', aux.authenticated, function (req, res, next){

  var login = aux.getLogin(req);
  Gifts.user.cardsGroup(login)
  .then(function (cards){
    // console.log(cards);
    req.data = {
      cards: realtime().cards,
      usercards: cards||[]
    }
    next();
  })
  .catch(next)
  
  // res.render('Packs', { 
  //   msg:{
  //     cards: realtime().cards
  //   }
  // });
// })
}, aux.render('Packs'), aux.err)

// app.get('/api/usergifts/cards/', middlewares.authenticated, function (req, res, next){
//   var login = getLogin(req);
//   Gifts.user.cards(login)
//   .then(aux.setData(req, next))
//   .catch(next)
// }, aux.json, aux.error);

// app.get('/api/usergifts/removeAll/', middlewares.authenticated, function (req, res, next){
//   var login = getLogin(req);
//   Gifts.user.removeAll(login)
//   .then(aux.setData(req, next))
//   .catch(next)
// }, aux.json, aux.error);

// app.get('/api/collections/rewardme/:collectionID', aux.authenticated, function (req, res, next){
//   var login = getLogin(req);
//   var collectionID = req.params.collectionID;
//   Collection.getByID(collectionID)
//   .then(function (collection){
//     if (collection.reward){
//       switch (collection.reward){

//       }
//     }
//   })
// })


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
  res.render('main2');//{ msg:specials }
  /*if (isAuthenticated(req)){
    var data = req.body;
    data.queryFields = 'tournamentID buyIn goNext gameNameID players Prizes';
    data.purpose = GET_TOURNAMENTS_USER;
    //res.render()
    AsyncRender('DBServer', 'GetTournaments', res, { renderPage:'main2' }, data);
  } else {
    res.render('main');
  }*/
})

app.get('/addQuestion', middlewares.authenticated, function (req, res){
  res.render('AddQuestion');  
})

app.post('/addQuestion', middlewares.authenticated, function (req, res){
  var login = getLogin(req);
  var question = req.body.question;

  //
  var answer1 = req.body.answer1;
  var answer2 = req.body.answer2;
  var answer3 = req.body.answer3;
  var answer4 = req.body.answer4;

  var answers = [];
  answers.push(answer1);
  answers.push(answer2);
  answers.push(answer3);
  answers.push(answer4);

  var correct = req.body.correct;
  var obj = {
    createdBy: login,
    question: question,
    answers: answers,
    correct:correct
  }
  console.log(obj);
  if (login && question && answer1 && answer2 && answer3 && answer4 && correct && !isNaN(correct)){
    sender.customSend("offerQuestion", obj, '127.0.0.1', 5010, res, function (error, response, body, res){
      if (error) return res.render('AddQuestion', { code:0, msg: 'Ошибка сервера. Повторите вашу попытку чуть позже' })
      if (body){
        var code=0;
        var message = 'Ошибка';
        if (body.result=='ok') {
          code = 1;
          message = 'Добавление произошло успешно, вопрос отправлен на модерацию!'
        }
        res.render('AddQuestion', { code:code , msg:message });
      }
    });
  } else {
    res.render('AddQuestion', { code:0, msg: 'Произошла ошибка' });
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

/*
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

  function redirectToAuth(req, res){ res.redirect('/vk-auth'); }


  app.get('/vk-auth/realmadrid', setInviter("realmadrid"), redirectToAuth);//vkAuth

  app.get('/vk-auth', vkAuth, vkAuthSuccess());
*/

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



var vkAuth = passport.authenticate('vkontakte', { failureRedirect: '/', display: 'mobile' })

app.get('/vk-auth', vkAuth, vkAuthSuccess, session_save);

app.get('/setInviter/:inviter_type/:inviter', middlewares.authenticated, function (req, res){
  // when new user is redirected to main page I need to know, where he came from.
  // user sends ajax request and i understand, who invited him/her
  // even if this request fails, nothing breaks!

  var login = getLogin(req);
  var inviter = req.params.inviter;
  var inviter_type = req.params.inviter_type;

  Log("SetInviter " + inviter + " for " + login, "Users");

  if (inviter && inviter_type) { 
    Users.setInviter(login, inviter, inviter_type);
    Actions.add(login, 'setInviter', { inviter:inviter, inviter_type:inviter_type });
  }

  res.end('');
  // saveSession(req, res, inviter, login);
})

var fs = require('fs');

//app.get('/invite', )

app.get('/getLogs', isAdmin, sender.getLogs, function (req, res){
  // res.json({msg:'OK'})
  res.render('Logs', { time:req.time, msg:req.files })
}, function (err, req, res, next){
  res.json({err:err});
})

app.get('/getLogFile', isAdmin, sender.getLogFile, function (req, res){
  // res.json({msg:'OK'})
  res.render('logViewer', { time:req.time, msg:req.file })
}, function (err, req, res, next){
  res.json({err:err});
})

app.post('/tellToFinishTournament', function (req, res){
 var data = req.body;
  sender.Answer(res, { result:'OK', message:'FinishGame' } );

  Actions.add('stopTournament', {tournamentID:tournamentID});

  Send('FinishTournament', { tournamentID : data.tournamentID, data:data })
})

app.get('/Tell', isAdmin, function (req, res){
  res.render('Tell');
  //res.sendFile(__dirname + '/sock1.html');
})

app.post('/Tell', isAdmin, function (req, res){
  var message = req.body.message;
  var action = req.body.action;

  console.log('Tell', message, req.body);
  Send('Tell', { message:message, action:action || null });

  res.render('Tell');
})

app.get('/Marathon', function (req, res){ res.render('Marathon'); })

app.get('/MarathonInfo', isAdmin, function (req, res){
  Marathon.get_current_marathon()
  .then(function (marathon){
    if (marathon){
      res.render('admin/MarathonInfo', {msg: marathon});
    } else {
      res.render('admin/MarathonInfo', {msg: null});
    }
  })
})

app.get('/Leaderboard', function (req, res){
/*
  Marathon.leaderboard()
  .then(function (leaderboard){
    var ldbd = {
      leaderboard:leaderboard,
      counts: leaderboard.counts,
      prizes: leaderboard.prizes
    }
    res.render('Leaderboard', { msg: ldbd });
  })
  .catch(function (err){
    Errors.add('Leaderboard', {err:err})
    
    res.render('Leaderboard', { msg: Leaderboard });
  })
*/
  res.render('Leaderboard', { msg: Leaderboard });

});


app.post('/Marathon/edit/:MarathonID', isAdmin, function (req, res){
  var MarathonID = req.params.MarathonID;
  var data = req.body||null;
  if (MarathonID && !isNaN(MarathonID)){
    if (data){
      if (data.accelerators) { data.accelerators = JSON.parse(data.accelerators); }
      if (data.prizes) { data.prizes = JSON.parse(data.prizes); }
      if (data.counts) { data.counts = JSON.parse(data.counts); }

    } else {
      return res.json({result: 'no changes'});
    }
    Marathon.edit(data, MarathonID)
    .then(function (result){
      if (result){
        res.redirect('/MarathonInfo');
      } else {
        res.json({result:result});
        //res.end('fail. <a href="MarathonInfo"> go back');
      }
    })
    .catch(function (err){
      res.json({result:'fail', error: err });
    })
  } else {
    res.json({result:'INVALID MarathonID' });
  }

})

app.get('/ModalTest', aux.answer('ModalTest'))

app.post('/Marathon/new', isAdmin, function (req, res){
  var data = req.body;

  Marathon.add()
  .then(function(marathon){
    // console.log('added', marathon);
    return Marathon.edit(data||null, marathon.MarathonID);
  })
  .then(function (result){
    // console.log('edit done');
    res.json({result:result});
  })
  .catch(function (error){
    res.json({error:error});
  })
})

// Middleware
function getAcceleratorsAndMarathon(req, res, next){
  var accelerator = req.params.accelerator||null;
  if (accelerator && !isNaN(accelerator)){
    req.accelerator = accelerator;
    Marathon.get_or_reject()
    .then(function (marathon){
      req.marathon = marathon;
      next()
    })
    .catch(function (err){
      next(err);
    })
  } else {
    // next(null);
    // res.json({result:0, code:CODE_INVALID_DATA});
    req.accelerator=null;
    req.marathon=null;
    next()
  }
}

app.get('/buyAccelerator/:accelerator', middlewares.authenticated, getAcceleratorsAndMarathon, function (req, res){
  var login = getLogin(req);
  var index = req.accelerator;
  var marathon = req.marathon;
  var price;
  // console.log(index, marathon);
  if (index && marathon && marathon.accelerators[index]){
    price = marathon.accelerators[index].price;
    // need price of accelerator
    return Money.pay(login, price, c.SOURCE_TYPE_ACCELERATOR_BUY)
    .then(function (result){
      // if (!result) return null;
      console.error('Money.pay', result, login, index);
      return Marathon.sell_accelerator(login, index);
    })
    .then(function (result){
      // if (result){
      // }
        console.log('marathon.sell_accelerator', result);
        Actions.add(login, 'buyAccelerator', {accelerator:index})

      res.json({ result:result });
    })
    .catch(function (err){
      Errors.add(login, 'buyAccelerator', { err:err, accelerator:index })
      res.json({ err:err, pay:price||0 })
    })
  } else {
    Errors.add(login, 'buyAccelerator', { err:'invalid data', accelerator:index })
    res.json({ err:null })
    // cancel(res);
    // res.json({result:0, code:CODE_INVALID_DATA});
  }
})

app.get('/notifications/send', middlewares.isAdmin, aux.answer('admin/SendMessage'))

app.post('/notifications/send', middlewares.isAdmin, function (req, res, next){
  var data = req.body;
  var target = data.target;
  var notificationType = data.type;

  var header = data.header;
  var imageUrl = data.imageUrl;
  var text = data.text;

  //var targetType = typeof(target);

  if (!target){
    return next(null);
  }

  var obj = {
    imageUrl: imageUrl,
    text: text,
    header : header
  };
  // console.log(obj, target);

  aux.alert(target, notificationType||6, obj)
  .then(function (result){
    req.data = result;
    next();
  })
  .catch(next)

}, aux.json, aux.err)

app.get('/requestPlaying/:login', middlewares.isAdmin, function (req, res, next){
  var login = req.params.login;
  console.log('requestPlaying', login);
  aux.alert(login, c.NOTIFICATION_FORCE_PLAYING, {

  })
  .then(function (result){
    req.data = result;
    next();
  })
  .catch(next)

}, aux.json, aux.err)

app.get('/giveAcceleratorTo/:login/:accelerator', isAdmin, function (req, res){
  var login = req.params.login;
  var accelerator = req.params.accelerator;

  if (login && accelerator && isNumeric(accelerator) ){
    // console.log('constants', c);

    Marathon.grant_accelerator(login, accelerator)
    .then(function (result){
      res.json({msg: 'grant', result:result})

      aux.alert(login, c.NOTIFICATION_GIVE_ACCELERATOR, { index:accelerator })
      .catch(aux.catcher)

      // Message.notifications.personal(login, 'Лови бонус!', {
      //   type: c.NOTIFICATION_GIVE_ACCELERATOR,
      //   body:'Набирайте очки быстрее с помощью ускорителя',
      //   index:accelerator
      // })
      // .then(function(){
      //   forceTakingNews(login)
      // })
      // .catch(console.error)

    })
    .catch(function (err) { 
      cancel(res, err, 'grant fail');
    })

  } else {
    cancel(res);
  }
})

app.get('/setMoneyTo/:login/:ammount', isAdmin, function (req, res){
  var login = req.params.login;
  var ammount = req.params.ammount;

  if (login && ammount && isNumeric(ammount) ){
    // console.log('constants', c);

    Money.set(login, ammount, c.SOURCE_TYPE_SET)
    .then(function (result){
      res.json({msg: 'grant', result:result})
    })
    .catch(function (err) { 
      cancel(res, err, 'grant fail');
    })

  } else {
    cancel(res);
  }
})

function forceTakingNews(login, delay){
  setTimeout(function() {
    io.emit('newsUpdate', {msg:login})
  }, delay||0);
}

app.post('/autoreg', function (req, res){
  Tournaments.getStreamID()
  .then(function (streamID){
    if (isAuthenticated(req) && streamID){
      var login = getLogin(req);
      
      var data = {
        login: login,
        tournamentID:streamID
      }
      // console.log('autoreg', data);
      // AsyncRender('DBServer', 'autoreg', res, null,  data);
      sender.sendRequest('autoreg', data, '127.0.0.1', 'DBServer', res, function (err, response, body, res){
        if (err){
          aux.fail(login, 'autoreg', data)
          sender.Answer(res, Fail);
        } else {
          if (body){
            sender.Answer(res, body);
            forceTakingNews(login, 500);
          } else {
            sender.Answer(res, Fail);
          }
        }
      })
      // 
    } else {
      sender.Answer(res, Fail);
      //res.redirect('Login');
    }
  })
})

// app.get('/linker/:login/:link', function (req, res){
//   var login = req.params.login;
//   var link = req.params.link;


//   Actions.add(login, 'linker');
//   // Users.auth(login, password)//, req.user.email, req.user.inviter
//   Users.auth_by_link(login, link)
//   .then(function (user){
//     // console.log('logged In', user);
//     req.user= user;


//     saveSession(req, res, 'Login');


//     // Actions.add(login, 'login');
//   })
//   .catch(function (err){
//     res.redirect('/Login');//, {msg : err});
//     Errors.add(login, 'linker', { code:err })
//   })

// })

app.get('/giveMoneyTo/:login/:ammount', isAdmin, function (req, res){
  var login = req.params.login;
  var ammount = req.params.ammount;

  if (login && ammount && isNumeric(ammount) ){
    // console.log('constants', c);

    Money.increase(login, ammount, c.SOURCE_TYPE_GRANT)
    .then(function (result){
      res.json({msg: 'grant', result:result})

      if (ammount>0){
        aux.alert(login, c.NOTIFICATION_GIVE_MONEY, {
          ammount:ammount
        })
        .catch(aux.catcher)

        // Message.notifications.personal(login, 'Деньги, деньги, деньги!', {
        //   type: c.NOTIFICATION_GIVE_MONEY,
        //   body:'Вы получаете ' + ammount + ' руб на счёт!!!',
        //   ammount:ammount
        // })
        // .then(function(){
        //   forceTakingNews(login)
        // })
        // .catch(console.error)
      }

    })
    .catch(function (err) { 
      cancel(res, err, 'grant fail');
    })

  } else {
    cancel(res);
  }
})

app.get('/api/mini-rating', function (req, res){
  res.json({
    leaderboard: activity_board, 
    counts: leaderboard_min.counts, 
    prizes: leaderboard_min.prizes 
  })
})

//app.post('/')

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


var clients = [];

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

app.get('/Payment', middlewares.authenticated, function (req, res){
  var ammount = req.query.ammount || null;
  var type = req.query.buyType || null;

  var login = getLogin(req);
  Actions.add(login, 'Payment-page-opened', { ammount:ammount, type:type })

  res.render('Payment', { ammount:ammount, type:type });
})

app.get('/Tournaments', function (req, res){
  res.render('Tournaments');//, {msg: updater.tournaments||[] }
})

app.post('/Tournaments', function (req, res){
  res.json({msg: updater.tournaments || [] });
})

var json2csv = require('json2csv');

//app.get('/getCSV', middlewares.isAdmin, function())
app.get('/updateLinks', middlewares.isAdmin, function (req, res, next){
  Users.mailers()
  .then(function(users){
    req.data = 'found';
    next();
    Users.update_auth_links(users)
  })
  .catch(next)
}, aux.raw, aux.err)

var domainName = configs.gameHost || 'localhost';

app.get('/getCSV', middlewares.isAdmin, function (req, res, next){
  var fields = ['email', 'money', 'authlink'];
  Users.mailers()
  .then(function (users){
    // console.log(users);
    for (var i = users.length - 1; i >= 0; i--) {
      users[i].authlink = 'http://' + domainName+'/linker/'+users[i].login+'/'+ users[i].link;
    };
    json2csv({ data: users, fields: fields }, function (err, csv) {
      if (err) {
        next(err);
      } else {
        console.log(csv);
        req.data = csv;
        next();
      }
    });
  })
  .catch(next)

}, aux.raw, aux.err)
// app.get('/fillList', middlewares.isAdmin, function (req, res, ))

app.get('/mailLists', middlewares.isAdmin, function (req, res, next){
  aux.mailLists()
  .then(function (lists){
    req.data = lists.data[0];
    next();
  })
  .catch(next);

}, aux.json, aux.err)

app.get('/mailUsers1', middlewares.isAdmin, function (req, res, next){
  aux.mailUsers()
  .then(function (lists){
    req.data = lists;
    next();
  })
  .catch(next);

}, aux.json, aux.err)

app.get('/get_message', middlewares.isAdmin, function (req, res, next){
  var id = req.query.id;
  Message.notifications.getByID(id)
  .then(function (notification){
    req.data = notification;
    next();
  })
  .catch(next)
}, aux.json, aux.err)

app.get('/messages', middlewares.isAdmin, function (req, res, next){
  var login = req.query.login;
  Message.notifications.all(login)
  .then(function (news){
    req.data = news;
    next()
  })
  .catch(next)
}, aux.answer('Notifications'), aux.err)



app.get('/notifications/news', middlewares.authenticated, function (req, res, next){
  // var login = req.params.login;
  // console.log('news');
  var login = getLogin(req);

  Message.notifications.news(login)
  .then(function (news){
    req.data = news;

    // Message.notifications.markAll(login)
    // // .then(console.log)
    // .catch(function(){})

    next()
  })
  .catch(next)
}, aux.json, aux.err)

app.get('/notifications/all', middlewares.authenticated, function (req, res, next){
  // var login = req.params.login;
  var login = getLogin(req);

  Message.notifications.all(login)
  .then(function (news){
    req.data = news;

    Message.notifications.markAll(login)
    .catch(function(){})

    next()
  })
  .catch(next)
}, aux.json, aux.err)

// app.post('/message/read/:id', middlewares.authenticated, function (req, res, next){
//   var id = req.params.id;
//   var login 
// })

// Message.notifications

var players = [];
setInterval(function (){
  // Send('players', {msg: players});
  Log('Online: ' + JSON.stringify(players), 'Users');
  // players=[];
}, 20000)

setInterval(function (){
  players=[];
}, 60000)

app.post('/mark/Here/:login', function (req, res){
  var login = req.params.login;//getLogin(req);
  // console.log('mark/Here');
  // strLog('Online: ' + login, 'Users');
  players.push(login);

  res.end('');
})

// app.all('/Tournaments', function (req, res){
//   var data = req.body;
//   data.queryFields = 'tournamentID buyIn goNext gameNameID players Prizes';
//   data.purpose = GET_TOURNAMENTS_USER;

//   AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'Tournaments'}, data);
// });

var previousTournaments=[];

const GET_TOURNAMENTS_UPDATE = 6;
var frontendVersion;

var Leaderboard=null;
updateLeaderboard();

var MarathonPlaces = {
  // 'Raja': {
  //   points: 3,
  //   place: 10,
  //   accelerator: 7,
  //   pretends: 34
  // }
  // places : {},
  // prizes : {}
};

// setTimeout(function (){
//   var marathonUser = getMarathonUser('Raja');
//   // marathonUser.mainPrize = 100500;

//   aux.alert('Raja', c.NOTIFICATION_MARATHON_CURRENT, marathonUser)
  
// }, 4000);


// login => marathonUser

// login => place
// login => prize

function prizeByPlace(place, prizeList){
  if (place>=prizeList.length) return 0;

  return prizeList[place];
}
function updatePlaces(){

  var leaders = Leaderboard.leaderboard;
  // console.log('updatePlaces', leaders.length);
  var prizes = Leaderboard.prizes|| [];
  var counts = Leaderboard.counts|| [];

  var prizeList = getPrizeList(prizes, counts);

  var obj = {}

  for (var i=0; i<leaders.length; i++){
  try{
    var login = leaders[i].login;
    // console.log(login);
    var count = leaders[i].played;
    var points = leaders[i].points;
    var prize = prizeByPlace(i, prizeList);
    var number = i+1; //place

    // console.log(login, count, points, prize, number);

    var acceleratorValue = 1;
    if (leaders[i].accelerator && leaders[i].accelerator.value){
      acceleratorValue = leaders[i].accelerator.value;
    }

    obj[login] = {
      points: points,
      place: number,
      accelerator: acceleratorValue,
      mainPrize:prizes[0]
    }
    if (prize) obj.pretends = prize;
      // pretends: 34
    // if (prizes.length && counts.length && )
    } catch(error){
      console.error(error);
    }
  }
  // console.log(obj);
  // return MarathonPlaces;
  return obj;
}

const DEFAULT_MARATHON_PRIZE = 100;

function getPrizeList(prizes, counts){
  if (prizes.length==0 || counts.length==0){
    return [DEFAULT_MARATHON_PRIZE];
  }

  var prizeList = [];
  for (var i = 0; i < prizes.length; i++) {
    var prize = prizes[i];

    for (var j = 0; j < counts[i]; j++) {
      prizeList.push(prize);
    };
  };
  // console.log('prizeList', prizeList);
  return prizeList;
}

function updateLeaderboard(){

  setInterval(function(){
    Marathon.leaderboard()
    .then(function (leaderboard){
        Leaderboard = {
          leaderboard:leaderboard,
          counts: leaderboard.counts,
          prizes: leaderboard.prizes
        }

        MarathonPlaces = updatePlaces();
    })
    .catch(function (err){
      Errors.add('', 'updateLeaderboard', { err:err });
    })

  }, 3000)

}

// RealtimeProvider(1000);

// RealtimeProvider2(1000);

UpdateFrontendVersion(20000);
get_Leaderboard(4000);

function RealtimeProvider(period){
  sender.sendRequest("GetTournaments", { purpose:GET_TOURNAMENTS_UPDATE }, "127.0.0.1", "DBServer", null, function (error, response, body, res){
    if (!error){
      var tournaments = body;

      var message = { tournaments:tournaments }
      if (frontendVersion) message.frontendVersion = frontendVersion;

      io.emit('update', message);
      //compare(body, previousTournaments);
    }
  })
  setTimeout(function(){
    RealtimeProvider(period)
  }, period);
}

var updater = {
  tournaments: []
};

function RealtimeProvider2(period){
  Tournaments.get()
  .then(function (tournaments){
    if (tournaments) updater.tournaments = tournaments;
    if (frontendVersion) updater.frontendVersion = frontendVersion;

    io.emit('update', updater);
  })
  .catch(function (err){
    Errors.add('CANNOT GET Tournaments', {err:err});
  })

  setTimeout(function(){
    RealtimeProvider2(period)
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

var leaderboard_min={};

function get_Leaderboard(period){
  // console.log('get_Leaderboard');
  Marathon.leaderboard()
  .then(function (leaderboard){
    activity_board = getShortActivityBoard(leaderboard);
    leaderboard_min = leaderboard;

    io.emit('leaderboard', {
      leaderboard: activity_board, 
      counts: leaderboard.counts, 
      prizes: leaderboard.prizes 
    });

    // { leaderboard: activity_board } , counts: [1, 3], prizes:[150, 50]
  })
  .catch(function (err){
    //console.log('error', 'get_Leaderboard', err);
    Errors.add('', 'leaderboard', { code:err })
    //res.json({code:'err', message:'Ошибка'})
  })

  setTimeout(function(){
    get_Leaderboard(period)
  }, period);
}

var activity_board;