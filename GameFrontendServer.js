var sender = require('./requestSender');
var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var serverName = "GameFrontendServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
var strLog = sender.strLog;
//var funcArray = {};

app.post('/ServeTournament', ServeTournament);
app.post('/StartTournament', StartTournament);
app.post('/HaveEnoughResourcesForTournament', HaveEnoughResourcesForTournament);
app.post('/FinishGame', FinishGame);
app.post('/GameServerStarts', GameServerStarts);


var status = new Object();

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();

var tourns = {};

function getGameNameID (gameName){
	switch(gameName){
		case 'Questions':
			return 2;
		default:
			return 2;
	}
}

function GameServerStarts(req, res){
	sender.Answer(res,{result:'OK'});
	var data = req.body;
	strLog('GameServerStarts:' + JSON.stringify(data));
	var gameName = data.gameName;
	var gameNameID = getGameNameID(gameName);
	sender.sendRequest('GetTournaments', {query:{gameNameID:gameNameID, status:2}, queryFields:''}, '127.0.0.1', 'DBServer', null, function (error, response, body, res) {//GetTournamentsForGS
		//strLog(JSON.stringify(body));
		for (var i = body.length - 1; i >= 0; i--) {
			var tournament = body[i];
			var numberOfRounds = tournament['rounds'];
			
			var tournamentID = tournament.tournamentID;
			strLog(JSON.stringify(tournament));

			if (tournament && numberOfRounds){
				sendToGameServer("ServeGames", tournament, null, gameNameID, null, sender.printer);
				tourns[tournamentID] = gameNameID;
			}
			//AnalyzeStructure(body[i], res);
		};
	});
}

function ServeTournament (req, res){
	var data = req.body;
	strLog("----");
	strLog("ServeTournament :");

	//strLog(data);
	AnalyzeStructure(data, res);
	strLog("----");
}

function StartTournament (req, res){
	var data = req.body;
	sender.Answer(res, {status:'OK', message:'StartTournament'});
	var tournamentID = data.tournamentID;
	sender.expressSendRequest("StartGame", data, 
		'127.0.0.1', tourns[tournamentID], null, sender.printer);//sender.printer
}

function HaveEnoughResourcesForTournament (req, res){
	var data = req.body;
	strLog("We have resources for " + data['playerCount'] + " divided in " + data['gameNums'] + " groups. HARDCODED success");
	var result = {
		result:"success"
	}
	res.end(result);
}

function ServeTournamentCallback( error, response, body, res) {
	strLog("Answer from GS comes here!!!");
	res.end('OK');
    //    res.end("GameServed");
}
function AnalyzeStructure(tournament, res){
	strLog('AnalyzeStructure. SENDING GAME TO GameServer');
	var numberOfRounds = tournament['rounds'];
	var gameName = tournament.gameName;
	if (!gameName) gameName = 1;
	strLog("numberOfRounds= " + numberOfRounds);
	sendToGameServer("ServeGames", tournament, null, gameName, res, ServeTournamentCallback);
	tourns[tournament.tournamentID] = gameName;
	/*sender.expressSendRequest("ServeGames", tournament, 
		'127.0.0.1', 'GameServer', res, ServeTournamentCallback);//sender.printer*/
}

function FinishGame (req,res){
	var data = req.body;
	strLog(data);
	res.end('OK');
	sender.sendRequest("FinishGame", data, 
		'127.0.0.1', 'FrontendServer', res, sender.printer);
}

function sendToGameServer(command, data, host, gameName, res, callback){
	strLog(' GAME_NAME IS :' + gameName);

	sender.expressSendRequest(command, data, 
		host?host:'127.0.0.1', gameName, res, callback);//sender.printer
}



var server = app.listen(5008, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
