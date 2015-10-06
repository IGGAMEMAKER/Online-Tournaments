var serverName = "FrontendServer";
var sender = require('./requestSender');
sender.setServer(serverName);
var Answer = sender.Answer;

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var strLog = sender.strLog;
var sitePort = 80;
/*process.argv.forEach(function (val, index, array) {
  strLog(index + ': ' + val);
});*/
app.use(function(req,res,next){
    strLog(serverName + ': Request!');
    next();
});

function strLog(data){
	strLog(data);
}

//["/stop"] //'/stop' : AnswerAndKill

app.get('/Alive', function (req, res){
	strLog(data);
	Answer(res, {result:'OK'});
});

app.post('/Register', function (req, res){
	var data = req.body;
	sender.sendRequest("Register", data, '127.0.0.1', 'DBServer',  res, 
		function ( error, response, body, res) {
		strLog("Got answer from DBServer");
		Answer(res, body);
	});
	//strLog(data);
	//Answer(res, {result:'OK'});
});

app.post('/FinishGame', FinishGame);
app.post('/StartTournament', StartTournament);
app.post('/AddGift', AddGift);

app.post('/Login', function (req, res){
	var data = req.body;
	strLog(data);
	sender.expressSendRequest("Login", data, '127.0.0.1', 'DBServer', res, 
		function (error, response, body, res){
			Answer(res, body);
		});
});

app.post('/ServeTournament', ServeTournament);

///********************** 	TournamentManager
function GetGameFrontendAdress(gameNameId){
	strLog("rewrite FS.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 'GameFrontendServer'
	};
	return adress;
}
function SendTournamentHandler( error, response, body, res) {
	strLog("Answer from GameServer comes here!!!");
	Answer(res, {result:'OK'});
	//res.end('OK');
}

function getTournamentStructure( tournament){
	return tournament;
}

function ServeTournament (req, res){
	var data = req.body;
	strLog("ServeTournament ")
	//strLog(JSON.stringify(data));//['tournamentStructure']);
	
	//strLog("Sending Tournament...");
	var tournament = data;
	var adress = GetGameFrontendAdress(tournament.gameNameID);

	sender.sendRequest("ServeTournament", getTournamentStructure(tournament), 
		adress['IP'], adress['port'], res, SendTournamentHandler);
}

///**********************




function Login( data, res){
	strLog('FrontendServer login:');
	strLog(data);
	sender.sendRequest("Login", data, '127.0.0.1', 'DBServer', res, LoginHandler);
}
function LoginHandler( error, response, body, res){
	strLog('LoginHandler call');
	Answer(res, body);
}

/*funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;*/
app.post('/GetUserProfileInfo', GetUserProfileInfo);

app.post('/GetTournaments', function (req, res){
	var data = req.body;
	//strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	strLog('Getting Tournaments: ' + JSON.stringify(obj) );
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, 
		function ( error, response, body, res ){
		Answer(res, body);
	});
});

app.post('/GetUsers', function (req, res){
	var data = req.body;
	//strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
	};
	sender.sendRequest("GetUsers", obj, '127.0.0.1', 'DBServer', res, function ( error, response, body, res ){
		Answer(res, body);
	});
});


app.post('/RegisterUserInTournament', RegisterUserInTournament);
app.post('/CancelRegister', CancelRegister);


app.post('/AddTournament', AddTournament);

app.post('/ShowGifts', ShowGifts);
/*funcArray["/WakeUsers"] = WakeUsers;
funcArray["/UnregisterFromTournament"] = UnregisterFromTournament;

funcArray["/Cashout"] = Cashout;
funcArray["/Deposit"] = Deposit;


funcArray["/SendMessagesToUsers"] = SendMessagesToUsers;*/


var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});

var user1 = {
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };

function Alive(data, res){
	strLog(data);
	Answer(res, {result:'OK'});
}
var Fail = { result:'fail'};

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //


var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;

function ShowGifts(req, res){
	sender.sendRequest('ShowGifts', req.body,'127.0.0.1', 'DBServer', res, stdHandler )
}

function AddTournament(req, res){
	var data = req.body;
	
	if (data){
		strLog('Incoming tournament : ' +JSON.stringify(data));
		var buyIn = parseInt(data.buyIn);
		var rounds = parseInt(data.rounds);
		var gameNameID = parseInt(data.gameNameID);
		var GoNext = data.goNext?data.goNext.split(" ") : [];
		var Prizes = data.Prizes.split(" ");
		var prizes = [];
		var goNext = [];
		strLog(JSON.stringify(Prizes));
		//convert array of strings to array of objects
		for (var i = 0; i < Prizes.length - 1; i++) {
			if (isNaN(Prizes[i]) ){
				if (Prizes[i].length>0){
					prizes.push({giftID:Prizes[i]})
				}
				else{
					strLog('Prize[i] is null. Current prize is: ' + Prizes[i]);
					Answer(res, Fail);
					return;
				}
			}
			else{
				prizes.push( parseInt(Prizes[i]) );
			}
		};

		for (var i=0; i< GoNext.length - 1; ++i){
			var num = parseInt(GoNext[i]);
			if (isNaN(num)){
				strLog('goNext num parseInt error! ');
				strLog(GoNext);
				Answer(res, Fail);
				return;
			}
			else{
				goNext.push( num );
			}
		}

		strLog('splitted prizes: ' + JSON.stringify(prizes) );
		strLog('goNext.length:' + goNext.length);
		strLog(JSON.stringify(goNext));
		//strLog('')
		if (buyIn>=0 && rounds && gameNameID){
			var obj = {
				buyIn: 			buyIn,
				initFund: 		0,
				gameNameID: 	gameNameID,

				pricingType: 	PRICE_NO_EXTRA_FUND,

				rounds: 		rounds,
				goNext: 		goNext.length>0 ? goNext : [2,1],//
						places: 		[1],
					Prizes: 		prizes.length>0 ? prizes: [{giftID:'5609b7988b659cb7194c78c6'}],
						prizePools: 	[1],

				comment: 		'Yo',
				
				playersCountStatus: COUNT_FIXED,///Fixed or float
					startDate: 		null,
					status: 		null,	
					players: 		0
			}
			//sender.sendRequest('ServeTournament', obj, '127.0.0.1', 'BalanceServer', res, AddTournamentHandler);
			sender.sendRequest('AddTournament', obj, '127.0.0.1', 'DBServer', res, AddTournamentHandler);
		}
		else{
			strLog('buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID);
			Answer(res, Fail);
		}
	}
	else{
		Answer(res, Fail);
	}

}

function stdHandler(error, response, body, res){
	Answer(res, body);
}

function AddTournamentHandler(error, response, body, res){
	Answer(res, body);
}

function AddGift(req, res){
	var data = req.body;
	if (data){
		sender.sendRequest('AddGift', data, '127.0.0.1', 'DBServer', res, stdHandler);
	}
	else{
		Answer(res, Fail);
	}
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
	Answer(res, body);
}

function StartTournament (req, res){
	var data = req.body;

	sender.sendRequest("StartTournament", data, '127.0.0.1', 'site', null, sender.printer);
	strLog("StartTournament " + data['tournamentID']);//['tournamentStructure']);

	sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
	res.end("StartTournament");
}

function GetUserProfileInfo(req , res){
	var data = req.body;
	strLog(data);
	sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', 'DBServer', res, GetUserProfileInfoHandler);
}
function GetUserProfileInfoHandler ( error, response, body, res){
	strLog('GetUserProfileInfoHandler :' + JSON.stringify(body));
	Answer(res, body);
}

function ChangePassword( data, res){
	res.end("OK");
	strLog("You must send changePass to Account Server");
}
function FinishGame(req, res){
	var data = req.body;
	Answer(res, {result:'OK', message:'FinishGame'});
	sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}

function GetTournaments( data, res){
	strLog('FS ' + JSON.stringify(data));

	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
		purpose: 'watch'
	};
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, GetTournamentsHandler);
}


function GetTournServerIP(tournamentID){
	return '127.0.0.1';
}

function CancelRegister(req, res){
	var data = req.body;
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		login: data['login']
	};

	sender.sendRequest("CancelRegister", obj, 
		'127.0.0.1', 'TournamentServer', res, function (p1,p2,body,p4) { Answer(res, body); } );
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
	strLog("Checking Data taking: " + JSON.stringify(body));
	Answer(res, body);
}

function RememberPassword( data, res){
	res.end("Try to remember");
	strLog("You must send rememberPass to Account Server");
}

function log(str){ strLog(str);}