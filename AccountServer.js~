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
var cars = ["Saab", "Volvo", "BMW"]; cars.push("LADADADADADA");
/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/

var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill
funcArray["/Register"] = RegisterUser;
funcArray["/Login"] = LoginUser;
/*funcArray["/GetUserProfile"] = GetUserProfile;
funcArray["/Ban"] = Ban;*/
funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;

/*var loginSuccess = qs.stringify({
	result: 'success'
});

var loginFail = qs.stringify({
	result: 'fail'
});*/

var Success = qs.stringify({
	result: 'success'
});

var Fail = qs.stringify({
	result: 'fail'
});


function ChangePassword(data, res){
	console.log("check current auth");
	console.log("ChangePass of User " + data['login']);
	res.end(Fail);
}

function RememberPassword(data, res){
	console.log("Send mail and reset pass");
	console.log("Remember pass of User " + data['login']);
	res.end(Fail);
}


function RegisterUser(data, res){
	console.log("Registering User " + data['login']);
	res.end("Registered!!!");
}
function LoginUser( data, res){
	res.end(loginSuccess);
}
server.SetServer(serverName, '127.0.0.1', funcArray);
