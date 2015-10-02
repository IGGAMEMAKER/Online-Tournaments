var serverName = "TournamentServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
var sender = require('./requestSender');
sender.setServer(serverName);

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var strLog = sender.strLog;

app.use(function(req,res,next){
    strLog(serverName + ': Request!');
    next();
});
app.post('/RegisterUserInTournament', RegisterUserInTournament);
app.post('/ServeTournament', function (req, res){ 
	ServeTournament(req.body, res);
});
app.post('/FinishGame', FinishGame);

var tournaments = {
	count:0
}

function Initialize(){
	sender.sendRequest('GetTournaments', {query:2}, '127.0.0.1', 'DBServer', null, function ( error, response, body, res){
		if (error){strLog(JSON.stringify(error)); }
		else{
			for (var i = body.length - 1; i >= 0; i--) {
				getTournament(body[i].tournamentID, body[i]);
			}
		}
	});
}

Initialize();
function playerIsRegistered (tournament, login){
	return tournament.logins[login];
}

function regPlayer(tournament, login){
	tournament.playersRegistered++;
	tournament.players.push(login);
	tournament.logins[login]=1;
	/*strLog('Logins list');
	strLog(tournament.logins);*/
}

function getPortAndHostOfGame(tournamentID){
	strLog('getPortAndHostOfGame. REWRITE IT!!!!');
	strLog('tIDtoGameName : ' + JSON.stringify(tIDtoGameName));
	strLog('tIDtoGameName[tournamentID] = ' + tIDtoGameName[tournamentID]);

	switch (tIDtoGameName[tournamentID])
	{
		case 1:
			return { port:5009, host:'localhost'}; //PPServer
		break;
		default:
			return { port:5010, host:'localhost' };//QuestionServer
		break;

	}
  /*if (tournamentID<8){
    return { port:5009, host:'localhost' };
  }
  else{
    return { port:5010, host:'localhost' };
  }*/
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

	if (maxPlayersInTournament > tournament.playersRegistered){
		strLog('Current players:');
		strLog(tournament.players);
		//strLog(tournament);
		if (playerIsRegistered(tournament, login)){ // tournament.players[login])
			strLog('User ' + login + ' is already Registered in ' + tournamentID);
			
			sender.Answer(res,Fail);
		}
		else{
			regPlayer(tournament, login);
			

			sender.Answer(res,Success);
			sender.sendRequest('RegisterUserInTournament', {login:login, tournamentID:tournamentID}, '127.0.0.1', 'DBServer', null, sender.printer);
			strLog('User ' + login + ' added to tournament ' + tournamentID+' || ('+ tournament.playersRegistered+'/'+maxPlayersInTournament+')');
			
			if (maxPlayersInTournament === tournament.playersRegistered){
				strLog("Tournament " + tournamentID + " starts");
				strLog(tournament.players);
				
				var obj = getPortAndHostOfGame(tournamentID);
				obj.tournamentID = tournamentID;
				obj.sender = 'TournamentServer';
				obj.logins = tournament.players;
				strLog('StartTournament: ' + JSON.stringify(obj));
				sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer', null, sender.printer);
				sender.sendRequest("StartTournament", obj, '127.0.0.1', 'DBServer', null, sender.printer);
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
	
	/*var winners = [];
	for (i=0;i<winnersCount;++i){
		winners[i] = { login:obj[i].login };//, place:tournaments[tournamentID].Prizes[i] };
	}
	strLog(winners);*/

	/*sender.sendRequest("WinPrize", {winners:winners, tournamentID:tournamentID}, '127.0.0.1', 
			'DBServer', null, sender.printer );*/
	sender.sendRequest("WinPrize", {winners:obj, tournamentID:tournamentID}, '127.0.0.1', 
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

var tIDtoGameName = {};
function addToGameNameList(tournamentID, gameName){
	tIDtoGameName[tournamentID] = gameName;
}

function getTournament(tournamentID, data){
	addToGameNameList(tournamentID, data.gameNameID);
	tournaments[tournamentID] = data;
	tournaments[tournamentID].players = [];
	tournaments[tournamentID].playersRegistered=0;
	tournaments[tournamentID].logins = {};
	sender.sendRequest('GetPlayers', {tournamentID:tournamentID}, '127.0.0.1', 'DBServer', null, function (error, response, body, res){
		for (var i = body.length - 1; i >= 0; i--) {
			regPlayer(tournaments[tournamentID], body[i].userID);
			strLog(JSON.stringify(tournaments[tournamentID].players));
		};
		
		//strLog(JSON.stringify(body));
	});
}
function ServeTournament (data, res){
	//var data = req.body;
	//strLog(data);
	var tournamentID = data['tournamentID'];
	strLog('TS tries to serve:' + tournamentID);
	//strLog(data);
	getTournament(tournamentID, data);
	

	sender.sendRequest("ServeTournament", data, '127.0.0.1', 'FrontendServer', res, ServeTournamentTMProxy );
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
