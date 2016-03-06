/*var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 4080;


// var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

// var parseurl = require('parseurl');

// var jade = require('jade');

// var app = express();

var server;

var SOCKET_ON=1;
var socket_enabled=SOCKET_ON;

// app.use(express.static(__dirname));
//app.use(express.static('./frontend/public'));

// var configs = require('./configs');


// var request = require('request');

app.use(express.static(path.join(__dirname, '../')));
app.set('view engine', 'jade');
// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });

app.get('/', function (req, res){
  res.render('ws-template');
})

wss.on('connection', function connection(ws) {
  console.log('connection', ws);
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });*/


// var WebSocket = require('ws');
// var ws = new WebSocket('ws://echo.websocket.org/', {
//   protocolVersion: 13,
//   origin: 'http://websocket.org'
// });

// ws.on('open', function open() {
//   console.log('connected');
//   ws.send(Date.now().toString(), {mask: true});
// });

// ws.on('close', function close() {
//   console.log('disconnected');
// });

// ws.on('message', function message(data, flags) {
//   console.log('Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms', flags);

//   setTimeout(function timeout() {
//     ws.send(Date.now().toString(), {mask: true});
//   }, 500);
// });



var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express();

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(4080);

app.get('/', function (req, res){ res.sendFile(__dirname + '/views/ws-template.html')})

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
});