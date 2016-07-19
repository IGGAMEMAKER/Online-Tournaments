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

var Packs = require('./models/packs');

var Money = require('./models/money');
var Teams = require('./models/teams');

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

// app.use('/leagues', require('./routes/leagues'));

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
  './frontend/games/Football',
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
var SOCKET = require('./socket')(app, server)
if (socket_enabled){
  io = SOCKET.io;
}
var aux = require('./models/auxillary');
aux.io(SOCKET); // set socket in aux

var realtime = require('./helpers/realtime')(app, io);

var gifts = require('./Modules/site/gifts')(app, Answer, sender, Log, aux);
var collections = require('./Modules/site/collections')(app, Answer, sender, Log, aux);
var admin = require('./Modules/site/admin')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);
var money = require('./Modules/site/money')(app, Answer, sender, Log, isAuthenticated, getLogin, siteProxy, aux);

var user = require('./Modules/site/user')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, aux);
var tournaments = require('./Modules/site/tournaments') (app, AsyncRender, Answer, sender, Log, proxy, aux);
var clientStats = require('./Modules/site/clientStats')(app, AsyncRender, Answer, sender, Log, getLogin, aux);

var category = require('./routes/category')(app, aux, realtime, SOCKET, io);
var teamz = require('./routes/teams')(app, aux, realtime, SOCKET, io);

var TournamentReg = require('./models/tregs');

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

// var CRON_TASK = schedule.scheduleJob('33 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });


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

// app.get('/Transfers', middlewares.isAdmin, function (req, res, next){
  
// })

app.get('/realtime/update', aux.isAdmin, function(req, res){
  realtime().UPDATE_ALL();
  res.end('OK');
});

// app.get('/updateLinks', middlewares.isAdmin, function (req, res, next){
//   Users.mailers()
//   .then(function(users){
//     req.data = 'found';
//     next();
//     Users.update_auth_links(users)
//   })
//   .catch(next)
// }, aux.raw, aux.err)

var tournament_finisher = require('./chains/finishTournament')(aux);

function FinishGame(req, res){
  var data = req.body;
  sender.Answer(res, { result:'OK', message:'FinishGame' } );

  // sender.sendRequest("FinishGame", data, '127.0.0.1', 'DBServer');
  Log(data, 'Tournaments');
  
  console.log('FinishGame', data);

  tournament_finisher.finish(data);
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

var markPaymentPageOpening = (req, res, next) => {
  var ammount = req.query.ammount || null;
  var type = req.query.buyType || null;

  var login = getLogin(req);
  Actions.add(login, 'Payment-page-opened', { ammount, type });

  next();
};

var application_page = (req, res) => {
  res.render('index', { msg: templateData() })
};

app.get('/', application_page);
app.get('/about', application_page);
app.get('/Tournaments', application_page);
app.get('/Packs', aux.authenticated, application_page);
app.get('/MyCollections', aux.authenticated, application_page);
app.get('/Cards', aux.authenticated, application_page);
app.get('/Payment', middlewares.authenticated, markPaymentPageOpening, application_page);

// app.get('/Payment', aux.authenticated, application_page);
/*
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/Tournaments', function (req, res){
  // res.render('Tournaments');//, {msg: updater.tournaments||[] }
  res.render('Tournaments', { msg: realtime().tournaments });//, {msg: updater.tournaments||[] }
});

app.get('/Packs', aux.authenticated, function (req, res, next){
  req.data = {
    collections: realtime().collections,
    cards: realtime().cards,
    packs: realtime().userpacks()
  };
  next();
}, aux.render('Packs'), aux.err);


app.get('/MyCollections', aux.authenticated, function (req, res, next) {
  // var login = aux.getLogin(req);
  var login = req.login;
  Gifts.user.cardsGroup(login)
    .then(function (cards){
      req.data = {
        collections: realtime().collections,
        cards: realtime().cards,
        packs: realtime().userpacks(),
        usercards: cards||[]
      };
      next();
    })
    .catch(next)
}, aux.render('MyCollections'), aux.err)

app.get('/Cards', aux.authenticated, function (req, res, next){
  // var login = aux.getLogin(req);
  var login = req.login;
  Gifts.user.cardsGroup(login)
    .then(function (cards){
      // console.log(cards);
      req.data = {
        collections: realtime().collections,
        cards: realtime().cards,
        usercards: cards||[]
      }
      next();
    })
    .catch(next);
}, aux.render('Cards'), aux.err);

app.get('/Payment', middlewares.authenticated, function (req, res) {
  var ammount = req.query.ammount || null;
  var type = req.query.buyType || null;

  var login = getLogin(req);
  Actions.add(login, 'Payment-page-opened', { ammount:ammount, type:type });

  res.render('Payment', { ammount:ammount, type:type });
});
*/
// packs + cards + realtime

app.post('/openPack/:value/:paid', middlewares.authenticated, function (req, res){
  var value = parseInt(req.params.value) || aux.c.CARD_COLOUR_GRAY;
  var paid = parseInt(req.params.paid) || 0;


  // var login = aux.getLogin(req);
  var login = req.login;
  // var price = (10 + (4 - value)* 20);
  var price = realtime().packs[value].price || 1;

  var obj = {value:value, paid:paid};
  if (paid) obj.price = price;

  aux.done(login, 'openPack', obj)

  var paymentFunction = function(){
    if (paid) {
      return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
    } else {
      return Users.pack.decrease(login, value, 1)
    }
  };

  // return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
  var info = {};

  paymentFunction()
  .then(function (result){
    info['paid'] = true;
    // console.log(login, price, result);
    var card = Packs.get(value);//_standard_pack_card
    // console.log(card);
    return card;
  })
  .then(function (card){
    var giftID = card.giftID;
    card.value = value;
    card.isFree = !paid;

    Gifts.user.saveGift(login, giftID, true, card.colour);
    aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card);
    res.json({});
  })
  .catch(function (err){
    if (!info.paid) {
      res.json({
        result: 'pay',
        ammount: price
      })
    } else {
      res.json({ err });
    }

    aux.fail(login, 'openPack', { err: err , info: info })
  })
});

app.get('/givePackTo/:login/:colour/:count', aux.isAdmin, function (req ,res, next){
  var login = req.params.login;
  var count = parseInt(req.params.count);
  var colour = parseInt(req.params.colour);
  if (!isNumeric(count) || !isNumeric(colour) ) {
    return next('notnum')
  }
  grantPacksTo(login, colour, count)
    .then(aux.setData(req, next))
    .catch(next)
}, aux.std);

app.get('/api/packs/setdefault/:login', aux.isAdmin, function (req ,res, next){
  var login = req.params.login;
  // console.log('login', login);

  Users.pack.setDefault(login)
    // .then(console.log)
    .then(aux.setData(req, next))
    .catch(next)
}, aux.std);

function grantPacksTo(login, colour, count){
  return Users.pack.add(login, colour, count)
    .then(function (result){
      aux.alert(login, aux.c.NOTIFICATION_GIVE_PACK, { count:count, colour: colour })
      return result
    })
    .catch(aux.drop)
}

// --- end packs

app.get('/Total', (req, res) => { res.render('Total')});

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

app.post('/addQuestion', middlewares.authenticated, function (req, res){
  var login = getLogin(req);
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
    correct:correct
  }
  if (topic) obj.topic = topic;
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
        message = 'Добавление произошло успешно, вопрос отправлен на модерацию!'

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

var fs = require('fs');

app.get('/getLogs', isAdmin, sender.getLogs, function (req, res){
  // res.json({msg:'OK'})
  res.render('Logs', { time:req.time, msg:req.files })
}, function (err, req, res, next){
  res.json({err:err});
});

app.get('/getLogFile', isAdmin, sender.getLogFile, function (req, res){
  // res.json({msg:'OK'})
  res.render('logViewer', { time:req.time, msg:req.file })
}, function (err, req, res, next){
  res.json({err:err});
});

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
});

function forceTakingNews(login, delay){
  setTimeout(function() {
    io.emit('newsUpdate', {msg:login})
  }, delay||0);
}

app.post('/autoreg', function (req, res) {
  Tournaments.getStreamID()
  .then(function (streamID){
    if (isAuthenticated(req) && streamID) {
      var login = getLogin(req);
      
      var data = {
        login,
        tournamentID:streamID
      };
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
      });
      // 
    } else {
      sender.Answer(res, Fail);
      //res.redirect('Login');
    }
  })
});

/*
app.get('/linker/:login/:link', function (req, res){
  var login = req.params.login;
  var link = req.params.link;


  Actions.add(login, 'linker');
  // Users.auth(login, password)//, req.user.email, req.user.inviter
  Users.auth_by_link(login, link)
  .then(function (user){
    // console.log('logged In', user);
    req.user= user;


    saveSession(req, res, 'Login');


    // Actions.add(login, 'login');
  })
  .catch(function (err){
    res.redirect('/Login');//, {msg : err});
    Errors.add(login, 'linker', { code:err })
  })

})
*/

function increase_money_and_notify(login, ammount){
  if (login && ammount && isNumeric(ammount) ) {
    Money.increase(login, ammount, c.SOURCE_TYPE_GRANT)
    .then(function (result){
      if (ammount>0){
        aux.alert(login, c.NOTIFICATION_GIVE_MONEY, { ammount:ammount })
        .catch(aux.catcher)
      }

    })
    .catch(aux.report('increase_money_and_notify', {login: login, ammount:ammount }))
  }
}

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

app.post('/Winners', function (req, res){
  res.end('OK');
  var winners = req.body.winners;
  var tournamentID = req.body.tournamentID;

  Send('winners', {winners:winners, tournamentID:tournamentID});
});

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
}, aux.raw, aux.err);

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

}, aux.raw, aux.err);

app.get('/mailLists', middlewares.isAdmin, function (req, res, next){
  aux.mailLists()
  .then(function (lists){
    req.data = lists.data[0];
    next();
  })
  .catch(next);

}, aux.json, aux.err);

app.get('/mailUsers1', middlewares.isAdmin, function (req, res, next){
  aux.mailUsers()
  .then(function (lists){
    req.data = lists;
    next();
  })
  .catch(next);

}, aux.json, aux.err);





app.get('/api/news/get', function (req, res) {
  res.json({ news: realtime().news || null })
});

app.get('/api/news/all', aux.isAdmin, function (req, res, next){
  Message.news.all()
  .then(aux.setData(req, next))
  .catch(next)
}, aux.render('News'), aux.error);

app.post('/api/news/add', aux.isAdmin, function (req, res, next){
  var data = req.body;

  var text = data.text || "";
  var image = data.image || "";
  var url = data.url || "";
  var title = data.title || "";

  Message.news.add(text, image, url, title)
  .then(aux.setData(req, next))
  .catch(next)
}, aux.std);

app.post('/api/news/edit/:id', aux.isAdmin, function (req, res, next){
  var id = req.params.id || null;
  var data = req.body;

  var text = data.text || "";
  var image = data.image || "";
  var url = data.url || "";
  var title = data.title || "";

  var obj = {
    text:text,
    image:image,
    url:url,
    title:title
  };

  Message.news.edit(id, obj)
  .then(aux.setData(req, next))
  .catch(next)
}, aux.std);

app.get('/api/news/activation/:id/:status', aux.isAdmin, function (req, res, next){
  Message.news.activation(req.params.id||null, req.params.status || null)
  .then(function (result){
    if (result) realtime().UPDATE_ALL();
    return result;
  })
  .then(aux.setData(req, next))
  .catch(next)
}, aux.json, aux.err);



app.get('/get_message', middlewares.isAdmin, function (req, res, next){
  var id = req.query.id;
  Message.notifications.getByID(id)
  .then(function (notification){
    req.data = notification;
    next();
  })
  .catch(next)
}, aux.json, aux.err);

app.get('/messages', middlewares.isAdmin, function (req, res, next){
  var login = req.query.login;
  Message.notifications.all(login)
  .then(function (news){
    req.data = news;
    next()
  })
  .catch(next)
}, aux.answer('Notifications'), aux.err);


app.get('/notifications/send', middlewares.isAdmin, aux.answer('admin/SendMessage'));

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

  aux.alert(target, notificationType || 6, obj)
    .then(function (result){
      req.data = result;
      next();
    })
    .catch(next)

}, aux.json, aux.err);

app.post('/messages/chat/recent', function (req, res, next){
  // console.log('messages/chat/recent')
  var room = 'default';

  Message.chat.load(room)
    .then(aux.setData(req, next))
    .catch(next)
}, aux.std);


app.get('/notifications/news', middlewares.authenticated, function (req, res, next){
  var login = req.login;

  Message.notifications.news(login)
  .then(function (news){
    req.data = news;
    next()
  })
  .catch(next)
}, aux.json, aux.err);

app.get('/notifications/all', middlewares.authenticated, function (req, res, next){
  // var login = req.params.login;
  var login = getLogin(req);

  Message.notifications.all(login)
  .then(function (news){
    req.data = news;

    Message.notifications.markAll(login)
    .catch(function(){});

    next()
  })
  .catch(next)
}, aux.json, aux.err);

// app.post('/message/read/:id', middlewares.authenticated, function (req, res, next){
//   var id = req.params.id;
//   var login 
// })

var players = [];
setInterval(function (){
  // Send('players', {msg: players});
  Log('Online: ' + JSON.stringify(players), 'Users');
}, 20000);

setInterval(function (){ players=[]; }, 60000);

app.post('/mark/Here/:login', function (req, res){
  var login = req.params.login;
  // strLog('Online: ' + login, 'Users');
  players.push(login);

  res.end('');
});

const GET_TOURNAMENTS_UPDATE = 6;
