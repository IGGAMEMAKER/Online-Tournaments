var serverName = "FrontendServer";
var sender = require('./requestSender');

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var sitePort = 80;
/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/

function strLog(data){
	console.log(data);
}

var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill

//funcArray['/Alive'] = Alive;
app.get('/Alive', function (req, res){
	strLog(data);
	sender.Answer(res, {result:'OK'});
});

//funcArray["/Register"] = RegisterUser;
app.post('/Register', function (req, res){
	var data = req.body;
	sender.sendRequest("Register", data, '127.0.0.1', 'DBServer',  res, 
		function ( error, response, body, res) {
		strLog("Got answer from DBServer");
		sender.Answer(res, body);
	});
	//strLog(data);
	//sender.Answer(res, {result:'OK'});
});

//funcArray["/Login"] = Login;
app.post('/Login', function (req, res){
	var data = req.body;
	console.log(data);
	sender.expressSendRequest("Login", data, '127.0.0.1', 'DBServer', res, 
		function (error, response, body, res){
			sender.Answer(res, body);
		});
});


function Login( data, res){
	strLog('FrontendServer login:');
	strLog(data);
	sender.sendRequest("Login", data, '127.0.0.1', 'DBServer', res, LoginHandler);
}
function LoginHandler( error, response, body, res){
	strLog('LoginHandler call');
	sender.Answer(res, body);
}

/*funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;*/
funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;

app.post('/GetTournaments', function (req, res){
	var data = req.body;
	strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, 
		function ( error, response, body, res ){
		sender.Answer(res, body);
	});
});

//funcArray["/GetTournaments"] = GetTournaments;


//funcArray['/GetUsers'] = GetUsers;
app.post('/GetUsers', function (req, res){
	var data = req.body;
	strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	sender.sendRequest("GetUsers", obj, '127.0.0.1', 'DBServer', res, function ( error, response, body, res ){
		sender.Answer(res, body);
	});
});


//funcArray["/RegisterUserInTournament"] = RegisterUserInTournament;
app.post('/RegisterUserInTournament', RegisterUserInTournament);

//funcArray["/StartTournament"]=StartTournament;
app.post('/StartTournament', StartTournament);

/*funcArray["/WakeUsers"] = WakeUsers;
funcArray["/UnregisterFromTournament"] = UnregisterFromTournament;

funcArray["/Cashout"] = Cashout;
funcArray["/Deposit"] = Deposit;


funcArray["/SendMessagesToUsers"] = SendMessagesToUsers;*/


var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(serverName + ' is listening at http://%s:%s', host, port);
});

var user1 = {
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };

function Alive(data, res){
	strLog(data);
	sender.Answer(res, {result:'OK'});
	//res.json({result:'OK'});
	//res.end();
}

function GetUsers (data, res){
	//res.end('GetUsers OK');
	strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	sender.sendRequest("GetUsers", obj, '127.0.0.1', 'DBServer', res, GetUsersHandler);
}

function GetUsersHandler( error, response, body, res ){
	//strLog("Checking Data taking: " + get2(body, 'tournaments', 't1'));
	sender.Answer(res, body);
	//res.end(get(body,'tournaments'));
}

function StartTournament (req, res){
	var data = req.body;
	res.end('FrontendServer Starts Tournament!');
	strLog(data);
	sender.sendRequest("StartTournament", data, '127.0.0.1', 'site', null, sender.printer);
}

function GetUserProfileInfo(data , res){
	strLog(data);
	sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', 'DBServer', res, GetUserProfileInfoHandler);
}
function GetUserProfileInfoHandler ( error, response, body, res){
	sender.Answer(res, body);
}

function ChangePassword( data, res){
	res.end("OK");
	strLog("You must send changePass to Account Server");
}


function GetTournaments( data, res){
	strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, GetTournamentsHandler);
}


function GetTournServerIP(tournamentID){
	return '127.0.0.1';
}
function RegisterUserInTournament( req, res){
	var data = req.body;
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		login: data['login']
	};
	//log(data);
	log("Trying to register in tournament " + data['tournamentID']);
	sender.sendRequest("RegisterUserInTournament", obj, 
		'127.0.0.1', 'TournamentServer', res, RegisterUserInTournamentHandler);
}

function RegisterUserInTournamentHandler(error, response, body, res){
	strLog("Checking Data taking: " + body['result']);
	sender.Answer(res, body);
}

function RememberPassword( data, res){
	res.end("Try to remember");
	strLog("You must send rememberPass to Account Server");
}

function log(str){ strLog(str);}