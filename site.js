var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo');//(express);
//var io = require('socket.io')(app);

console.log('ololo');
app.use(express.static('./frontend/public'));
//app.use(express.static('games'));
app.use(express.static('./frontend/games/PingPong'));

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');*/

app.use(cookieParser());
app.use(session({
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true,/**/
}));

app.use(function(req,res,next){
    console.log('Site: Request!');
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
app.set('views', ['./frontend/views', './frontend/games/PingPong']);
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

app.get('/console', function (req, res){
  res.render('Logs');
});

app.get('/Game', function (req, res){
  console.log(__dirname);
  var tID = req.query.tournamentID;
  console.log(req.query.tournamentID);
  res.render('game', {tournamentID:tID?tID:111} );
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

app.post('/RegisterInTournament', function (req, res){
  console.log('REG USER IN TOURN');
  var data = req.body;
  console.log(data.login);
  console.log(data.tournamentID);

    sender.sendRequest('RegisterUserInTournament', data?data:{}, '127.0.0.1', 
        'FrontendServer', res, 
        function (error, response, body, res1){
          res.send(body.result);
        }
  );

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

app.all('/StartTournament', function (req, res){
  //console.log(req.url);
  console.log('Site starts tournament');
  //console.log(req.body);
  io.emit('StartTournament', {tournamentID : req.body.tournamentID, logins : req.body.logins});//+req.body.tournamentID
  res.end();
});

app.get('/CheckServer', function (req, res){
  var serv = req.query.serv;
  sender.expressSendRequest('Alive', {msg:'CheckServer'}, '127.0.0.1', serv, res, sender.printer);

});

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
  data.queryFields = 'tournamentID buyIn goNext gameNameID';

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

app.get('/TournamentInfo', function (req, res){
  var data = req.body;
  data.query = {tournamentID:req.query.tID};
  data.queryFields = 'tournamentID buyIn goNext gameNameID';

  siteAnswer(res, 'GetTournaments', data, 'TournamentInfo');
});



app.get('/', function(req, res){
  //var i=0;
  //io.emit('chat message', { hello: 'Gaga the great!' });
  /*var abd = setInterval(function(){
  //'Gaga the great!'
}, 10);*/
  res.sendFile(__dirname + '/sock.html');
});



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

/*io.of('/111').on('connection', function() {
  console.log("client connected");
});*/

/*app.post('/hello', function(req, res) {
  io.of('/hello').emit('hello');
});*/

/*io.on('event1', function(data){
  console.log('io.on event1');
  console.log(data); 
});*/

/*var nsp = io.of('/111');
nsp.on('connection', function(socket){
  console.log('nsp connection');
  console.log('someone connected TO 111');
  socket.join('/111');
  socket.join('111');
  nsp.on('event1', function(data){
    console.log(data);
  });

});*/



/*tmr1 = setInterval(function(){
  nsp.emit('azz', 'Gaga');
}, 10000);*/


/*io.on('connection', function (socket) {
  socket.emit('TournamentReg', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log('Socket Event, bro!!!');
    console.log(data);
  });
});*/
//var io = require('socket.io')(app);
//var io = require('socket.io')(server);
