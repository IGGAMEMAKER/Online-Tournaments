var core = require('./core');
var serverName = 'Stats';
core.StartServer({host:'localhost', port:5002, serverName:serverName});
var app = core.app;
var sendRequest = core.sendRequest;
var Log = core.Log;
var OK = core.OK;
var Fail = core.Fail;
var str = core.str;

var handler = require('./errHandler')(app, Log, serverName);

var OpenedTournament = {};

app.post('/OpenedTournament', function (req, res){
	var stat = req.body;


})

app.post('/ClosedTournament', function (req, res){

})

app.post('/FinishedTournament', function (req, res){

})

app.post('/')

