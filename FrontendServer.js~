//var startServer = require('./script');

var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var server = require('./script');
//var server = new http.Server();
var serverName = "FrontendServer";
//console.log(queryProcessor.getOwnPropertyNames());
var qs = require('querystring');
var sender = require('./requestSender');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill

funcArray["/register"] = RegisterUser;

var user1 = qs.stringify({
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

function RegisterUser(data, res){
	console.log("Port=" + queryProcessor.getPort('AccountServer'));
	sender.sendRequest("register", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				console.log("Checking Data taking: " + data['password']);
				res.end("THX for register");
		    });

		    /*req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			});*/
		}
	);
}
server.SetServer(serverName, '127.0.0.1', funcArray);

/*var port = queryProcessor.getPort(serverName);
console.log("Port " + port);
console.log(queryProcessor.area(5));*/
/*server.listen(port, '127.0.0.1');

/*server.on('request', function(req,res) {
	var cars = ["Saab", "Volvo", "BMW"];
	cars.push("LADADADADADA");
	res.setHeader('Content-Type', 'application/json');
	
	//res.write(JSON.stringify({ a: 1 }));
	var urlParsed = url.parse(req.url);
	console.log(urlParsed.query);
	
	res.write(JSON.stringify(cars));
	
	var command = urlParsed.pathname;

	switch(command){
		case '/start':
			queryProcessor.start(res, "Hola")
			//res.end("Hola");
			break;
		default:
			res.end("Chiao");
			break;	

	}
});*/

