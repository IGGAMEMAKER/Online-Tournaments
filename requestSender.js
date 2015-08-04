var http = require('http');
var request = require('request');

this.sendRequest = sendRequest;
//this.sendRequest1 = sendRequest1;
this.printer = printer;

function printer(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		console.log("body: " + chunk);
	    });
	};

/*function sendRequest(urlPath, options, curData, responseCallBack){
	
}*/
function sendRequest(urlPath, curData, host, port, responseCallBack){
	//application/x-www-form-urlencoded
	//host = "localhost";
	var url = "http://" + host+':'+port+'/'+urlPath;
	//url1 = "http://" + "127.0.0.1:5008/ServeTournament";
	console.log("*****");
	console.log("reqSender: Trying to send...");
	console.log(curData);
	console.log("request url = " + url);
	console.log("*****");
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

	request(options, callback);

	//req.write(curData);
	//request.end();
}
function callback(error, response, body) {
    if (!error) {
    	console.log('printing:');
    	console.log(body);
        var info = JSON.parse(JSON.stringify(body));
        console.log(info);
    }
    else {
        console.log('Error happened: '+ error);
    }
    //response.end();
}




/*
function sendRequest(urlPath, options, curData, responseCallBack){
	options.path = "/"+urlPath;
	if (curData !== null && curData !== undefined){
		options.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(curData)
	    	}
	}
	else{
		console.log('Data null ' + urlPath);
	}
	var req = http.request(options, printer);

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.write(curData);
	req.end();
}
function sendRequest1(urlPath, curData, host, port, responseCallBack){
	var options = {
		host: host,
		port: port,
		path: urlPath,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(curData)
		}};
	sendRequest(urlPath, options, curData, responseCallBack);
}*/
