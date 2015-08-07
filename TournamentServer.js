var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "TournamentServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/RegisterUserInTournament"] = RegisterUserInTournament; //start all comands with '/'. IT's a URL to serve
var tournament1 = {
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
};
console.log(tournament1);
var tournaments = new Object();
initTournaments();
showTournaments();
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
	sender.Answer(res,Success);
//	console.log("AddPlayerToTournament(); WRITE THIS CODE!!");
	AddPlayerToTournament(data['tournamentID']);
}
function AddPlayerToTournament(tournamentID){
	if (tournaments[tournamentID].playerTotalCount> tournaments[tournamentID].playersRegistered){
		tournaments[tournamentID].playersRegistered++;
	}
	else{
		console.log("Sorry, tournament os Full");
	}
	if (tournaments[tournamentID].playerTotalCount === tournaments[tournamentID].playersRegistered){
		console.log("Tournament " + tournamentID + " starts");
	}
}

var timerId = setInterval(function() {
  if (tournaments[2].playerTotalCount === tournaments[2].playersRegistered){
	console.log("Tournament " + 2 + " starts");	
  }
  else{
 	//console.log("Registered in 2: " + tournaments[2].playersRegistered);
	console.log("Registered :" +tournaments[2].playersRegistered +" / " + tournaments[2].playerTotalCount);
  }
}, 2000);

var Success = {
	result: 'success'
};

var Fail = {
	result: 'fail'
};


server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
