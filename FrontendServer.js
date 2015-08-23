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
funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;

funcArray["/GetTournaments"] = GetTournaments;
funcArray["/RegisterUserInTournament"] = RegisterUserInTournament;


/*funcArray["/WakeUsers"] = WakeUsers;
funcArray["/UnregisterFromTournament"] = UnregisterFromTournament;*/

/*funcArray["/Cashout"] = Cashout;
funcArray["/Deposit"] = Deposit;


funcArray["/SendMessagesToUsers"] = SendMessagesToUsers;*/



/*var tournament2 = {};
tournament*/


var user1 = {
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };

function GetUserProfileInfo(data , res){
	console.log(data);
	sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', queryProcessor.getPort('DBServer'), res, GetUserProfileInfoHandler);
}
function GetUserProfileInfoHandler ( error, response, body, res){
	sender.Answer(res, body);
}

function ChangePassword( data, res){
	res.end("OK");
	console.log("You must send changePass to Account Server");
}

function get(str, parameter){
	return JSON.stringify(str[parameter]);
}
function get2(str, par, par2){
	return JSON.stringify(str[par][par2]);
}
function get3(str, par, par2, par3){
	return JSON.stringify(str[par][par2][par3]);
}

function GetTournaments( data, res){
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID']
	};
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', queryProcessor.getPort('DBServer'), res, GetTournamentsHandler);
}

function GetTournamentsHandler( error, response, body, res ){
	//console.log("Checking Data taking: " + get2(body, 'tournaments', 't1'));
	sender.Answer(res, body);
	//res.end(get(body,'tournaments'));
}

function GetTournServerIP(tournamentID){
	return '127.0.0.1';
}
function RegisterUserInTournament( data, res){
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		userID: data['userID']
	};
	//log(data);
	log("Trying to register in tournament " + data['tournamentID']);
	sender.sendRequest("RegisterUserInTournament", obj, 
		'127.0.0.1', queryProcessor.getPort('TournamentServer'), res, RegisterUserInTournamentHandler);
}
function RegisterUserInTournamentHandler(error, response, body, res){
	console.log("Checking Data taking: " + body['result']);
	if (body['result'] === 'success'){
		res.end("You are Registered in tournament!!");
	}
	else{
		res.end("Tournament Register error:" + body['result']);
	}
}

function RememberPassword( data, res){
	res.end("Try to remember");
	console.log("You must send rememberPass to Account Server");
}
function log(str){ console.log(str);}
function Login( data, res){
	sender.sendRequest("Login", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), res, LoginHandler);
}
function LoginHandler( error, response, body, res){
	if (body['result'] === 'success'){
		res.end("You are logged in!!");
	}
	else{
		res.end("Login or password are invalid");
	}
}

function RegisterUserHandler( error, response, body, res) {
	console.log("Got answer from DBServer");
	sender.Answer(res, body);
        //res.end("THX for register");
}
function RegisterUser( data, res){
	//console.log("Port=" + queryProcessor.getPort('AccountServer'));
	//console.log("FrontendServer tries to register user");
	sender.sendRequest("Register", data, '127.0.0.1', queryProcessor.getPort('DBServer'),  res, RegisterUserHandler );
}






server.SetServer(serverName, '127.0.0.1', funcArray);
