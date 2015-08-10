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

funcArray["/GetGames"] = GetGames;


if (gameServerType ==='Sync'){
	funcArray["/Move"] = Move;
}
const GAME_FINISH = "GAME_FINISH";
const tournamentFAIL="tournamentFAIL";

const PREPARED = "PREPARED";
/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/

var game1 = {
	ID:1,
	tournamentID:1,
	playerCount:3,
	players: {0:0, 1:0, 2:0}//, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
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

/*var games = {
	count:3, 
	1:game1,
	2:game2,
	3:game3
}*/
var games = {
	count:0,
}
console.log(JSON.stringify(games));
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();

function GetGames ( data,res){
	sender.Answer(res, games);
}

function SetGame (data, res){
	console.log("SetGame ")
	console.log(data);
	//+ data + 
	games[++(game.count)]= data;
	res.end("Game " +" Is Set");
}

function ServeGames (data, res){
	console.log("ServeGame ")
	console.log(data);
	var tournamentID = data['tournamentID'];

	/*initGame(1);
	initGame(2);
	initGame(3);*/
	console.log('prev games.count= '+ games.count);
	games.count++;
	console.log('Now games.count= '+ games.count);
	games[games.count]= data;
	initGame(games.count);
	console.log(games);



	/*games[2].curPlayerID=1;
	games[3].curPlayerID=1;*/
	res.write("serving games");
	//res.end("serving games");
	res.end();
}

/*var timerId = setInterval(function() {
  console.log(games[1]);
}, 4000);*/
/*var timerId = setInterval(function() {
  console.log(games['1']);
}, 3500);*/

function initGame(ID){

	games[ID].curPlayerID=1;
	games[ID].status=PREPARED;
	console.log('initGame: totalPlayerCount = ' + games[ID].goNext[0]);
	games[ID].players = {};
	games[ID].players.count=games[ID].goNext[0];
	for (i=0;i<games[ID].players.count;++i){
		games[ID].players[i]=0;
	}
	console.log(games[ID]);
}
function Move (data, res){
	console.log("************************");
	console.log("Movement:");
	
	var playerID = data['playerID'];
	var tournamentID = data['tournamentID'];
	var gameID = data['gameID'];
	console.log('input: playerID=' + playerID + ' tournamentID=' + tournamentID + ' gameID=' + gameID);
	if (tournamentIsValid(tournamentID, gameID))
	{
		console.log(data);
		var gameToken = data['token'];
		var movement = data['movement'];

		var pointsAdd = movement;// movement['curPower'];
		
		var curGame = games[gameID];//

		var curPlayerID=curGame.curPlayerID;

		console.log('Getting game: ');
		//console.log(JSON.stringify(curGame));
		console.log('curGame.curPlayerID= '+ curPlayerID+' ')
		if (curPlayerID==playerID){
			console.log('I am here ' + JSON.stringify(curGame.players));
			curGame.players[playerID]+= pointsAdd;
			console.log("Player " + playerID + " has " + curGame.players[playerID] + " points");
			SwitchPlayer(curGame);
		}
		else{
			console.log("Player " + playerID + 
				" Not your turn! Player " + curGame.curPlayerID + " must play");
		}
		CheckForTheWinner(tournamentID, gameID, playerID, res);
		console.log('CheckedForTheWinner');
	}
	else{
		Answer(res, JSON.stringify(getGameStatus(gameID)));
		//res.end(tournamentFAIL);
	}
}
function getGameStatus(ID){
	return games[ID].status;
}
function SwitchPlayer( curGame){
	console.log('SwitchPlayer. Current is:');
	console.log(curGame.curPlayerID);
	console.log(curGame.players.count);
	if (curGame.curPlayerID<curGame.players.count-1){
		curGame.curPlayerID++;
	}
	else{
		curGame.curPlayerID=1;
	}
	console.log('SwitchPlayer. Now is ' + curGame.curPlayerID + '/' + curGame.players.count);
}

function tournamentIsValid(tournamentID, gameID){
	return games[gameID].status === PREPARED;//
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
function FinishGame(ID){
	games[ID].status = GAME_FINISH;
}
function CheckForTheWinner(tournamentID, gameID, playerID, res) {
	var curGame = games[gameID];

	if (curGame.players[playerID]>500){
		console.log("########################################################");
		console.log("Game " + gameID + " in tournament " + tournamentID + " ends. " + playerID + " wins!!");
		console.log("////////////////////////////////////////////////////////");
		FinishGame(gameID);
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
