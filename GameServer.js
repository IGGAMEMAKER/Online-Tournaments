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
if (gameServerType ==='Sync'){
	funcArray["/Move"] = Move;
}
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

function StartGame (data, res){
	console.log("start game: " + data);

	res.end("Starting game:" data['ID'];
}



server.SetServer(queryProcessor.getGamePort(curGameNameID), '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
