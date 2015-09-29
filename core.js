var sender = require('./requestSender');
var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');

var app = express();

var serverName = ""; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

//var Log = sender.strLog;
function Log(msg){
	console.log(msg);
}
/*app.all('/Alive', function (req,res){
	console.log('Hey!!!');
	res.end('ololo');
})*/
ReadConfigs();

//var jade = require('jade');
app.use(express.static('./frontend/public'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function(req,res,next){
    Log(serverName + ': Request/' + req.url);
    next();
});

app.set('views', ['./frontend/views']);//, './frontend/games/PingPong', './frontend/games/Questions'
//app.set('view engine', 'jade');

app.get('/Alive', function (req, res){
	res.end('GET METHOD WORKED');
});
app.post('/Stop', function (req, res){
	Answer(res, 'OK');
})


Log('Server Core starts!!');

function Answer(res, code){
	res.end(code);
}

function Fail(res){
	Answer(res, { result:'fail' });
}
function OK(res){
	Answer(res, { result:'OK' });
}
/*var Fail = { result:'fail' };
var OK = { result:'OK' };*/

var io;
var host;
var port;
var configs;

function ReadConfigs(){
	var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
	console.log(file);
	configs =  JSON.parse(file);
	console.log(JSON.stringify(configs));
}
//var server;
function StartServer(options){
	Log('Trying to StartServer:' + options.serverName);
	if (options && options.port && options.serverName){
		serverName = options.serverName;

		startServer(options.port);
		//io = require('socket.io')(server);
		Initialize();
	}
	else{
		Log('Check options parameter in StartServer : ' + str(options));
	}
}

function startServer(port){
	if(port){
		server = app.listen(port, function () {
			host = server.address().address;
			port = server.address().port;
			Log(serverName + ' is listening at http://'+ host+':'+ port);
		});
	}
}
function DBupdate(urlPath, curData, host, res, responseCallBack){
	if (!host) {host = 'localhost';}
	if (!res || !responseCallBack){
		sendRequest(urlPath, curData, host, 'DBServer', null, sender.printer);
	}else{
		sendRequest(urlPath, curData, host, 'DBServer', res, responseCallBack);
	}
}

function DBAsk(urlPath, curData, host, res, responseCallBack){
	sendRequest(urlPath, curData, host, 'DBServer', res, responseCallBack);
}
function FSSend(urlPath, curData, host, res, responseCallBack){
	sendRequest(urlPath, curData, host, 'FrontendServer', res, responseCallBack);
}

function str(obj){
	return JSON.stringify(obj);
}

function SendToRoom( room, event1, msg){
	//Log('SendToRoom:' + room + '/'+event1+'/'+ JSON.stringify(msg));
	//games[room].socketRoom.emit(event1, msg);
}

function Initialize(){
	/*Log('gameModule Initialize');
	sender.sendRequest("GameServerStarts", {gameName:gameName} , '127.0.0.1', 
			'GameFrontendServer', null, sender.printer );*/
}
//StartServer({host:'localhost', port:3000, serverName:'Core'});

this.StartServer = StartServer;
this.app = app;
this.SendToRoom = SendToRoom;
this.Log = Log;
this.conf = configs;
this.FSSend = FSSend;
this.DBAsk = DBAsk;
this.DBupdate = DBupdate;
this.OK = OK;
this.Fail = Fail;