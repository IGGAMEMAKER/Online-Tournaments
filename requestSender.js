var http = require('http');
var request = require('request');

this.sendRequest = sendRequest;
//this.sendRequest1 = sendRequest1;
this.printer = printer;
this.Answer = Answer;
this.Proxy = Proxy;

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

/*function sendRequest(urlPath, options, curData, responseCallBack){
	
}*/

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
    	console.log(body);

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

function initRequest(urlPath, curData, host, port){
	sendRequest(urlPath, curData, host, port, null, printer);
}

function sendRequest(urlPath, curData, host, port, res, responseCallBack){
	//response is a response, which we get from request sender. res is a response
	//to the server, which called this server
	//someone requested this server. We try to send this request next for taking more detailed information. We get a 'response'.
	//We analyze this response and give an answer by the object 'res' in method 'method'


	//application/x-www-form-urlencoded
	//host = "localhost";
	var url = "http://" + host+':'+port+'/'+urlPath;
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
        console.log(info);
    }
    else {
        console.log('Error happened: '+ error);
    }
    //response.end();
}