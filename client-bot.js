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

var qs = require('querystring');
var http = require('http');

var user2 = qs.stringify({
      login: 'Raja',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

var user1 = qs.stringify({
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
var arr = {asd: 'old'}
var i = new Object();
i.Zi = 3;
//prt();
function setVal( res){
	i.Zi=10;
	//i=10;
	prt();
	/*i=10;
	for (var j=0;j<5;++j){
		console.log("WRITING "+ j + " : " + i);
	}*/
}
function prt(){
	console.log(i.Zi);
}

var regTournament = qs.stringify({
	tournamentID: 2
});

//sendRequest("start", options, b);///urlPath, curData, host, port, responseCallBack
/*sender.sendRequest("Register", user1, '127.0.0.1', 5000, sender.printer);
sender.sendRequest("Login", user1, '127.0.0.1', 5000, sender.printer);
sender.sendRequest("ChangePassword", user1, '127.0.0.1', 5000, sender.printer);
sender.sendRequest("RememberPassword", user1, '127.0.0.1', 5000, sender.printer);*/
sender.sendRequest("GetTournaments", user1,'127.0.0.1', 5000, sender.printer);//setVal);
//sender.sendRequest("RegisterInTournament", regTournament,'127.0.0.1', 5000, setVal);
/*var timerId = setInterval(function() {
  prt();
}, 2000);*/

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
