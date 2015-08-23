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
funcArray["/FinishGame"] = FinishGame;

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
/*function initTournaments(){
	
	tournaments[tournament1.ID]= tournament1;
	tournaments[tournament2.ID]= tournament2;
}
function showTournaments(){
	console.log(tournaments[1]);
	console.log(tournaments[2]);
}*/

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH sender.Answer(res,();
function RegisterUserInTournament (data, res){
	//console.log("Sender = " + data['sender']);
	console.log("Registering in tournament: " + data['tournamentID']);
	var tournamentID = data['tournamentID'];
	var login = data['userID'];//data['login'];
//	console.log("AddPlayerToTournament(); WRITE THIS CODE!!");
	var tournament = tournaments[tournamentID];
	var maxPlayersInTournament = tournament.goNext[0];
	if (maxPlayersInTournament> tournament.playersRegistered){
		if (tournament.players[login]){
			console.log('User ' + login + ' is already Registered in ' + tournamentID)
			sender.Answer(res,Fail);
		}
		else{
			tournament.playersRegistered++;
			tournament.players.push(login);
			sender.Answer(res,Success);
			console.log('User ' + login + ' added to tournament ' + tournamentID+' || ('+ tournament.playersRegistered+'/'+maxPlayersInTournament+')');
			if (maxPlayersInTournament === tournament.playersRegistered){
				console.log("Tournament " + tournamentID + " starts");
				console.log(tournament.players);
				sender.sendRequest("StartTournament", {sender:'TournamentServer', tournamentID:tournamentID, logins:tournament.players}, 
					'127.0.0.1', queryProcessor.getPort('TournamentManager'), null, sender.printer );
				//sender.Answer(res,Success);
			}
		}
	}
	else{
		console.log("Sorry, tournament is Full:"+ maxPlayersInTournament+'/'+tournament.playersRegistered);
		sender.Answer(res,Fail);
	}

	/*if (userCanRegister(login, tournamentID)){
		//
			login is correct
			User has enough money

			Tournament still needs players

		
		register()
		if (tournamentCanStart(tournamentID))
	}*/



}

function FinishGame (data, res){
	console.log(data);
	var gameID = data['gameID'];
	var tournamentID = data['tournamentID'];
	var scores = data['scores'];
	
	console.log('******************* game Finishes *********' + gameID + '****************');
	if (gameWasLast(gameID)){
		console.log('EndTournament: ' + tournamentID);
		sender.Answer(res, {result: 'OK', message: 'endingTournament'+tournamentID} );
		EndTournament(scores, gameID, tournamentID);
	}
	else{
		sender.Answer(res, {result: 'OK', message: 'endingGame'+gameID});
		console.log('Middle results: ' + JSON.stringify(data));
	}	
}
function last (Arr){
	return Arr[Arr.length-1];
}

function EndTournament( scores, gameID, tournamentID){
	var obj = [];
	for (var a in scores){
		obj.push( {value:scores[a], login: a} );
	}
	var winnersCount= last(tournaments[tournamentID].goNext);
	console.log('Prizes will go to ' + winnersCount + ' first users');
	console.log(obj);
	console.log('------');
	
	console.log('SortUP');
	obj.sort(sort_by('value', false, parseInt));
	console.log(obj);
	console.log('------');
	
	console.log('SortDown');
	obj.sort(sort_by('value', true, parseInt));
	console.log(obj);
	console.log(tournaments[tournamentID]);
	console.log('------');
	
	var winners = [];
	for (i=0;i<winnersCount;++i){
		winners[i] = { login:obj[i].login, prize:tournaments[tournamentID].Prizes[i] };
	}
	console.log(winners);
	sender.sendRequest("WinPrize", winners, '127.0.0.1', 
			queryProcessor.getPort('DBServer'), null, sender.printer );

	/*for (i=0;i<winnersCount;++i){

		console.log('User ' + obj[i].userID + ' wins ' + tournaments[tournamentID].Prizes[i] + ' points!!!' );
		var winnerObject = {userID:obj[i].userID, prize: tournaments[tournamentID].Prizes[i] };
		
		sender.sendRequest("WinPrize", winnerObject, '127.0.0.1', 
			queryProcessor.getPort('DBServer'), null, sender.printer );
	}*/
	//scores.sort(Comparator);
	console.log(scores);
}

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}
function Comparator(a, b){
	return a>b;
}

function gameWasLast(gameID){
	console.log('WRITE CONDITION: IF GAME WAS LAST');
	return true;
}

function ServeTournament (data, res){
	//console.log(data);
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
