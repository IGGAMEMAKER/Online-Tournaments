var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "TournamentManager"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/ServeTournament"] = ServeTournament;
funcArray["/StartTournament"] = StartTournament;




/*funcArray["/DeleteTournament"] = DeleteTournament;
funcArray["/PauseTournament"] = PauseTournament;
funcArray["/AbortTournament"] = AbortTournament;*/


/*
round1: {
			R: 1,
			players: 10,
			nextRound: 5
		}
		round2: {
			R: 2,
			players: 5,
			nextRound: 2
		}

*/

/*
var tournament1 = {
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	winners: 2,
	minPlayersPerGame: 2,
	maxPlayersPerGame: 3,
	lucky:1,
	structure: {
		rounds: 1,
		goNext: [10, 2],
		//winners per whole round
		round1:{
			subRound1:{
				ID:1,
				players: 3,
				games: 3,
				winners: 3
			},
			subRound2:{
				ID:2,
				players: 2,
				games: 2,
				winners: 2
			}
		}
	}

	//structure: {
	//	rounds: 2,
	//	goNext: [10, 5, 2]
	//}
};
var tournament2 = {
	ID: 2,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 100,
	structure: {}
};
var tourns1 = {
	t1: tournament1,
	t2: tournament2
};*/
var curTournamentID=0;

function GetGameFrontendAdress(gameNameId){
	console.log("rewrite TournamentManager.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 5008
	};
	return adress;
}
function SendTournamentHandler( error, response, body, res) {
	console.log("Answer from GameServer comes here!!!");
	res.end('OK');
    //    res.end("GameServed");
}
//SendTournament(tournament1);
function SendTournament(tournament){
	//JSON.stringify(tournament)
	//queryProcessor.getPort('GameFrontendServer')
	console.log("Sending Tournament...");
	//console.log(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);
	//sender.sendRequest("ServeTournament",)
	
	sender.sendRequest("ServeTournament", tournament, adress['IP'], adress['port'], null, SendTournamentHandler);//sender.printer
	/*	function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
		    });
		}
	);*/
}

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write.
//you can get the object from POST request by typing data['parameterName'].
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function ServeTournament (data, res){
	console.log("ServeTournament " + data['tournamentID']);//['tournamentStructure']);
	
	console.log("Sending Tournament...");
	var tournament = data;
	tournament.ID = curTournamentID++;
	//console.log(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);

	sender.sendRequest("ServeTournament", tournament, adress['IP'], adress['port'], res, SendTournamentHandler);//sender.printer
	
	//SendTournament(data);
	
	//res.end("ServeTournament");
}


function StartTournament (data, res){
	console.log("StartTournament " + data['tournamentID']);//['tournamentStructure']);
	sender.sendRequest("StartTournament", data, '127.0.0.1', queryProcessor.getPort('GameFrontendServer'), null, sender.printer);//sender.printer
	res.end("StartTournament");
}


server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
