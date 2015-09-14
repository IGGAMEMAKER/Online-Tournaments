var sender = require('./requestSender');

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var serverName = "TournamentManager"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

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

function FinishGame(req, res){
	var data = req.body;
	sender.Answer(res, {result:'OK', message:'FinishGame'});
	sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}

function GetGameFrontendAdress(gameNameId){
	console.log("rewrite TournamentManager.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 'GameFrontendServer'
	};
	return adress;
}
function SendTournamentHandler( error, response, body, res) {
	console.log("Answer from GameServer comes here!!!");
	res.end('OK');
    //    res.end("GameServed");
}
//SendTournament(tournament1);
/*function SendTournament(tournament){
	//JSON.stringify(tournament)
	//'GameFrontendServer'
	console.log("Sending Tournament...");
	//console.log(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);
	//sender.sendRequest("ServeTournament",)
	
	sender.sendRequest("ServeTournament", tournament, adress['IP'], adress['port'], null, SendTournamentHandler);//sender.printer
}*/

//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write.
//you can get the object from POST request by typing data['parameterName'].
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function ServeTournament (req, res){
	var data = req.body;
	console.log("ServeTournament ")
	console.log(JSON.stringify(data));//['tournamentStructure']);
	
	console.log("Sending Tournament...");
	var tournament = data;
	//tournament.ID = curTournamentID++;
	//console.log(tournament);
	var adress = GetGameFrontendAdress(tournament.gameNameID);

	sender.sendRequest("ServeTournament", getTournamentStructure(tournament), 
		adress['IP'], adress['port'], res, SendTournamentHandler);//sender.printer
	
	//SendTournament(data);
	
	//res.end("ServeTournament");
}

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


function StartTournament (req, res){
	var data = req.body;
	console.log("StartTournament " + data['tournamentID']);//['tournamentStructure']);
	sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
	res.end("StartTournament");
}
var server = app.listen(5002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(serverName + ' is listening at http://%s:%s', host, port);
});

//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
