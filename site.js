var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo');//(express);
//var io = require('socket.io')(app);
var fs = require('fs');
var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
//console.log(file);
var configs =  JSON.parse(file);
/*{ 
  msg:'superhero!',
  gamePort:5009,
  gameHost:'localhost',
  gameHost2:'46.101.157.129'
}*/
var date = new Date();
console.log(date + '  ' + JSON.stringify(configs));
var server;

//console.log(configs)
var gameHost = configs.gameHost? configs.gameHost : '127.0.0.1';
var gamePort = configs.gamePort? configs.gamePort : '5009';

console.log('ololo');
app.use(express.static('./frontend/public'));
//app.use(express.static('games'));
app.use(express.static('./frontend/games/PingPong'));
app.use(express.static('./frontend/games/Questions'));

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');*/

app.use(cookieParser());
app.use(session({
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true,/**/
}));

app.use(function(req,res,next){
  switch(req.url){
    case '/Log':

    break;
    default:
      console.log('Site: Request! ' + req.url);

    break;
  }
  
  res.locals.session = req.session;
  next();
});
/*app.use(session({
  store: new MongoStore({
    url: 'mongodb://root:myPassword@mongo.onmodulus.net:27017/3xam9l3'
  }),
  secret: '1234567890QWERTY'
}));*/

/*app.set('views', './views');
app.set('views', './games/PingPong');*/
app.set('views', ['./frontend/views', './frontend/games/PingPong', './frontend/games/Questions']);
//app.set('games/PingPong', './views');



app.set('view engine', 'jade');

var sender = require('./requestSender');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 




function AsyncRender(targetServer, reqUrl, res, options, parameters){//options: parameters, renderPage, callback, sender, failCallback
  var basicInfo = targetServer+': /' + reqUrl + ' ';
  if (parameters) basicInfo += JSON.stringify(parameters);
  // res==null generally means that I will use AsyncRender in promise cascade
  Log('AsyncRender', 'Transport');
  if (targetServer && reqUrl){
    sender.sendRequest(reqUrl, parameters||{}, '127.0.0.1', targetServer, res||null, function (err, response, body, res){
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
              /*case 'fail':                 
                options.failCallback(res || null, body, options, parameters);
                return;
              break;*/

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

function siteAnswer( res, FSUrl, data, renderPage, extraParameters, title){

  if (FSUrl && res){
    sender.expressSendRequest(FSUrl, data?data:{}, '127.0.0.1', 
        'FrontendServer', res, function (error, response, body, res1){
          if (!error){
            if (FSUrl=='GetUserProfileInfo') Log(FSUrl + ' ' + JSON.stringify(body), 'Users');
            res1.render(renderPage?renderPage:FSUrl, { title: title?title:'Tournaments!!!', message: body, extra: extraParameters});
          } else {
            sender.Answer(res1, { result:error });
          }
            console.log('*****************');
            console.log('***SITE_ANSWER***');
            console.log('*****************');
        });
  }
  else {
    console.log('INVALID siteAnswer');
    //try{ console.log(FSUrl)}
  }
}
app.post('/Admin', Admin);
function Admin(req, res){
  var command = req.body.command || '';
  switch(command){
    case 'TournamentsRunning': TournamentsRunning(res); break;
    case 'stopTournament': stopTournament(res, req.body.tournamentID); break;
    case 'runTournament': runTournament(res, req.body.tournamentID); break;
    case 'Tournaments': GetTournamentsFromTS(res); break;
    case 'Stop': StopServer(res, req.body.serverName); break;

    case 'GetGameFromGameServer': GetGameFromGameServer(res, req.body.gameNameID); break;
    default: sender.Answer(res, {result:'Unknown command ' + command}); break;
  }
}

function GetGameFromGameServer(res, gameNameID){
  var servName = gameNameID;
  AsyncRender(serverName, 'GetGames', res);
}

function GetTournamentsFromTS(res){
  sender.sendRequest('Tournaments', {}, 'localhost', 'TournamentServer', res, sender.Proxy);
}

function stopTournament(res, tournamentID){
  sender.sendRequest('StopTournament', {tournamentID:tournamentID}, 'localhost', 'TournamentServer', res, sender.Proxy);

  strLog('FrontendServer StopTournament :::'+tournamentID, 'Manual');
  sender.sendRequest("StopTournament", {tournamentID:tournamentID}, '127.0.0.1', 'GameFrontendServer', null, sender.printer);
}

function runTournament(res, tournamentID){
 sender.sendRequest('RunTournament', {tournamentID:tournamentID}, 'localhost', 'TournamentServer', res, sender.Proxy); 
}

function TournamentsRunning(res){
  sender.sendRequest('Running', {}, 'localhost', 'TournamentServer', res, sender.Proxy);
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
            console.log('*****************');
            console.log('***SITE_ANSWER***');
            console.log('*****************');
        });
  }
  else {
    console.log('INVALID siteAnswer');
  }
}

app.get('/Admin', function (req, res){
  //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
  res.render('AdminPanel', {msg:'hola!'});
    return;
  if (isAuthenticated(req) && getLogin(req) =='Alvaro_Fernandez'){
    res.render('AdminPanel', {msg:'hola!'});
    return;
  }
  res.send(404);

});

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
/*app.get('/SpecLogs', function (req, res){
  //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
  var topic = req.params.topic||'Forever';
  res.render('SpecLogs', {topic:topic});
});*/

function JSLog(msg, topic){
  io.emit(topic?topic:'Logs', JSON.stringify(msg));
}

app.get('/Alive', function (req, res){
  res.render('Alive');
})

app.get('/Logout', function (req, res){
  req.session.destroy(function (err){
    if (err){ console.log('Session destroying error:' + err);}
  });
  res.render('Login',{});
});

app.get('/Login', function (req, res){
  res.render('Login',{});
})

function LoginOrRegister(req, res, command){
    var data = req.body;
  
  if (data && data.login && data.password) {
    var callback = function(res, body, options, parameters){
      Log(command + ' user ' + data.login, 'Users');
      req.session.login = data.login;
      res.redirect('Tournaments');
    }
    var failCallback = function(res, body, options, parameters){
      Log('Reject user ' + data.login,'Users');
      res.render(command,{err:body.result});
    }
    AsyncRender('DBServer', command, res, { callback:callback, failCallback:failCallback }, data );
    return;
  }
  res.render(command, Fail );
}

app.post('/Login', function (req, res){
  /*var data = req.body;
  Log('User ' + data.login + ' tries to log')
  console.log('Login: ' + data.login);
  console.log('Pass: ' + data.password);*/
  //res.redirect('Tournaments');
  
  /*if (data && data.login && data.password) {
    data.callback = function(res, body, options){
      Log('Log user ' + data.login, 'Users');
      req.session.login = data.login;
      res.redirect('Tournaments');
    }
    data.failCallback = function(res, body, options){
      Log('Reject user ' + data.login,'Users');
      res.render('Login',{err:body.result});
    }
    AsyncRender('FrontendServer', 'Login', res, data );
    return;
  }
  res.render('Login', Fail );*/
  LoginOrRegister(req, res, 'Login');
  /*sender.expressSendRequest('Login', data?data:{}, '127.0.0.1', 
        'FrontendServer', res, 
        function (error, response, body, res1){
          if (error){
            console.log('error :' + JSON.stringify(error));
          }else{
            switch (body.result){
              case 'OK':
                req.session.login = data.login;
                res.redirect('Tournaments');
              break;
              default:
                res.render('Login',{err:body.result});
              break;
            }
          }
        }
  );*/
});

app.post('/Register', function (req, res){
  LoginOrRegister(req, res, 'Register');
  /*var data = req.body;
  console.log('Login: ' + data.login);
  console.log('Pass: ' + data.password);
  //res.redirect('Tournaments');
  
  sender.sendRequest('Register', data?data:{}, '127.0.0.1', 
        'FrontendServer', res, 
        function (error, response, body, res1){
          switch (body.result){
            case 'OK':
              req.session.login = data.login;
              res.redirect('Tournaments');
            break;
            default:
              res.render('Register',{err:body.result});
            break;
          }
        }
  );*/
});

app.get('/Register', function (req, res){
  res.render('Register');
})


function regManager(command, req, res){
  var data = req.body;
  console.log(data.login);
  console.log(data.tournamentID);

  if (isAuthenticated(req)){
    AsyncRender('TournamentServer', command, res, null,  data);
    /*sender.sendRequest(command, data?data:{}, '127.0.0.1', 'FrontendServer', res, 
      function (error, response, body, res1){
        res.send(body.result);
      });*/
  }
  else{
    sender.Answer(res, {result:'auth'});
  }
}
app.post('/CancelRegister', function (req, res){
  regManager('CancelRegister',req, res);
})
app.post('/RegisterInTournament', function (req, res){
  regManager('RegisterUserInTournament',req, res);
  //console.log('WRITE Socket emitter!!!')
})


app.get('/AddTournament', function (req, res){
  res.render('AddTournament');
  /*if (req.session.login=='Alvaro_Fernandez'){
    res.render('AddTournament');
    //siteAnswer(res, 'AddTournament');
  }
  else{
    res.render('Alive');
  }*/
});
function Log(data, topic){
  JSLog({msg:data}, topic);
}

/*app.post('/AddTournament', function (req, res){
  //sender.expressSendRequest('AddTournament', req.body, '127.0.0.1', serv)
  var data = req.body;
  Log(data, 'Manual');

  //####
  data.renderPage='AddTournament';
  AsyncRender('FrontendServer', 'AddTournament', res, {renderPage:'AddTournament'}, data);
  //####

  ///sender.sendRequest('AddTournament', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
  //      function (error, response, body, res1){
  //        //res1.json(body);
  //        res.render('AddTournament', {msg:body});
  //      });
})*/
app.post('/AddTournament', AddTournament);

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

var strLog = Log;
var Answer = sender.Answer;

function AddTournament(req, res){
  var data = req.body;
  
  if (data){
    strLog('Incoming tournament : ' +JSON.stringify(data));
    var buyIn = parseInt(data.buyIn);
    var rounds = parseInt(data.rounds);
    var gameNameID = parseInt(data.gameNameID);
    var GoNext = data.goNext?data.goNext.split(" ") : [];
    var Prizes = data.Prizes.split(" ");
    var prizes = [];
    var goNext = [];
    strLog(JSON.stringify(Prizes));
    //convert array of strings to array of objects
    for (var i = 0; i < Prizes.length - 1; i++) {
      if (isNaN(Prizes[i]) ){
        if (Prizes[i].length>0){
          prizes.push({giftID:Prizes[i]})
        }
        else{
          strLog('Prize[i] is null. Current prize is: ' + Prizes[i]);
          Answer(res, Fail);
          return;
        }
      }
      else{
        prizes.push( parseInt(Prizes[i]) );
      }
    };

    for (var i=0; i< GoNext.length - 1; ++i){
      var num = parseInt(GoNext[i]);
      if (isNaN(num)){
        strLog('goNext num parseInt error! ');
        strLog(GoNext);
        Answer(res, Fail);
        return;
      }
      else{
        goNext.push( num );
      }
    }

    strLog('splitted prizes: ' + JSON.stringify(prizes) );
    strLog('goNext.length:' + goNext.length);
    strLog(JSON.stringify(goNext));
    //strLog('')
    if (buyIn>=0 && rounds && gameNameID){
      var obj = {
        buyIn:      buyIn,
        initFund:     0,
        gameNameID:   gameNameID,

        pricingType:  PRICE_NO_EXTRA_FUND,

        rounds:     rounds,
        goNext:     goNext.length>0 ? goNext : [2,1],//
            places:     [1],
          Prizes:     prizes.length>0 ? prizes: [{giftID:'5609b7988b659cb7194c78c6'}],
            prizePools:   [1],

        comment:    'Yo',
        
        playersCountStatus: COUNT_FIXED,///Fixed or float
          startDate:    null,
          status:     null, 
          players:    0
      }
      AsyncRender('DBServer', 'AddTournament', res, {renderPage:'AddTournament'}, obj);
      //sender.sendRequest('AddTournament', obj, '127.0.0.1', 'DBServer', res, sender.proxy);
    }
    else{
      strLog('Invalid data comming while adding tournament: buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID, 'WARN');
      Answer(res, Fail);
    }
  }
  else{
    Answer(res, Fail);
  }

}

app.post('/FinishGame', FinishGame);
function FinishGame(req, res){
  var data = req.body;
  Answer(res, {result:'OK', message:'FinishGame'});
  sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}


app.get('/AddGift', function (req, res){
  res.render('AddGift');
});

app.post('/AddGift', function (req, res){
  var data = req.body;
  Log(data,'Manual');
  if (data){
    sender.sendRequest('AddGift', data, '127.0.0.1', 'DBServer', res, function (error, response, body, res1){
          res.render('AddGift', {msg:body});
        });
  }
  else{
    Answer(res, Fail);
  }
  //sender.sendRequest('AddGift', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
        
});

app.get('/ShowGifts', function (req, res){
  /*var data = req.body;
  if (!data){ data={}; }
  siteAnswer(res, 'ShowGifts', data, 'ShowGifts');*/
  AsyncRender('DBServer', 'ShowGifts', res, {renderPage:'ShowGifts'});
});

app.all('/StartTournament', function (req, res){
  //console.log(req.url);
  Log('StartTournament', 'ASD');
  console.log('Site starts tournament');
  var data = req.body;
  //console.log(req.body);
  
  //
  sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
  //

  io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
  res.end();
});



app.get('/CheckServer', function (req, res){
  var serv = req.query.serv;
  sender.expressSendRequest('Alive', {msg:'CheckServer'}, '127.0.0.1', serv, res, sender.printer);

});
app.get('/GetGift', function (req, res){
  var data = req.body;
  var query = req.query;
  var giftID = query.giftID;
  if (query){
    //siteAnswer(res, 'gift')
    sender.sendRequest('GetGift', {giftID:giftID} , '127.0.0.1', 'DBServer', res, 
        function (error, response, body, res1){
          //res.send(body.result);
          if (error || !body || body.length ==0 || body.result =='fail'){
            Log(JSON.stringify(error));
            res.send(404);//'Gift does not exist');
          }
          else{
            res.render('gift', {message:body} );
          }
        });
  }
  else {
    res.json({msg:'err'});
  }
})

function isAuthenticated(req){
  return req.session && req.session.login;
}

var Fail = {result:'fail'};

function getLogin(req){
  if (isAuthenticated(req)){
    return req.session.login;
  }
  else{
    return 0;
  }
}

app.post('/Cashout', function (req, res){
  //if (isAuthenticated(req))
  /*var data = req.body;
  var login = getLogin(req);
  if (data && login!=0 ){
    data.login = login;
    siteProxy(res, 'Cashout',data,null,'MoneyServer');
  }else{
    res.send(400);
  }*/
  MoneyTransferOperation(req, res, 'Cashout');
})

function MoneyTransferOperation(req, res, operation){
  if (isAuthenticated(req)){
    var data = req.body;
    var login = getLogin(req);
    if (data && login){
      data.login = login;
      siteProxy(res, operation,data,null,'MoneyServer');
      return;
    }
  }
  //else
  res.send(400);
}

app.post('/Deposit', function (req, res){
  //if (isAuthenticated(req))
  /*var data = req.body;
  var login = getLogin(req);
  if (data && login!=0 ){
    data.login = login;
    siteProxy(res, 'Deposit',data,null,'MoneyServer');
  }else{
    res.send(400);
  }*/
  MoneyTransferOperation(req, res, 'Deposit');

})

app.get('/Cashout', function (req, res){
  //if (isAuthenticated(req))
  res.render('Cashout');

})
app.get('/Deposit', function (req, res){
  res.render('Deposit');
})


app.get('/Profile', function (req, res){
  var login = 'Alvaro_Fernandez';
  if (isAuthenticated(req) ){//req.session && req.session.login
    login = getLogin(req);
    AsyncRender("DBServer", 'GetUserProfileInfo', res, {renderPage:'Profile'}, {login:login} );
    return;
  }
  res.json({msg:'Log in first'});
  //else{
  //}
  //siteAnswer(res, 'GetUserProfileInfo', {login:login}, 'Profile');
})

app.post('/GetGift', function (req, res){
  var data = req.body;
  if (data){
    sender.sendRequest('GetGift', data, '127.0.0.1', 'DBServer', res, 
        function (error, response, body, res1){
          //res.send(body.result);
          res.json(body);
        });
  }
  else {
    res.json({msg:'err'});
  }
})

app.get('/Users' , function (req, res){
  /*if(req.session.login) {
    console.log('Saved login is: ' + req.session.login);
    //res.write('Last page was: ' + req.session.user + '. ');
  }
  console.log(req.params);
  if (req.query.login){
    console.log(req.query);
    console.log('Getting login: ' + req.query.login);
    req.session.login = req.query.login;

  }*/
  
  var data = req.body;
  data.query = {};//tournamentID:req.query.tID};
  data.queryFields = 'login money';

  //siteAnswer(res, 'GetUsers', data, 'Users');//, {login: req.session.login?req.session.login:''} );//Users
  
  AsyncRender("DBServer", 'GetUsers', res, {renderPage:'Users'}, data);
});

app.post('/ServeTournament', ServeTournament);
function ServeTournament (req, res){
  var data = req.body;
  strLog("ServeTournament ... FS ", 'Tournaments')
  //strLog(JSON.stringify(data));//['tournamentStructure']);
  
  var tournament = data;

  sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'GameFrontendServer', res, proxy);
}


app.all('/Tournaments', function (req,res){
  var data = req.body;
  data.queryFields = 'tournamentID buyIn goNext gameNameID players';

  //siteAnswer(res,'GetTournaments', data, 'GetTournaments');//, 'GetTournaments');//, data, 'GetTournaments');
  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'GetTournaments'}, data);


  /*sender.sendRequest('GetTournaments', data, '127.0.0.1', 
      'FrontendServer', res, function (error, response, body, res1){

        if (!error){
          //var msg = body;
          res1.render('GetTournaments', { title: 'GetTournaments', message: body});
        } else{
          sender.Answer(res1, { result:error});
        }
      });*/
});
const GET_TOURNAMENTS_INFO = 4;

app.get('/TournamentInfo', function (req, res){
  var data = req.body;
  data.query = {tournamentID:req.query.tID};
  data.queryFields = 'tournamentID buyIn goNext gameNameID Prizes players status';
  data.purpose = GET_TOURNAMENTS_INFO;
  //siteAnswer(res, 'GetTournaments', data, 'TournamentInfo');

  /*var obj = {
    sender: "FrontendServer",
    tournamentID: data['tournamentID'],
    query: data['query'],
    queryFields: data['queryFields'],
    purpose: data['purpose']||null
  };*/

  /*var obj = {
    sender: "FrontendServer",
    tournamentID: data['tournamentID'],
    query: {tournamentID:req.query.tID},
    queryFields: 'tournamentID buyIn goNext gameNameID Prizes players status',
    purpose: GET_TOURNAMENTS_INFO
  };
  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'TournamentInfo'}, obj);*/
  

  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'TournamentInfo'}, data);
});



app.get('/chat', function(req, res){
  //var i=0;
  //io.emit('chat message', { hello: 'Gaga the great!' });
  /*var abd = setInterval(function(){
  //'Gaga the great!'
}, 10);*/
  res.sendFile(__dirname + '/sock.html');
});

app.get('/', function (req,res){
  res.render('Login');
})


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

server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



var clients = [];

var io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('IO connection');
  //socket.join('/111');
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
  socket.on('event1', function(data){
    /*console.log('io.on connection--> socket.on event1');
    console.log(data);*/
    SendToRoom('/111', 'azz', 'LALKI', socket);
    //io.of('/111').emit('azz','LALKI');
  });
});
/*var tmr2 = setTimeout(function(){
  console.log(io.sockets.server.nsps['/111'].sockets);
}, 11000);*/


io.of('/111').on('connection', function(socket){
  console.log('ololo222');
  socket.on('event1', function(data){
    console.log('ololo111');
    console.log(data);
  })
})

function SendToRoom( room, event, msg, socket){
  io.of(room).emit(event, msg);
}