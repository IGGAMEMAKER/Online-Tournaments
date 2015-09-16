var sender = require('./requestSender');

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
var strLog = sender.strLog;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var serverName = "TournamentManager"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
app.use(function(req,res,next){
    strLog(serverName + ': Request!');
    next();
});
/*var funcArray = {};
funcArray["/ServeTournament"] = ServeTournament;
funcArray["/StartTournament"] = StartTournament;
funcArray["/FinishGame"] = FinishGame;*/

app.post('/ServeTournament', ServeTournament);
app.post('/StartTournament', StartTournament);
app.post('/FinishGame', FinishGame);


/*funcArray["/DeleteTournament"] = DeleteTournament;
funcArray["/PauseTournament"] = PauseTournament;
funcArray["/AbortTournament"] = AbortTournament;*/

var curTournamentID=0;



function GetGameFrontendAdress(gameNameId){
	strLog("rewrite TournamentManager.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 'GameFrontendServer'
	};
	return adress;
}
function SendTournamentHandler( error, response, body, res) {
	strLog("Answer from GameServer comes here!!!");
	res.end('OK');
    //    res.end("GameServed");
}

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write.
//you can get the object from POST request by typing data['parameterName'].
//you NEED TO FINISH YOUR ANSWERS WITH res.end();


function getTournamentStructure( tournament){
	/*return {
		gameNameID: tournament.gameNameID,
		goNext: tournament.goNext,
		players: tournament.players,
		tournamentID: tournament.tournamentID,
		numberOfRounds: tournament.numberOfRounds
	};*/
	return tournament;
}

function FinishGame(req, res){
	var data = req.body;
	sender.Answer(res, {result:'OK', message:'FinishGame'});
	sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}

function ServeTournament (req, res){
	var data = req.body;
	strLog("ServeTournament ")
	//strLog(JSON.stringify(data));//['tournamentStructure']);
	
	//strLog("Sending Tournament...");
	var tournament = data;
	//tournament.ID = curTournamentID++;
	//strLog(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);

	sender.sendRequest("ServeTournament", getTournamentStructure(tournament), 
		adress['IP'], adress['port'], res, SendTournamentHandler);//sender.printer
	
	//SendTournament(data);
}

function StartTournament (req, res){
	var data = req.body;
	strLog("StartTournament " + data['tournamentID']);//['tournamentStructure']);
	sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
	res.end("StartTournament");
}

var server = app.listen(5002, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://'+host+':'+ port);
});

//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
