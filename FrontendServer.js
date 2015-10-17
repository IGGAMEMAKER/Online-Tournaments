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
    strLog('REQUEST!!!  :  ' + req.url);
    next();
});

app.post('/Register', function (req, res){
	var data = req.body;
	sender.sendRequest("Register", data, '127.0.0.1', 'DBServer',  res, proxy);
});

app.post('/FinishGame', FinishGame);
app.post('/StartTournament', StartTournament);
app.post('/StopTournament', StopTournament);

app.post('/GetUserProfileInfo', GetUserProfileInfo);
app.post('/RegisterUserInTournament', RegisterUserInTournament);
app.post('/CancelRegister', CancelRegister);


app.post('/AddTournament', AddTournament);
app.post('/ServeTournament', ServeTournament);

app.post('/ShowGifts', ShowGifts);


app.post('/Login', function (req, res){
	var data = req.body;
	strLog(data);
	sender.expressSendRequest("Login", data, '127.0.0.1', 'DBServer', res, proxy);
});


///********************** 	TournamentManager
function GetGameFrontendAdress(gameNameId){
	strLog("rewrite FS.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 'GameFrontendServer'
	};
	return adress;
}
function SendTournamentHandler( error, response, body, res) { //this code is used :) delete it if you KNOW, what are you doing
	strLog("SendTournamentHandler THIS METHOD WORKS", 'WARN');
	Answer(res, {result:'OK'});
	//res.end('OK');
}

function getTournamentStructure( tournament){
	return tournament;
}

function ServeTournament (req, res){
	var data = req.body;
	strLog("ServeTournament ... FS ", 'WARN')
	//strLog(JSON.stringify(data));//['tournamentStructure']);
	
	//strLog("Sending Tournament...");
	var tournament = data;
	var adress = GetGameFrontendAdress(tournament.gameNameID);

	sender.sendRequest("ServeTournament", getTournamentStructure(tournament), 
		adress['IP'], adress['port'], res, SendTournamentHandler);
}

///**********************



app.post('/GetTournaments', function (req, res){//DON'T MODIFY OBJ!!
	var data = req.body;
	//strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
		purpose: data['purpose']||null
	};
	strLog('Getting Tournaments: ' + JSON.stringify(obj) , 'WARN');
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, proxy);
});

app.post('/GetUsers', function (req, res){
	var data = req.body;
	sender.sendRequest("GetUsers", data, '127.0.0.1', 'DBServer', res, proxy);
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});


var Fail = { result:'fail'};

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
	var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //


	var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;

function ShowGifts(req, res){
	sender.sendRequest('ShowGifts', {},'127.0.0.1', 'DBServer', res, proxy )
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
			//sender.sendRequest('ServeTournament', obj, '127.0.0.1', 'BalanceServer', res, proxy);
			sender.sendRequest('AddTournament', obj, '127.0.0.1', 'DBServer', res, proxy);
		}
		else{
			strLog('Invalid data comming while adding tournament: buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID, 'WARN');
			Answer(res, Fail);
		}
	}
	else{
		Answer(res, Fail);
	}

}

function proxy(error, response, body, res){
	Answer(res, body);
}

function StartTournament (req, res){
	var data = req.body;
	//strLog('StartTournament')
	sender.sendRequest("StartTournament", data, '127.0.0.1', 'site', null, sender.printer);
	strLog("StartTournament " + data['tournamentID']);//['tournamentStructure']);

	sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
	res.end("StartTournament");
}

function StopTournament (req, res){
	strLog('FrontendServer StopTournament :::'+req.body.tournamentID, 'Manual');
	sender.sendRequest("StopTournament", {tournamentID:req.body.tournamentID}, '127.0.0.1', 'GameFrontendServer', res, sender.Proxy);

}


function GetUserProfileInfo(req , res){
	var data = req.body;
	strLog(data);
	sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', 'DBServer', res, proxy);
}

function FinishGame(req, res){
	var data = req.body;
	Answer(res, {result:'OK', message:'FinishGame'});
	sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}

function CancelRegister(req, res){
	var data = req.body;
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		login: data['login']
	};

	sender.sendRequest("CancelRegister", obj, 
		'127.0.0.1', 'TournamentServer', res, proxy );
}

function RegisterUserInTournament( req, res){
	var data = req.body;
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		login: data['login']
	};
	strLog("Trying to register in tournament " + data['tournamentID']);
	sender.sendRequest("RegisterUserInTournament", obj, '127.0.0.1', 'TournamentServer', res, proxy);
}



function RememberPassword( data, res){
	res.end("Try to remember");
	strLog("You must send rememberPass to Account Server");
}

function ChangePassword( data, res){
	res.end("OK");
	strLog("You must send changePass to Account Server");
}