//var startServer = require('./script');

var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var server = require('./script'); //var server = new http.Server();
var serverName = "FrontendServer";
var qs = require('querystring');
var sender = require('./requestSender');

/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/
var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill

funcArray["/Register"] = RegisterUser;
funcArray["/Login"] = Login;
funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;
//funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;

funcArray["/GetTournaments"] = GetTournaments;
funcArray["/RegisterInTournament"] = RegisterInTournament;
/*funcArray["/WakeUsers"] = WakeUsers;
funcArray["/UnregisterFromTournament"] = UnregisterFromTournament;*/

/*funcArray["/Cashout"] = Cashout;
funcArray["/Deposit"] = Deposit;


funcArray["/SendMessagesToUsers"] = SendMessagesToUsers;*/

var tournament1 = qs.stringify({
	ID: 1,
	game: "SeaWar1",
	structure: {}
});



var user1 = qs.stringify({
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });



function ChangePassword( data, res){
	res.end("OK");
	console.log("You must send changePass to Account Server");
}

function GetTournaments( data, res){
	log(tournament1);
	res.end(tournament1);
}
function RegisterInTournament( data, res){
	log(tournament1);
	res.end(tournament1);
}

function RememberPassword( data, res){
	res.end("Try to remember");
	console.log("You must send rememberPass to Account Server");
}
function log(str){ console.log(str);}
function Login( data, res){
	sender.sendRequest("Login", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				var post = qs.parse(chunk);
				/*log(post);
				log("stringifying:" + JSON.stringify(post));
				log("Value: " + post['"result']);*/
				console.log("Checking Data taking: " + post['result']);
				if (post['result'] === 'success'){
					res.end("You are logged in!!");
				}
				else{
					res.end("Login or password are invalid");
				}
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);
}
function RegisterUser( data, res){
	//console.log("Port=" + queryProcessor.getPort('AccountServer'));
	sender.sendRequest("Register", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				console.log("Checking Data taking: " + data['password']);
				res.end("THX for register");
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);
}
server.SetServer(serverName, '127.0.0.1', funcArray);
