var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script'); //var server = new http.Server();

var serverName = "AccountServer"; //console.log(queryProcessor.getOwnPropertyNames());

var user1 = qs.stringify({
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/

var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill
funcArray["/register"] = RegisterUser;

var cars = ["Saab", "Volvo", "BMW"]; cars.push("LADADADADADA");


function RegisterUser(data, res){
	console.log("Registering User " + data['login']);
	res.end("Registered!!!");
}

server.SetServer(serverName, '127.0.0.1', funcArray);
