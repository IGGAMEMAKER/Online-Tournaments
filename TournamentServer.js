var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "TournamentServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/RegisterUserInTournament"] = RegisterUserInTournament; //start all comands with '/'. IT's a URL to serve
funcArray["/ServeTournament"] = ServeTournament;

/*var tournament1 = {
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	structure: {
		round1:5,
		round2:2,
		round3:1
	},
	playersRegistered:0
};
var tournament2 = {
	ID: 2,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	playersRegistered:0,
	structure: {}
};*/
//console.log(tournament1);
var tournaments = {
	count:0
}
//initTournaments();
//showTournaments();
function initTournaments(){
	
	tournaments[tournament1.ID]= tournament1;
	tournaments[tournament2.ID]= tournament2;
}
function showTournaments(){
	console.log(tournaments[1]);
	console.log(tournaments[2]);
}

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH sender.Answer(res,();
function RegisterUserInTournament (data, res){
	//console.log("Sender = " + data['sender']);
	console.log("Registering in tournament: " + data['tournamentID']);
	var tournamentID = data['tournamentID'];
	var userID = data['userID'];
//	console.log("AddPlayerToTournament(); WRITE THIS CODE!!");
	AddPlayerToTournament(tournamentID, userID,res);
}

function ServeTournament (data, res){
	var tournamentID = data['tournamentID'];
	console.log('TS tries to serve:' + tournamentID);
	//console.log(data);
	tournaments[tournamentID] = data;
	tournaments[tournamentID].players = [];
	tournaments[tournamentID].playersRegistered=0;

	sender.sendRequest("ServeTournament", data, '127.0.0.1', queryProcessor.getPort('TournamentManager'), res, ServeTournamentTMProxy );
}
function ServeTournamentTMProxy ( error, response, body, res){


	sender.Answer(res, body);
}

function AddPlayerToTournament(tournamentID, userID, res){
	var tournament = tournaments[tournamentID];

	if (tournament.playerTotalCount> tournament.playersRegistered){
		if (tournament.players[userID]){
			console.log('User ' + userID + ' is already Registered in ' + tournamentID)
			sender.Answer(res,Fail);
		}
		else{
			tournament.playersRegistered++;
			/*console.log(tournaments[tournamentID].playersRegistered);
			console.log(tournament.playersRegistered);*/
			tournament.players.push(userID);
			sender.Answer(res,Success);
			console.log('User ' + userID + ' added to tournament ' + tournamentID+' || ('+ tournament.playersRegistered+'/'+tournament.playerTotalCount+')');
			if (tournament.playerTotalCount === tournament.playersRegistered){
				console.log("Tournament " + tournamentID + " starts");
				console.log(tournament.players);
				sender.sendRequest("StartTournament", {sender:'TournamentServer', tournamentID:tournamentID, userIDs:tournament.players}, 
					'127.0.0.1', queryProcessor.getPort('TournamentManager'), null, sender.printer );
				//sender.Answer(res,Success);
			}
		}
	}
	else{
		console.log("Sorry, tournament is Full:"+ tournament.playerTotalCount+'/'+tournament.playersRegistered);
		sender.Answer(res,Fail);
	}
	
}


////TIMERS!!!!
/*var timerId = setInterval(function() {
  if (tournaments[2].playerTotalCount === tournaments[2].playersRegistered){
	console.log("Tournament " + 2 + " starts");	
  }
  else{
 	//console.log("Registered in 2: " + tournaments[2].playersRegistered);
	console.log("Registered :" +tournaments[2].playersRegistered +" / " + tournaments[2].playerTotalCount);
  }
}, 2000);*/

var Success = {
	result: 'success'
};

var Fail = {
	result: 'fail'
};


server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
