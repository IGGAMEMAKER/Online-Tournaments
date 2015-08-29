/*var socket = require('socket.io-client')('http://localhost');
  socket.on('connect', function(){
  	console.log('Connection!!!!');
  });
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});*/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	var i=0;
	var abd = setInterval(function(){
	io.emit('chat message', { hello: i++ });//'Gaga the great!'
}, 10);
  res.sendFile(__dirname + '/sock.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.emit('chat message', msg);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
  console.log(__dirname);
});