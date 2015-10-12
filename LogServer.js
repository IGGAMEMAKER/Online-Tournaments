var core = require('./core');

core.StartServer({host:'localhost', port:3000, serverName:'LogServer'});
var app = core.app;
var str = core.str;
var jade = require('jade');

app.set('views', ['./frontend/views', './frontend/games/PingPong', './frontend/games/Questions']);
//app.set('games/PingPong', './views');



app.set('view engine', 'jade');

var io = require('socket.io')(core.server);
io.on('connection', function(socket){

});

app.get('/Log', function (req, res){
  res.sendFile(__dirname + '/Logs.html');
});

app.post('/Log', function (req, res){
  //res.end('sended');
  res.end('');
  var msg = req.body;
  Log(msg);
});

app.post('/Error', function (req, res){
	console.log('I AM ERROR');
	res.end('');
	var msg = req.body;
	Error(msg);
})


function Log(msg){
	console.log('LOG:' + str(msg))
	io.emit('Logs', JSON.stringify(msg));
}

function Error(err){
	io.emit('Errors', JSON.stringify(err) );
}
function SendToRoom(room, event, msg){
	io.of(room).emit(event, msg);
}
SendToRoom('/111', 'azz', 'LALKI');