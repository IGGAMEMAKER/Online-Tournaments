var sender = require('./requestSender');
var sendRequest = sender.sendRequest;
var Answer = sender.Answer;

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var strLog = sender.strLog;
var serverName = "BalanceServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
app.use(function(req,res,next){
    strLog(serverName + ': Request!');
    next();
});

app.post('/FreeTournamentServerIP', FreeTournamentServerIP);
app.post('/ServeTournament', ServeTournament);
app.post('/RestartTournament', RestartTournament);
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function DefaultFunction (data, res){
	strLog("DefaultFunction " + data['login']);
	res.end("DefaultFunction!!!");
}
strLog(undefined>=1);

function ServeTournament (req, res){
	var data = req.body;
	strLog('income tournament');
	//strLog(JSON.stringify(data));
	var tournament = data;
	tournament['sender'] = 'BalanceServer';

	sendRequest("AddTournament", tournament, '127.0.0.1', 'DBServer',  res, DBAddTournamentHandler );
}
function RestartTournament (req, res){
	var data = req.body;
	if (data['tournamentID']){
		sendRequest("RestartTournament", data, '127.0.0.1', 'DBServer',  res, DBAddTournamentHandler );
	}
	else{
		Answer(res, {result:'error'});
	}
}

function processTournament(tournament){
	if (tournament && tournament.tournamentID && tournament.status==null){
		sendRequest("ServeTournament", tournament, GetFreeTournamentServerIP(tournament.goNext), 
			'TournamentServer',  null, function (error, response, body, res){
					strLog('ServeTournament body : ' + JSON.stringify(body));
					if (body.result=='OK'){
						sendRequest('EnableTournament', tournament, '127.0.0.1', 'DBServer', null, sender.printer);
					}
				} );
	}
}

const GET_TOURNAMENTS_USER = 1;
const GET_TOURNAMENTS_BALANCE = 2;
function CheckTournaments(){
	sendRequest('GetTournaments', {purpose:GET_TOURNAMENTS_BALANCE}, '127.0.0.1', 'DBServer', null, 
		function (error, response, body, res){
			for (var i = body.length - 1; i >= 0; i--) {
				var tournament = body[i];
				processTournament(tournament);
				
			};
		}
	);
}
var f = setTimeout(CheckTournaments, 3000);

function GetExecutor(req, res){
	var data = req.body;
}

function DBAddTournamentHandler( error, response, body, res){
	strLog('DBAddTournamentHandler');
	//var tournamentID = body['tournamentID'];
	if (body.result=='fail') {Answer(res, {result:'fail' }); return;}
	var tournament = body;

	strLog("added tournament to DB");
	//strLog(JSON.stringify(tournament));
	
	/*sendRequest("ServeTournament", tournament, GetFreeTournamentServerIP(tournament.goNext), 
			'TournamentServer',  res, ServeTournamentHandler );*/
}

function ServeTournamentHandler( error, response, body, res){
	if (body.result=='OK'){
		//sendRequest('EnableTournament', )
	}
	strLog('if all is OK (ServeTournamentHandler.BalanceServer)');
	var answer = {
		message:'tournament adding COMPLETED',
		status:'OK'
	}
	Answer(res, answer);
}

function FreeTournamentServerIP(req, res){
	var data = req.body;
	//sendRequest("Register", user1, '127.0.0.1', 'AccountServer',  res, RegisterUserHandler );

	res.end(GetFreeTournamentServerIP(null));
}

function GetFreeTournamentServerIP(tournamentStructure){
	strLog("analyze tournamentStructure and TS IP will be localhost");
	return '127.0.0.1';
}

/*var timer = setInterval(function(){


}, 5000);*/
var server = app.listen(5004, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
