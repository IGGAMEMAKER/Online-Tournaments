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
app.post('/CancelRegister', function (req, res){
	CancelRegister(req.body, res);
})

app.post('/ServeTournament', function (req, res){ 
	ServeTournament(req.body, res);
});
app.post('/FinishGame', FinishGame);

var tournaments = {
	count:0
}

const TOURN_STATUS_RUNNING = 2;
function str(obj){
	return ' '+JSON.stringify(obj)+' ';
}

var fs = require('fs');
var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
console.log(file);
var configs =  JSON.parse(file);
/*{ 
  msg:'superhero!',
  gamePort:5009,
  gameHost:'localhost',
  gameHost2:'46.101.157.129'
}*/
console.log(JSON.stringify(configs));

// If you want to start game manually (after long time stop), you need to call StartTournament
// 


function TournamentLog(tournamentID ,message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) {strLog(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}

function Initialize(){
	strLog('TournamentServer Initialize', 'ASD');
	sender.sendRequest('GetTournaments', {}, '127.0.0.1', 'DBServer', null, function ( error, response, body, res){
		if (error){strLog(JSON.stringify(error)); }
		else{
			for (var i = body.length - 1; i >= 0; i--) {
				getTournament(body[i].tournamentID, body[i]);
			}
			strLog('TournamentServer Initialize Tournaments count : ' + body.length, 'ASD');
		}
	});
}
//TournamentLog(1, 'OLOLO');
setTimeout(Initialize, 4000);
//Initialize();

function playerIsRegistered (tournament, login){
	strLog('players registered: ' + JSON.stringify(tournament.logins));
	return tournament.logins[login];
}

function showRegList(tournamentID){
	return tournaments[tournamentID].playersRegistered 
		+ ' players ' + JSON.stringify(tournaments[tournamentID].players) 
		+ ' logins ' +  JSON.stringify(tournaments[tournamentID].logins);
}

function unRegPlayer(tournamentID, login){
	strLog('Deleting player ' + login + ' from player list');
	TournamentLog(tournamentID, 'unRegPlayer: '+login );

	var was = 'Registered count was: ' +  showRegList(tournamentID) ;
	TournamentLog(tournamentID, was);
	strLog(was);

	tournaments[tournamentID].playersRegistered--;
	var a = 1;
	for (var i=0; i<tournaments[tournamentID].players.length && a; ++i){
		if (tournaments[tournamentID].players[i] == login){
			tournaments[tournamentID].players.splice(i,1);
			//delete tournaments[tournamentID].players[login];
		}
		
	}
	//delete tournaments[tournamentID].players[login];
	delete tournaments[tournamentID].logins[login];

	var now = 'Registered count now: ' +  showRegList(tournamentID);
	TournamentLog(tournamentID, now);
	strLog(now);
	strLog('UnRegisterFromTournament SHIT CODE: IT NEEDS TO CHECK Tournament STATUS');
}

function regPlayer(tournament, login){
	tournament.playersRegistered++;
	tournament.players.push(login);
	tournament.logins[login]=1;
	TournamentLog(tournament.tournamentID, 'Registered user ' + login);
	var maxPlayersInTournament = tournament.goNext[0];
	strLog('User ' + login + ' added to tournament ' + tournament.tournamentID+' || ('+ tournament.playersRegistered+'/'+maxPlayersInTournament+')');
	/*strLog('Logins list');
	strLog(tournament.logins);*/
}



//console.log(configs)
var gameHost = configs.gameHost? configs.gameHost : '127.0.0.1';
var gamePort = configs.gamePort? configs.gamePort : '5010';

function getPortAndHostOfGame(tournamentID){
	strLog('getPortAndHostOfGame. REWRITE IT!!!!');
	strLog('tIDtoGameName : ' + JSON.stringify(tIDtoGameName));
	strLog('tIDtoGameName[tournamentID] = ' + tIDtoGameName[tournamentID]);

	switch (tIDtoGameName[tournamentID])
	{
		case 1:
			return { port:5009, host: gameHost }; //PPServer
		break;
		default:
			return { port:5010, host: gameHost };//QuestionServer
		break;

	}
  /*if (tournamentID<8){
    return { port:5009, host:'localhost' };
  }
  else{
    return { port:5010, host:'localhost' };
  }*/
}

function CancelRegister(data, res){
	if (data){
		var tournamentID = data.tournamentID;
		var tournament = tournaments[tournamentID];
		var login = data.login;
		if (playerIsRegistered(tournament, login) && login && tournamentID && tournament){
			UnRegisterFromTournament(login, tournamentID, tournament, res);
		}
		else{
			sender.Answer(res, Fail);
		}
	}
	else{
		sender.Answer(res, Fail);
	}
}

function RegisterUserInTournament (req, res){
	var data = req.body;
	//strLog("Sender = " + data['sender']);
	strLog("Registering in tournament: " + data['tournamentID']);
	var tournamentID = data.tournamentID;
	var login = data.login;
	var tournament = tournaments[tournamentID];
	var maxPlayersInTournament = tournament.goNext[0];

	if (maxPlayersInTournament > tournament.playersRegistered){
		strLog('Current players:');
		strLog(tournament.players);
		//strLog(tournament);
		if (playerIsRegistered(tournament, login)){ // tournament.players[login])
			strLog('User ' + login + ' is already Registered in ' + tournamentID);
			
			sender.Answer(res, Fail);
		}
		else{
			TryToRegisterInTournament(login, tournamentID, tournament, maxPlayersInTournament, res);
		}
	}
	else{
		strLog("Sorry, tournament is Full:"+ maxPlayersInTournament+'/'+tournament.playersRegistered);
		sender.Answer(res, Fail);
	}
}

function Error(err){
	strLog('Error: ' + JSON.stringify(err));
}

function UnRegisterFromTournament(login, tournamentID, tournament, res){
	strLog('CancelRegister');
	sender.sendRequest('CancelRegister', {login:login, tournamentID:tournamentID}, '127.0.0.1', 'DBServer', res, 
		function (error, response, body, res){
			if (error) { Error(error); sender.Answer(res, Fail); }
			else{
				strLog( 'UnRegisterFromTournament Answer from DB: ' + JSON.stringify(body));
				if (body.money >= 0){ // 
					sender.Answer(res, OK);
					unRegPlayer(tournamentID, login);
				}
				else{
					sender.Answer(res, Fail);
				}
			}
		})
}

var runningTournaments = {};

function addRunningTournament(tournamentID){
	runningTournaments[tournamentID] = 1;
}

function deleteRunningTournament(tournamentID){
	runningTournaments[tournamentID] = null;
	delete runningTournaments[tournamentID];
}

function StartTournament(tournamentID, tournament, force){
	strLog("Tournament " + tournamentID + " starts");
	strLog(tournament.players);
	TournamentLog(tournamentID, 'Tournament starts... ' + str(tournament.players));
	
	var obj = getPortAndHostOfGame(tournamentID);
	obj.tournamentID = tournamentID;
	obj.sender = 'TournamentServer';
	obj.logins = tournament.players;
	if (force) obj.force = true;

	strLog('StartTournament: ' + JSON.stringify(obj));
	TournamentLog(tournamentID, 'start Object:' + str(obj));
	tournaments[tournamentID].status = TOURN_STATUS_RUNNING;
	sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer', null, sender.printer);
	if (!force) sender.sendRequest("StartTournament", obj, '127.0.0.1', 'DBServer', null, sender.printer);

	if (!force) addRunningTournament(tournamentID);
}

function TryToRegisterInTournament (login, tournamentID, tournament, maxPlayersInTournament, res){
	strLog('TryToRegisterInTournament'); 
	sender.sendRequest('RegisterUserInTournament', {login:login, tournamentID:tournamentID}, '127.0.0.1', 'DBServer', res, 
		function (error, response, body, res){
			if (error) { sender.Answer(res, Fail); return;}
			else {
				strLog('RegisterUserInTournament BODY: ' + JSON.stringify(body));

				if (body.result != 'OK') {sender.Answer(res, Fail); return;}

				sender.Answer(res, OK);
				regPlayer(tournament, login);
		
				if (maxPlayersInTournament === tournament.playersRegistered){
					StartTournament(tournamentID, tournament);
				}

				/*if (body.result == 'OK'){
					sender.Answer(res, OK);
					regPlayer(tournament, login);
			
					if (maxPlayersInTournament === tournament.playersRegistered){
						StartTournament(tournamentID, tournament);
					}
				}
				else{
					sender.Answer(res, Fail);
				}*/
			}
		});
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
	if (tournaments[tournamentID]){
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
		TournamentLog(tournamentID, 'Winners:'+str(obj));

		/*var winners = [];
		for (i=0;i<winnersCount;++i){
			winners[i] = { login:obj[i].login };//, place:tournaments[tournamentID].Prizes[i] };
		}
		strLog(winners);*/

		/*sender.sendRequest("WinPrize", {winners:winners, tournamentID:tournamentID}, '127.0.0.1', 
				'DBServer', null, sender.printer );*/
		sender.sendRequest("WinPrize", {winners:obj, tournamentID:tournamentID}, '127.0.0.1', 
				'DBServer', null, sender.printer );
		
		deleteRunningTournament(tournamentID);
		strLog('Finished Tournament ' + tournamentID, 'chk');
		/*for (i=0;i<winnersCount;++i){

			strLog('User ' + obj[i].userID + ' wins ' + tournaments[tournamentID].Prizes[i] + ' points!!!' );
			var winnerObject = {userID:obj[i].userID, prize: tournaments[tournamentID].Prizes[i] };
			
			sender.sendRequest("WinPrize", winnerObject, '127.0.0.1', 
				'DBServer', null, sender.printer );
		}*/
		//scores.sort(Comparator);
		strLog(scores);
	}
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

/*recentlyStarted(tournamentID){
	//if the tournament crashed 
	return true;
}*/

app.post('/Running', function (req, res){
	sender.Answer(res, runningTournaments);
})
app.all('/Tournaments', function (req, res){
	sender.Answer(res, tournaments);
});


app.post('/RunTournament', function (req, res){
	var tournamentID = req.body.tournamentID;
	StartTournament(tournamentID, tournaments[tournamentID], 'ForcedRun');
	sender.Answer(res, OK);
});

app.post('/StopTournament', function (req, res){
	var tournamentID = req.body.tournamentID;
	strLog('StopTournament : ' + tournamentID, 'Manual');
	sender.sendRequest("StopTournament", {tournamentID: tournamentID}, '127.0.0.1', 'DBServer', null, sender.printer);
	sender.sendRequest("StopTournament", {tournamentID: tournamentID}, '127.0.0.1', 'FrontendServer', null, sender.printer);

	tournaments[tournamentID] = null;
	delete tournaments[tournamentID];
	deleteRunningTournament(tournamentID);

	sender.Answer(res, OK);
})

function checkRunningTournaments(){
	var stream = 'chk';
	if(runningTournaments=={}) strLog('runningTournaments: ' + JSON.stringify(runningTournaments), stream);
	for (var tournIndex in runningTournaments){
		strLog(tournIndex + ' ' + runningTournaments[tournIndex], stream);
		var tournamentID = tournIndex;
		sender.sendRequest("TournamentWorks", {tournamentID:tournamentID}, '127.0.0.1', 'GameFrontendServer', null, 
			function (error, response, body, res){
				if (body.result != 'OK'){
					strLog('RESTARTING TOURNAMENT ' + tournamentID+'/'+tournIndex, stream);
					StartTournament(tournamentID, tournaments[tournamentID], 'restart');
					//runningTournaments[]
				}
			});
	}
	setTimeout(checkRunningTournaments, 10000);
}

//var tmrRunningTournaments = setInterval( function(){checkRunningTournaments();} , 5000);
setTimeout(checkRunningTournaments, 5000);

function needsToRun(tournamentID){
	return tournaments[tournamentID].goNext[0] === tournaments[tournamentID].playersRegistered;
}

function getTournament(tournamentID, tournament){
	TournamentLog(tournamentID, 'Got tournament:' + str(tournament) );
	addToGameNameList(tournamentID, tournament.gameNameID);
	tournaments[tournamentID] = tournament;
	tournaments[tournamentID].players = [];
	tournaments[tournamentID].playersRegistered=0;
	tournaments[tournamentID].logins = {};
	sender.sendRequest('GetPlayers', {tournamentID:tournamentID}, '127.0.0.1', 'DBServer', null, function (error, response, body, res){
		for (var i = body.length - 1; i >= 0; i--) {
			regPlayer(tournaments[tournamentID], body[i].userID);
			strLog(JSON.stringify(tournaments[tournamentID].players));
		};
		if (needsToRun(tournamentID)){// && recentlyStarted(tournamentID)){
			addRunningTournament(tournamentID);
		}
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

var OK = {
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
