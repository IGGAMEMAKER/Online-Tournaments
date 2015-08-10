//var http = require('http');
//var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
//var qs = require('querystring');
var server = require('./script');

var serverName = "BalanceServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/register"] = DefaultFunction; //start all comands with '/'. IT's a URL to serve
funcArray["/FreeTournamentServerIP"] = FreeTournamentServerIP;
funcArray["/ServeTournament"] = ServeTournament;

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function DefaultFunction (data, res){
	console.log("DefaultFunction " + data['login']);
	res.end("DefaultFunction!!!");
}
console.log(undefined>=1);

function ServeTournament (data, res){
	console.log('income tournament');
	console.log(JSON.stringify(data));
	var tournament = data;
	tournament['sender'] = 'BalanceServer';

	sender.sendRequest("AddTournament", tournament, '127.0.0.1', queryProcessor.getPort('DBServer'),  res, DBAddTournamentHandler );
}
function DBAddTournamentHandler( error, response, body, res){
	var tournamentID = body['tournamentID'];
	var tournament = body;
	console.log("added tournament " + tournamentID + " to DB");
	if (tournamentID>0){
		sender.sendRequest("ServeTournament", tournament, GetFreeTournamentServerIP(tournament.structure), 
			queryProcessor.getPort('TournamentServer'),  res, ServeTournamentHandler );
	}
	else{
		res.end(error+ " adding to DB Failed");
	}
	//console.log(body);
}

function ServeTournamentHandler( error, response, body, res){
	console.log('if all is OK (ServeTournamentHandler.BalanceServer)');
	var answer = {
		message:'tournament adding COMPLETED',
		status:'OK'
	}
	sender.Answer(res, answer);
	//res.end('');
}

function FreeTournamentServerIP(data, res){
	//sender.sendRequest("Register", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'),  res, RegisterUserHandler );

	res.end(GetFreeTournamentServerIP(null));
}

function GetFreeTournamentServerIP(tournamentStructure){
	console.log("analyze tournamentStructure and TS IP will be localhost");
	return '127.0.0.1';
}

server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
