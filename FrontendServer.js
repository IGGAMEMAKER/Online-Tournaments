//var startServer = require('./script');

var http = require('http');
var url = require('url');
var queryProcessor = require('./test');

var server = new http.Server();
var serverName = "FrontendServer";
//console.log(queryProcessor.getOwnPropertyNames());

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var port = queryProcessor.getPort(serverName);
console.log("Port " + port);
console.log(queryProcessor.area(5));
server.listen(port, '127.0.0.1');

server.on('request', function(req,res) {
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
});

