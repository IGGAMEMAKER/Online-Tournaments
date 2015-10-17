var sender = require('./requestSender');
var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var sendRequest = sender.sendRequest;
var app = express();
var Answer = sender.Answer;
var serverName = ""; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

//var Log = sender.strLog;
function Log(msg){
	//console.log(msg);
	if (!serverName || serverName=='LogServer'){
		console.log(msg);
	}
	else{
		sender.strLog(msg);
	}
}

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
	//Answer(res, 'OK');
	console.log('closing');
	res.json('TriedToKill');

	//io.close();
	server.close();
	console.log(process.pid);
	process.exit(0);
})


//Log('Server Core starts!!');

/*function Answer(res, code){
	res.end(code);
}*/

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
var servConfigs;
var constants;

function ReadConfigs(){
	var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
	//console.log(file);
	configs =  JSON.parse(file);
	//console.log(JSON.stringify(configs));
}

function ReadServerConfigs(){
	var file = fs.readFileSync('./configs/'+serverName+'.txt', "utf8");
	servConfigs = JSON.parse(file);
	console.log(JSON.stringify(servConfigs));
}
function ReadConstants(){
	var file = fs.readFileSync('./configs/'+'constants'+'.txt', "utf8");
	constants = JSON.parse(file);
	console.log(JSON.stringify(constants));
}




var server;
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
			Log(serverName + ' is listening at http://'+ host+':'+ port + '. Powered by core.js');
		});
	}
}
function DBupdate(urlPath, curData, host, res, responseCallBack){
	if (!host) {host = 'localhost';}
	if (res && responseCallBack){
		Log('DBupdate:' + str(curData) +' host: '+host);

		sendRequest(urlPath, curData, host, 'DBServer', res, responseCallBack);
		
	}else{
		Log('DBupdate NO ARGS');
		sendRequest(urlPath, curData, host, 'DBServer', null, sender.printer);
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
	//ReadServerConfigs();
	/*Log('gameModule Initialize');
	sender.sendRequest("GameServerStarts", {gameName:gameName} , '127.0.0.1', 
			'GameFrontendServer', null, sender.printer );*/
}
//StartServer({host:'localhost', port:3000, serverName:'Core'});

function getConstant(name){
	if (constants[name]) return constants[name];
	strLog('Cannot find constant: ' + name + ' please, check constant config to fix it', 'WARN');
}

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
this.Answer = Answer;
this.str = str;
this.server = server;
this.sCONF = serverConfigs;
this._const = getConstant;