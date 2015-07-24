//var data = {val1:"hello", val2:{val3:"world"}};
//var dataS = JSON.stringify(data);   // stringify from object

/*$.ajax({
        url:"127.0.0.1:5000",
        type:"POST",
        data:dataS,       //using dataType String
        success:function (res)
        {
             resHandler(res);
        }
});
console.log(dataS);*/
//    { form: { key: 'value' } }
//var request = require('request');
//dataString
/*request.post(
    'http://127.0.0.1:5000',
    form: {user: 'userValue'},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body + "Pew!")
        }
    }
);*/
/*
request.post({url:'http://127.0.0.1:5000', form: {key:'value'}}, function(err,httpResponse,body){             console.log(body + "Pew!") })*/
sender = require('./requestSender');

var querystring = require('querystring');
var http = require('http');

var user2 = querystring.stringify({
      login: 'Raja',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

var user1 = querystring.stringify({
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

var options = {
    host: '127.0.0.1',
    port: 5000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(user2)
    }
};

var b = "";

//sendRequest("start", options, b);///urlPath, curData, host, port, responseCallBack
sender.sendRequest("register", user1, '127.0.0.1', 5000, sender.printer);
//sendRequest("signIn", options);
//sendRequest("", options);
/*function sendRequest(urlPath, options, curData){
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
	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		console.log("body: " + chunk);
	    });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.write(curData);
	req.end();
}*/
