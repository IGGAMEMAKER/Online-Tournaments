//var http = require('http');
var request = require('request');
var serverList = {};

var fs = require('fs');

serverList['LogServer'] = 3000;

serverList['FrontendServer'] = 8888;//5000;
// serverList['TournamentServer'] = 5001;
serverList['TournamentServer'] = 8889;
serverList['Stats'] = 5002;
//serverList['TournamentManager'] = 5002;
//serverList['AccountServer'] = 5003;
serverList['BalanceServer'] = 5004;
//serverList['AdminServer'] = 5005;

serverList['MoneyServer'] = 5006;
serverList['DBServer'] = 5007;

serverList['GameFrontendServer'] = 5008;
serverList['GameServer'] = 5009;

serverList['site'] = 8888;

serverList['1']=5009;// Ping Pong
serverList['2']=5010;// Questions and Answers
serverList['3']=5011;// Battle

//console.log(serverList['DBServer']);

var gameNameIDList = {};

gameNameIDList['1'] = 5009;
gameNameIDList['2'] = 5001;
gameNameIDList['3'] = 5002;
gameNameIDList['4'] = 5003;

var serverName;

var topics = {};

function setServer(srvName){
	serverName = srvName;
}

function getPort (r){
	return serverList[r];
}

function getGamePort (r){
	return gameNameIDList[r];
}

var LOG_PATH =__dirname + '/Logs/';

function getLogs (req, res, next){
	var date = req.date|| new	Date();
	
	if (!date) return next('no date in logs');
	var dir = LOG_PATH + getDay(date) + '/';

	fs.readdir(dir, function (err, files){
		console.log('readdir', dir);

		if (err) return next(err);

		var time = getDay(date);
		req.time = time;
		req.files = files;
		next()
	})
}

function getLogFile(req, res, next){
	// console.log('getLogFile middleware')
	var name = req.query.name;
	var date = req.query.date || new Date();

	// console.log(name, date);
	
	if (!name) return next('no filename');
	var dir = LOG_PATH + date + '/';

	var filename = dir + name;
	// console.log('DIR NAME DATE', dir, name, date, '=', filename);

	fs.readFile(filename,'utf8', function (err, file){
		// console.log('readfile', filename);
		if (err) return next(err);
		// console.log(file);
		var lines = file.split("\n");
		req.file = lines;
		next();
	})
}

function strLog(text, topic){
	topics[topic?topic:'all'] = 1;
	var time = new Date();
	//console.log(time);
	//var txt = time+' ' + text;// + "\n";
	var host = '127.0.0.1';
	var txt = serverName +' : ' + text;
	
	// var logDirectory = __dirname + '/Logs/'+getDay(time)+'/';
	var logDirectory = LOG_PATH + getDay(time)+'/';
	// var logDirectory = '/tournaments/Logs/'+getDay(time)+'/';
	
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	var path = 'Full_message_';
	if (topic=='::') topic = 'Forever';
	if (topic) path = topic;
	logDirectory += path;
	// ensure log directory exists
	// console.log(txt);//logDirectory+':::::'+'\r\n'+
	fs.appendFile(logDirectory+'.txt', '\r\n' +time +' '+ txt, function (err) {//'Logs/Full_message_'
		if (err) {
			console.error('err: ' + JSON.stringify(err)); 
			//sendRequest('Log', {msg:txt + ' err: ' + JSON.stringify(err)}, host, 'site', null, printer);
			sendRequest('Log', {msg:txt + ' err: ' + JSON.stringify(err), topic:'Err'}, host, 'site', null, printer);
		}
		else{
			sendRequest('Log', {msg:txt, topic: topic?topic:null }, host, 'site', null, printer);
		}
	});

	//stream.write(text);
	//console.log('strLog: ' + text);
}

function getDay(date){
	var day = date.toLocaleDateString();
	day = day.replace('/','-');
	day = day.replace('/','-');

	//return date.toLocaleDateString().replace('/','-');
	return day;

	//return date.toLocaleDateString();
}

function Stats(topic, statObject){
	console.log('Stats:');
	console.log(topic);
	console.log(statObject);

	sendRequest(topic, statObject , 'localhost', 'Stats');//, null, null, null){
}


function printer(error, response, body) {
	if (!error) {
		/*console.log('printing:');
    	console.log(body);*/
		//var info = JSON.parse(JSON.stringify(body));
		//console.log(info);
	} else {
		console.error('Error happened: '+ error);
	}
}

function Proxy(error, response, body, res){
	Answer(res, body);
}

function Magic(res, method, options){
	return function (error, response, body) {
		    universalAnswer(error, response, body, res, method, options );
		};
}
function universalAnswer(error, response, body, res, method, options){//response is a response, which we get from request sender. res is a response
	//to the server, which called this server
	//someone requested this server. We try to send this request next for taking more detailed information. We get a 'response'.
	//We analyze this response and give an answer by the object 'res' in method 'method'
	if (!error) {
		//if (body) console.log(JSON.stringify(body));
		/*if (!body) {
			console.log('body is NULL!!!!');
		}*/
        //var info = JSON.parse(JSON.stringify(body));
        //console.log(info);
        if (method){
        	method(error, response, body || null, res || null);
        }
        /*console.log("Got answer from AccountServer");
        res.end("THX for register");*/
    }
    else {

        console.error('ERROR happened: \n'+ JSON.stringify(error) + '\n while options were: \n' + JSON.stringify(options),'Err');
    }
}

function Answer(res, JSONObject){
	if (res) res.end(JSON.stringify(JSONObject));
}

function initRequest(urlPath, curData, host, targetServer){
	port = getPort(targetServer);
	sendRequest(urlPath, curData, host, port, null, printer);
}

function expressSendRequest(urlPath, curData, host, targetServer, res, responseCallBack){
	port = getPort(targetServer);
	request({
		url: "http://" + host+':'+port+'/'+urlPath,
	    //url: "http://127.0.0.1:5009/ServeGames",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: curData
	}, Magic(res,responseCallBack));

}

function customSend(urlPath, curData, host, port, res, responseCallBack, method){
	//port = getPort(targetServer);
	// var url = "http://" + host+':'+port+'/'+urlPath;
	// console.log(url);
	request({
		url: "http://" + host+':'+port+'/'+urlPath,
		// url: url,
	    method: method || "POST",
	    json: true,   // <--Very important!!!
	    body: curData
	}, Magic(res,responseCallBack));

}

function sendRequest(urlPath, curData, host, targetServer, res, responseCallBack, parameters){
	//response is a response, which we get from request sender. res is a response
	//to the server, which called this server
	//someone requested this server. We try to send this request next for taking more detailed information. We get a 'response'.
	//We analyze this response and give an answer by the object 'res' in method 'method'
	/*console.log('Sending :');
	console.log(curData);*/

	//application/x-www-form-urlencoded
	//host = "localhost";
	port = getPort(targetServer);
	var url = "http://" + host+':'+port+'/'+urlPath;

	var options = {
		url: url,
		method: 'POST',
		json: curData,
		headers: {
			'Content-Type': 'application/json'
			//'Content-Length': Buffer.byteLength(curData)
		}
	};
	var options2 = {
		url: url,
		method: 'POST',
		json: curData,
		headers: {
			'Content-Type': 'application/json'
			//'Content-Length': Buffer.byteLength(curData)
		},
		serverName: serverName
	};

	/*var req = http.request(options, responseCallBack);

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});*/
	
	request(options, Magic(res,responseCallBack, options2));

	//req.write(curData);
	//request.end();
}

module.exports = {
	sendRequest,
	expressSendRequest,
	printer,
	Answer,
	Proxy,
	strLog,
	getPort,
	setServer,
	Stats,
	customSend,
	getLogs,
	getLogFile,
	getDay
};
