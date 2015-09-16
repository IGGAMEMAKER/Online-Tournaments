var serverName = "TournamentServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
var sender = require('./requestSender');

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var strLog = sender.strLog;
//var funcArray = {};
app.use(function(req,res,next){
    strLog(serverName + ': Request!');
    next();
});
app.post('/RegisterUserInTournament', RegisterUserInTournament);
app.post('/ServeTournament', ServeTournament);
app.post('/FinishGame', FinishGame);

/*funcArray["/RegisterUserInTournament"] = RegisterUserInTournament; //start all comands with '/'. IT's a URL to serve
funcArray["/ServeTournament"] = ServeTournament;
funcArray["/FinishGame"] = FinishGame;*/

var tournaments = {
	count:0
}

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH sender.Answer(res,();

function playerIsRegistered (tournament, login){
	return tournament.logins[login];
}

function RegisterUserInTournament (req, res){
	var data = req.body;
	//strLog("Sender = " + data['sender']);
	strLog("Registering in tournament: " + data['tournamentID']);
	var tournamentID = data['tournamentID'];
	var login = data['login'];//data['login'];
//	strLog("AddPlayerToTournament(); WRITE THIS CODE!!");
	var tournament = tournaments[tournamentID];
	var maxPlayersInTournament = tournament.goNext[0];

	if (maxPlayersInTournament> tournament.playersRegistered){
		strLog('Current players:');
		strLog(tournament.players);
		strLog(tournament);
		if (playerIsRegistered(tournament, login)){ // tournament.players[login])
			strLog('User ' + login + ' is already Registered in ' + tournamentID);
			
			sender.Answer(res,Fail);
		}
		else{
			tournament.playersRegistered++;
			tournament.players.push(login);
			tournament.logins[login]=1;
			strLog('Logins list');
			strLog(tournament.logins);

			sender.Answer(res,Success);

			strLog('User ' + login + ' added to tournament ' + tournamentID+' || ('+ tournament.playersRegistered+'/'+maxPlayersInTournament+')');
			
			if (maxPlayersInTournament === tournament.playersRegistered){
				strLog("Tournament " + tournamentID + " starts");
				strLog(tournament.players);
				
				sender.sendRequest("StartTournament", {sender:'TournamentServer', tournamentID:tournamentID, logins:tournament.players}, 
					'127.0.0.1', 'FrontendServer', null, sender.printer);
				
				sender.sendRequest("StartTournament", {sender:'TournamentServer', tournamentID:tournamentID, logins:tournament.players}, 
					'127.0.0.1', 'TournamentManager', null, sender.printer );
				//sender.Answer(res,Success);
			}
		}
	}
	else{
		strLog("Sorry, tournament is Full:"+ maxPlayersInTournament+'/'+tournament.playersRegistered);
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

function FinishGame (req, res){
	var data = req.body;
	strLog(data);
	var gameID = data['gameID'];
	var tournamentID = data['tournamentID'];
	var scores = data['scores'];
	
	strLog('******************* game Finishes *********' + gameID + '****************');
	if (gameWasLast(gameID)){
		strLog('EndTournament: ' + tournamentID);
		sender.Answer(res, {result: 'OK', message: 'endingTournament'+tournamentID} );
		EndTournament(scores, gameID, tournamentID);
	}
	else{
		sender.Answer(res, {result: 'OK', message: 'endingGame'+gameID});
		strLog('Middle results: ' + JSON.stringify(data));
	}	
}
function last (Arr){
	return Arr[Arr.length-1];
}

function EndTournament( scores, gameID, tournamentID){
	var obj = [];
	for (var a in scores){
		obj.push( { value:scores[a], login: a } );
	}
	var winnersCount= last(tournaments[tournamentID].goNext);
	strLog('Prizes will go to ' + winnersCount + ' first users');
	/*//strLog(obj);
	//strLog('------');
	
	strLog('SortUP');
	obj.sort(sort_by('value', false, parseInt));
	strLog(obj);
	strLog('------');
	
	strLog('SortDown');*/
	obj.sort(sort_by('value', true, parseInt));
	strLog(obj);
	strLog(tournaments[tournamentID]);
	strLog('------');
	
	var winners = [];
	for (i=0;i<winnersCount;++i){
		winners[i] = { login:obj[i].login, prize:tournaments[tournamentID].Prizes[i] };
	}
	strLog(winners);

	sender.sendRequest("WinPrize", winners, '127.0.0.1', 
			'DBServer', null, sender.printer );

	/*for (i=0;i<winnersCount;++i){

		strLog('User ' + obj[i].userID + ' wins ' + tournaments[tournamentID].Prizes[i] + ' points!!!' );
		var winnerObject = {userID:obj[i].userID, prize: tournaments[tournamentID].Prizes[i] };
		
		sender.sendRequest("WinPrize", winnerObject, '127.0.0.1', 
			'DBServer', null, sender.printer );
	}*/
	//scores.sort(Comparator);
	strLog(scores);
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
	strLog('WRITE CONDITION: IF GAME WAS LAST');
	return true;
}

function ServeTournament (req, res){
	var data = req.body;
	//strLog(data);
	var tournamentID = data['tournamentID'];
	strLog('TS tries to serve:' + tournamentID);
	//strLog(data);

	tournaments[tournamentID] = data;
	tournaments[tournamentID].players = [];
	tournaments[tournamentID].playersRegistered=0;
	tournaments[tournamentID].logins = {};

	sender.sendRequest("ServeTournament", data, '127.0.0.1', 'TournamentManager', res, ServeTournamentTMProxy );
}

function ServeTournamentTMProxy ( error, response, body, res){
	sender.Answer(res, body);
}

////TIMERS!!!!
/*var timerId = setInterval(function() {
  if (tournaments[2].playerTotalCount === tournaments[2].playersRegistered){
	strLog("Tournament " + 2 + " starts");	
  }
  else{
 	//strLog("Registered in 2: " + tournaments[2].playersRegistered);
	strLog("Registered :" +tournaments[2].playersRegistered +" / " + tournaments[2].playerTotalCount);
  }
}, 2000);*/

var Success = {
	result: 'OK'
};

var Fail = {
	result: 'fail'
};

var server = app.listen(5001, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});

//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
