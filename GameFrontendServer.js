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

/*funcArray["/ServeTournament"] = ServeTournament; //start all comands with '/'. IT's a URL to serve
funcArray["/StartTournament"] = StartTournament;
funcArray["/HaveEnoughResourcesForTournament"] = HaveEnoughResourcesForTournament;
funcArray["/FinishGame"] = FinishGame;*/

var status = new Object();

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();



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
	sender.expressSendRequest("StartGame", data, 
		'127.0.0.1', 'GameServer', null, sender.printer);//sender.printer

	/*sender.sendRequest("StartGame", data, 
		'127.0.0.1', 'GameServer', null, sender.printer);//sender.printer*/
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
	strLog("Answer from GameServer comes here!!!");
	res.end('OK');
    //    res.end("GameServed");
}
function AnalyzeStructure(tournament, res){
	var numberOfRounds = tournament['rounds'];
	strLog("numberOfRounds= " + numberOfRounds);
	sender.expressSendRequest("ServeGames", tournament, 
		'127.0.0.1', 'GameServer', res, ServeTournamentCallback);//sender.printer

	/*sender.sendRequest("ServeGames", tournament, 
		'127.0.0.1', 'GameServer', res, ServeTournamentCallback);//sender.printer*/
}

function FinishGame (req,res){
	var data = req.body;
	strLog(data);
	res.end('OK');
	sender.sendRequest("FinishGame", data, 
		'127.0.0.1', 'TournamentManager', res, sender.printer);
}

var server = app.listen(5008, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
