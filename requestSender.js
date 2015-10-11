//var http = require('http');
var request = require('request');

this.sendRequest = sendRequest;
this.expressSendRequest = expressSendRequest;
this.printer = printer;
this.Answer = Answer;
this.Proxy = Proxy;
this.strLog = strLog;
this.getPort = getPort;
this.setServer = setServer;

var serverList = {};

var fs = require('fs');

serverList['LogServer'] = 3000;

serverList['FrontendServer'] = 5000;
serverList['TournamentServer'] = 5001;
//serverList['TournamentManager'] = 5002;
//serverList['AccountServer'] = 5003;
serverList['BalanceServer'] = 5004;
//serverList['AdminServer'] = 5005;
serverList['MoneyServer'] = 5006;
serverList['DBServer'] = 5007;

serverList['GameFrontendServer'] = 5008;
serverList['GameServer'] = 5009;

serverList['site'] = 80;

serverList['1']=5009;//Ping Pong
serverList['2']=5010;//Questions and Answers

//console.log(serverList['DBServer']);

var gameNameIDList = {};

gameNameIDList['1'] = 5009;
gameNameIDList['2'] = 5001;
gameNameIDList['3'] = 5002;
gameNameIDList['4'] = 5003;

var serverName;

function setServer(servName){
	serverName = servName;
}

function getPort (r){
	return serverList[r];
}

function getGamePort (r){
	return gameNameIDList[r];
}
function strLog(text){
	var time = new Date();
	//console.log(time);
	//var txt = time+' ' + text;// + "\n";
	var host = '127.0.0.1';
	var txt = serverName +' : ' + text;

	fs.appendFile('message.txt', '\r\n' + txt, function (err) {
		if (err) {
			console.log('err: ' + JSON.stringify(err)); 
			//sendRequest('Log', {msg:txt + ' err: ' + JSON.stringify(err)}, host, 'site', null, printer);
			sendRequest('Log', {msg:txt + ' err: ' + JSON.stringify(err)}, host, 'site', null, printer);
		}
		else{
			sendRequest('Log', {msg:txt}, host, 'site', null, printer);
		}
	});
	//stream.write(text);
	console.log('strLog: ' + text);
}

function printer(error, response, body) {
	if (!error) {
    	/*console.log('printing:');
    	console.log(body);*/
        //var info = JSON.parse(JSON.stringify(body));
        //console.log(info);
    }
    else {
        console.log('Error happened: '+ error);
    }
};

function Proxy(error, response, body, res){
	
}

function Magic(res, method){
	return function (error, response, body) {
		    universalAnswer(error, response, body, res, method );
		};
}
function universalAnswer(error, response, body, res, method){//response is a response, which we get from request sender. res is a response
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
        
        method(error, response, body, res);
        /*console.log("Got answer from AccountServer");
        res.end("THX for register");*/
    }
    else {
        console.log('Error happened: '+ error);
    }
}

function Answer(res, JSONObject){
	res.end(JSON.stringify(JSONObject));
}

function initRequest(urlPath, curData, host, servName){
	port = getPort(servName);
	sendRequest(urlPath, curData, host, port, null, printer);
}

function expressSendRequest(urlPath, curData, host, servName, res, responseCallBack){
	port = getPort(servName);
	request({
		url: "http://" + host+':'+port+'/'+urlPath,
	    //url: "http://127.0.0.1:5009/ServeGames",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: curData
	}, Magic(res,responseCallBack));

}

function sendRequest(urlPath, curData, host, servName, res, responseCallBack, parameters){
	//response is a response, which we get from request sender. res is a response
	//to the server, which called this server
	//someone requested this server. We try to send this request next for taking more detailed information. We get a 'response'.
	//We analyze this response and give an answer by the object 'res' in method 'method'
	/*console.log('Sending :');
	console.log(curData);*/

	//application/x-www-form-urlencoded
	//host = "localhost";
	port = getPort(servName);
	var url = "http://" + host+':'+port+'/'+urlPath;
	//console.log(url);
	//url1 = "http://" + "127.0.0.1:5008/ServeTournament";
	/*console.log("*****");
	console.log("reqSender: Trying to send...");
	console.log(JSON.stringify(curData));
	console.log("request url = " + url);
	console.log("*****");*/
		var options = {
		url: url,
		method: 'POST',
		json: curData,
		headers: {
			'Content-Type': 'application/json'
			//'Content-Length': Buffer.byteLength(curData)
		}};
	//options.path = "/"+urlPath;
	/*if (curData !== null && curData !== undefined){
		options.headers = {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(curData)
	    	}
	}
	else{
		console.log('Data null ' + urlPath);
	}*/
	//options.json = curData;
	/*var req = http.request(options, responseCallBack);

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});*/

	request(options, Magic(res,responseCallBack));//callback

	//req.write(curData);
	//request.end();
}
function callback(error, response, body) {
    if (!error) {
    	/*console.log('printing:');
    	console.log(body);*/
        var info = JSON.parse(JSON.stringify(body));
        //console.log(info);
    }
    else {
        console.log('Error happened: '+ error);
    }
    //response.end();
}