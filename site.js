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
console.log(file);
var configs =  JSON.parse(file);
/*{ 
  msg:'superhero!',
  gamePort:5009,
  gameHost:'localhost',
  gameHost2:'46.101.157.129'
}*/
console.log(JSON.stringify(configs));

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
  if (req.session){

  }
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


function siteAnswer( res, FSUrl, data, renderPage, extraParameters, title){

  if (FSUrl && res){
    sender.expressSendRequest(FSUrl, data?data:{}, '127.0.0.1', 
        'FrontendServer', res, function (error, response, body, res1){
          if (!error){
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

app.post('/Log', function (req, res){
  //res.end('sended');
  res.end('');
  var msg = req.body;
  var topic = req.body.topic;
  console.log(topic);
  Log(msg, topic || null);
});

app.get('/Log', function (req, res){
  res.sendFile(__dirname + '/Logs.html');
});
app.get('/SpecLogs', function (req, res){
  res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
});

function Log(msg, topic){
  io.emit(topic?topic:'Logs', JSON.stringify(msg));
}
app.all('/Game', function (req, res){
  console.log(__dirname);
  var tID = req.query.tournamentID;
  /*Log(req.query);
  Log(req.body);*/
  console.log(req.query.tournamentID);
  /*sender.expressSendRequest('GetTournaments', {tournamentID:tID}, '127.0.0.1', 
        'FrontendServer', res, function (error, response, body, res1){

  });*/
  
  res.render('qst_game', {
    tournamentID:tID?tID:111,
    gameHost:gameHost,
    gamePort:gamePort
  });
  
  //res.render('/games/PingPong/game', {tournamentID:111} );
  //res.sendFile(__dirname + '/games/PingPong/game.html');//, {tournamentID:111}, function(err){console.log(err); });
})



/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

app.get('/Alive', function (req, res){
  res.render('Alive');
})

app.post('/Alive', function (req, res){
  res.json('I hear you, helpless baby!');
  //console.log('PRINTIIIIIIIIIIIIIIIIIIING!!!!');
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

app.post('/Login', function (req, res){
  var data = req.body;
  console.log('Login: ' + data.login);
  console.log('Pass: ' + data.password);
  //res.redirect('Tournaments');
  
  sender.expressSendRequest('Login', data?data:{}, '127.0.0.1', 
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
  //siteAnswer(res, 'Register', data);
  );
});

function regManager(command, req, res, data){
  
  console.log(data.login);
  console.log(data.tournamentID);

  if (isAuthenticated(req)){
    sender.sendRequest(command, data?data:{}, '127.0.0.1', 'FrontendServer', res, 
      function (error, response, body, res1){
        res.send(body.result);
      });
  }
  else{
    sender.Answer(res, {result:'auth'});
  }
}

app.post('/CancelRegister', function (req, res){

  var data = req.body;
  regManager('CancelRegister',req, res, data);
})



app.post('/RegisterInTournament', function (req, res){
  console.log('REG USER IN TOURN');
  var data = req.body;

  regManager('RegisterUserInTournament',req, res, data);

  console.log('WRITE Socket emitter!!!')
})



app.post('/Register', function (req, res){
  var data = req.body;
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
  //siteAnswer(res, 'Register', data);
  );
});

app.get('/Register', function (req, res){
  res.render('Register');
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


app.post('/AddTournament', function (req, res){
  //sender.expressSendRequest('AddTournament', req.body, '127.0.0.1', serv)
  var data = req.body;
  Log(data);
  sender.sendRequest('AddTournament', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
        function (error, response, body, res1){
          //res1.json(body);
          res.render('AddTournament', {msg:body});
        });
})

app.get('/AddGift', function (req, res){
  res.render('AddGift');
});

app.post('/AddGift', function (req, res){
  var data = req.body;
  Log(data);
  sender.sendRequest('AddGift', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
        function (error, response, body, res1){
          res.render('AddGift', {msg:body});
        });
});

app.get('/ShowGifts', function (req, res){
  var data = req.body;
  if (!data){ data={}; }
  siteAnswer(res, 'ShowGifts', data, 'ShowGifts');
});

app.all('/StartTournament', function (req, res){
  //console.log(req.url);
  console.log('Site starts tournament');
  var data = req.body;
  //console.log(req.body);
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

app.get('/Cashout', function (req, res){
  //if (isAuthenticated(req))
  res.render('Cashout');

})

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
  var data = req.body;
  var login = getLogin(req);
  if (data && login!=0 ){
    data.login = login;
    siteProxy(res, 'Cashout',data,null,'MoneyServer');
  }else{
    res.send(400);
  }

})

app.get('/Deposit', function (req, res){
  res.render('Deposit');
})
app.post('/Deposit', function (req, res){
  //if (isAuthenticated(req))
  var data = req.body;
  var login = getLogin(req);
  if (data && login!=0 ){
    data.login = login;
    siteProxy(res, 'Deposit',data,null,'MoneyServer');
  }else{
    res.send(400);
  }

})

app.get('/Profile', function (req, res){
  var login = 'Alvaro_Fernandez';
  if (req.session && req.session.login){
    login = req.session.login;
  }
  else{
    //res.json({msg:'Сасай'});
  }
  siteAnswer(res, 'GetUserProfileInfo', {login:login}, 'Profile');
  /*sender.sendRequest('GetUserProfileInfo',  {login:login}, '127.0.0.1', 'FrontendServer', res, function (error, response, body, res){
      
      //sender.Answer(res, body);
    });*/
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

  //siteAnswer(res, 'GetUsers', data, 'tAuth', {login: req.session.login} );
  siteAnswer(res, 'GetUsers', data, 'Users');//, {login: req.session.login?req.session.login:''} );//Users
});

app.all('/Tournaments', function (req,res){
  var data = req.body;
  data.queryFields = 'tournamentID buyIn goNext gameNameID players';

  //siteAnswer(res,'GetTournaments', 'GetTournaments', data, 'GetTournaments');
  siteAnswer(res,'GetTournaments', data, 'GetTournaments');//, 'GetTournaments');//, data, 'GetTournaments');

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
  siteAnswer(res, 'GetTournaments', data, 'TournamentInfo');
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


var server = app.listen(80, function () {
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