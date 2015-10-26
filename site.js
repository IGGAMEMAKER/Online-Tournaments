var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo')(session);
//var io = require('socket.io')(app);

var fs = require('fs');
var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
//console.log(file);
var configs =  JSON.parse(file);
var serverName = 'site';

var server;


var SOCKET_ON=1;
var socket_enabled=SOCKET_ON;

app.use(express.static('./frontend/public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sessionDB');



app.use(cookieParser());
/*app.use(session({
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true,
}));*/

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

app.use(function(req,res,next){
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
      console.log('Site: Request! ' + req.url);

    break;
  }
  
  res.locals.session = req.session;
  next();
});

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



/*app.set('views', './views');
app.set('views', './games/PingPong');*/
app.set('views', ['./frontend/views', './frontend/views/admin', './frontend/games/PingPong', './frontend/games/Questions']);
//app.set('games/PingPong', './views');




app.set('view engine', 'jade');

var sender = require('./requestSender');

var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var gifts = require('./Modules/site/gifts')(app, AsyncRender, Answer, sender, Log, proxy);
var tournaments = require('./Modules/site/tournaments') (app, AsyncRender, Answer, sender, Log, proxy);
var admin =       require('./Modules/site/admin')       (app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);
var money =       require('./Modules/site/money')       (app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy);

var user = require('./Modules/site/user')(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin);



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

  app.post('/FinishGame', FinishGame);
  function FinishGame(req, res){

    var data = req.body;
    Log('FinishGame' + JSON.stringify(data), 'Tournaments');
    Answer(res, {result:'OK', message:'FinishGame'} );
    sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
  }
  

  app.all('/StartTournament', function (req, res){
    //console.log(req.url);
    Log('StartTournament', 'ASD');
    console.log('Site starts tournament');
    var data = req.body;
    //console.log(req.body);

    //
    sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
    //
    if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
    res.end();
  });


function isAuthenticated(req){
  return req.session && req.session.login;
}

function getLogin(req){
  if (isAuthenticated(req)){
    return req.session.login;
  }
  else{
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
  /*switch(topic){
  }
  fs.appendFile*/
}

app.get('/Alive', function (req, res){
  res.render('Alive');
})


app.get('/chat', function(req, res){
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

server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



var clients = [];
var io;
if (socket_enabled){
  io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.log('IO connection');
    //socket.join('/111');
    socket.on('chat message', function(msg){
      console.log(msg);
      io.emit('chat message', msg);
    });
    socket.on('event1', function(data){
      SendToRoom('/111', 'azz', 'LALKI', socket);
      //io.of('/111').emit('azz','LALKI');
    });
  });

  io.of('/111').on('connection', function(socket){
    console.log('ololo222');
    socket.on('event1', function(data){
      console.log('ololo111');
      console.log(data);
    })
  })
}

function SendToRoom( room, event, msg, socket){
  if (socket_enabled) io.of(room).emit(event, msg);
}