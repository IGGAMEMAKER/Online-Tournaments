var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');
var gameServerType = 'Sync';
var serverName = "GameServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
var curGameNameID = 1;
var funcArray = {};
funcArray["/SetGame"] = SetGame;
funcArray["/StartGame"] = StartGame;
funcArray["/ServeGames"] = ServeGames;
if (gameServerType ==='Sync'){
	funcArray["/Move"] = Move;
}
const GAME_FINISH = "GAME_FINISH";
const tournamentFAIL="tournamentFAIL";
/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/

var game1 = {
	ID:1,
	tournamentID:1,
	playerCount:10,
	players: {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
}

var game2 = {
	ID:2,
	tournamentID:1,
	players: {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
}
var game3 = {
	ID:3,
	tournamentID:2,
	players: {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
}

var games = {
	1:game1,
	2:game2,
	3:game3
}
console.log(JSON.stringify(games));
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function SetGame (data, res){
	console.log("SetGame " + data);
	
	res.end("Game " + data + " Is Set");
}

function ServeGames (data, res){
	console.log("ServeGame " + data);
	games[1].curPlayerID=1;
	games[2].curPlayerID=1;
	games[3].curPlayerID=1;
	
	res.end("serving games");
}

function Move (data, res){
	console.log("************************");
	console.log("Movement:");
	console.log(data);
	var playerID = data['playerID'];
	var tournamentID = data['tournamentID'];
	var gameID = data['gameID'];
	if (tournamentIsValid(tournamentID, gameID))
	{
		var gameToken = data['token'];
		var movement = data['movement'];

		var pointsAdd = movement;// movement['curPower'];
		var curGame = games[gameID];

		if (curGame.curPlayerID==playerID){
			curGame.players[playerID]+= pointsAdd;
			console.log("Player " + playerID + " has " + curGame.players[playerID] + " points");
		}
		else{
			console.log("Player " + playerID + 
				" Not your turn! Player " + curGame.curPlayerID + " must play");
		}
		CheckForTheWinner(tournamentID, gameID, playerID, res);
	}
	else{
		Answer(res, tournamentFAIL);
		//res.end(tournamentFAIL);
	}
}

function tournamentIsValid(tournamentID, gameID){
	return true;
}

function Answer(res, code){
	res.end(code);
	//console.log(write);//, write
	console.log("......................");//, write
}
function StartGame (data, res){
	console.log("start game: " + data);

	res.end("Starting game:" + data['ID']);
}

function CheckForTheWinner(tournamentID, gameID, playerID, res) {
	var curGame = games[gameID];
	if (curGame.players[playerID]>500){
		console.log("########################################################");
		console.log("Game " + gameID + "in tournament " + tournamentID + " ends. " + playerID + " wins!!");
		console.log("////////////////////////////////////////////////////////");
		Answer(res, JSON.stringify(curGame));//GAME_FINISH
		//res.end(GAME_FINISH);

	}
	else{
		Answer(res, "no Winner");
		//res.end("no Winner");
	}
}

//queryProcessor.getGamePort(curGameNameID)
server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
