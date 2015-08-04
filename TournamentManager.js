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
var tournament1 = {
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	winners: 2,

	structure: {
		rounds: 2,
		goNext: [10, 5, 2]
	}
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
};
var currTournaments = JSON.stringify({
	tournaments: tourns1
});
console.log(qs.stringify(tournament1));
console.log("**************");
console.log(JSON.stringify(tournament1));
SendTournament(tournament1);

function GetGameFrontendAdress(gameNameId){
	console.log("rewrite TournamentManager.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 5008
	};
	return adress;
}

function SendTournament(tournament){
	//JSON.stringify(tournament)
	//queryProcessor.getPort('GameFrontendServer')
	console.log(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);
	sender.sendRequest("ServeTournament", JSON.stringify(tournament), adress['IP'], adress['port'], //sender.printer
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				
				///analyse and return answer to client-bot
				//var post = JSON.parse("" + chunk);

		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}/**/
	);
}

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write.
//you can get the object from POST request by typing data['parameterName'].
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function ServeTournament (data, res){
	console.log("ServeTournament " + data['tournamentID']);//['tournamentStructure']);
	
	
	res.end("ServeTournament");
}
function StartTournament (data, res){
	console.log("StartTournament " + data['ID']);//['tournamentStructure']);
	
	res.end("StartTournament");
}


server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
