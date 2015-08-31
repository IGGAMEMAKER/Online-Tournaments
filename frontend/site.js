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
app.use(express.static('public'));

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');*/

app.use(cookieParser());
app.use(session({
  secret: '1234567890QWERTY'/*,
  resave: true,
  saveUninitialized: true,*/
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
/*app.use(session({
  store: new MongoStore({
    url: 'mongodb://root:myPassword@mongo.onmodulus.net:27017/3xam9l3'
  }),
  secret: '1234567890QWERTY'
}));*/

app.set('views', './views');
app.set('view engine', 'jade');

var sender = require('./requestSender');
var proc = require('./test');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

app.get('/Logout', function (req, res){
  req.session.destroy(function (err){
    if (err){ console.log('Session destroying error:' + err);}
  });
  res.render('Login',{});
});

/*app.get('/Login', function (req, res){
  res.render('Login',{});
})

app.post('/Login', function (req, res){

});*/

app.post('/Register', function (req, res){
  var data = req.body;
  console.log('Login: ' + data.login);
  console.log('Pass: ' + data.password);
  //res.redirect('Tournaments');
  
  sender.sendRequest('Register', data?data:{}, '127.0.0.1', 
        proc.getPort('FrontendServer'), res, 
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
          /*if (body.result=='OK'){
            //res.render('')
            
          }
          else{
            
          }*/
        }
  //siteAnswer(res, 'Register', data);
  );
});

app.get('/Register', function (req, res){
  res.render('Register');
})

app.all('/StartTournament', function (req, res){
  console.log(req.url);
  console.log('Site starts tournament');
  console.log(req.body);
  io.emit('StartTournament', 'StartTournament'+ req.body.tournamentID);//+req.body.tournamentID
  res.end();
});

app.get('/Users' , function (req, res){
  if(req.session.login) {
    console.log('Saved login is: ' + req.session.login);
    //res.write('Last page was: ' + req.session.user + '. ');
  }
  console.log(req.params);
  if (req.query.login){
    console.log(req.query);
    console.log('Getting login: ' + req.query.login);
    req.session.login = req.query.login;

  }
  
  var data = req.body;
  data.query = {};//tournamentID:req.query.tID};
  data.queryFields = 'login money';

  //siteAnswer(res, 'GetUsers', data, 'tAuth', {login: req.session.login} );
  siteAnswer(res, 'GetUsers', data, 'Users');//, {login: req.session.login?req.session.login:''} );//Users
});

app.get('/Tournaments', function (req,res){
  /*var data = req.body;
  data.queryFields = 'tournamentID buyIn goNext gameNameID';*/

  //siteAnswer(res,'GetTournaments', 'GetTournaments', data, 'GetTournaments');
  siteAnswer(res,'GetTournaments');//, 'GetTournaments');//, data, 'GetTournaments');

  /*sender.sendRequest('GetTournaments', data, '127.0.0.1', 
      proc.getPort('FrontendServer'), res, function (error, response, body, res1){

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

function siteAnswer( res, FSUrl, data, renderPage, extraParameters, title){

  if (FSUrl && res){
    sender.sendRequest(FSUrl, data?data:{}, '127.0.0.1', 
        proc.getPort('FrontendServer'), res, function (error, response, body, res1){
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

/*app.all('*', function (req, res){
  console.log(req.url);
  var data = req.body;*/

  /*var url = req.url;
  console.log(url);

  //url = url.substr(1);
  
  //if (url.indexOf("?")>-1){
  //  url = url.substr(0,url.indexOf("?"));
  //}

  if (url!='/favicon.ico'){
    console.log(url);
    console.log(req.params);
    var pathname = parseurl(req).pathname;
    pathname = pathname.substr(1);
    console.log('pathname :'+ pathname);
    url = pathname;
  }*/

/*  var url = (parseurl(req).pathname).substr(1);

  console.log(url);
  var FSUrl = url;
  switch(url){
    case 'Tournaments':
      url = FSUrl = 'GetTournaments';
      data.queryFields = 'tournamentID buyIn goNext gameNameID';
    break;
    case 'TournamentInfo':
      FSUrl = 'GetTournaments';
      console.log(req.query);
      data.query = {tournamentID:req.query.tID};
      data.queryFields = 'tournamentID buyIn goNext gameNameID';
      console.log('Logging');
      console.log(data.query);
    break;
    case 'favicon.ico':
      res.json({ result:'fucken favicon'});
      //sender.Answer(res, { result:'fucken favicon'});
    break;
  }

  if (url!='favicon.ico'){
    //console.log(req);
    console.log('req to FrontendServer: ' + FSUrl);
    console.log(data);
    sender.sendRequest(FSUrl, data, '127.0.0.1', 
      proc.getPort('FrontendServer'), res, function (error, response, body, res1){

        if (!error){
          var msg = getData(body, url, req);
          //console.log(JSON.stringify(msg));
          //switch (url) {case 'TournamentInfo': url = 'TournamentInfo'; console.log('ssss'); break;}

          console.log('Trying to get url ' + url);
          if (url!='Alive'){
            res1.render(url, { title: 'Hey', message: msg});//JSON.stringify()})
          }
          else{
            res.json(msg);
          }
        } else{
          sender.Answer(res, { result:'fucken favicon'});
        }
      });
  }
})*/


/*function getData(body,url, req){
  console.log('getData: ' + url);
  var obj = body;
  switch (url){
    case 'GetTournaments':
      obj.queryFields = 'id buyIn goNext gameNameID';
      console.log(body.length);
    break;
    case 'TournamentInfo':
    console.log('TournamentInfo ' + body.length);
    obj.query = {TournamentID:2};
    obj.queryFields = 'id buyIn goNext gameNameID';
    break;
  }
  return obj;
}*/


app.get('/', function(req, res){
  //var i=0;
  //io.emit('chat message', { hello: 'Gaga the great!' });
  /*var abd = setInterval(function(){
  //'Gaga the great!'
}, 10);*/
  res.sendFile(__dirname + '/sock.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
});

/*io.on('connection', function (socket) {
  socket.emit('TournamentReg', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log('Socket Event, bro!!!');
    console.log(data);
  });
});*/
//var io = require('socket.io')(app);
//var io = require('socket.io')(server);
