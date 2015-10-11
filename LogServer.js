var core = require('./core');

core.StartServer({host:'localhost', port:5006, serverName:'MoneyServer'});
var app = core.app;
var str = core.str;

app.post('/Log', function (req, res){
  //res.end('sended');
  res.end('');
  var msg = req.body;
  Log(msg);
});

function Log(msg){
	io.emit('Logs', JSON.stringify(msg));
}

function Error(err){
	io.emit('Errors', JSON.stringify(err) );
}

app.post('/Error', function (req, res){
	res.end('');
	var msg = req.body;
	Error(msg);
})