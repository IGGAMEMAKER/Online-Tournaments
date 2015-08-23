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
	var gameID = data['tournamentID'];
	console.log('FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID]= data;
	games[gameID].tournamentID= data['tournamentID'];
	res.end("Game " + gameID + " Is Set");
}

function ServeGames (data, res){
	console.log("ServeGame ")
	console.log(data);
	var tournamentID = data['tournamentID'];

	/*initGame(1);
	initGame(2);
	initGame(3);*/

	var gameID = data['tournamentID'];
	console.log('FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID]= data;
	initGame(gameID);
	console.log(games);

	/*games[games.count]= data;
	initGame(games.count);
	console.log(games);*/



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

var INIT = 'INIT';
function initGame(ID){

	games[ID].curPlayerID=1;
	
	console.log('initGame: totalPlayerCount = ' + games[ID].goNext[0]);
	games[ID].players = {};
	games[ID].players.count=games[ID].goNext[0];
	games[ID].status = INIT;
	/*for (i=0;i<games[ID].players.count;++i){
		games[ID].players[i]=0;
	}*/
	console.log(games[ID]);
}
function Move (data, res){
	console.log("************************");
	console.log("Movement:");
	var userName = data['login'];
	var playerID = data['playerID'];
	var tournamentID = data['tournamentID'];
	var gameID = data['gameID'];
	//console.log('input: playerID=' + playerID + ' tournamentID=' + tournamentID + ' gameID=' + gameID);
	console.log('input: player=' + userName + ' tournamentID=' + tournamentID + ' gameID=' + gameID);

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
		if (PlayerTurn(gameID, userName) && playerExists(gameID, userName)) { // curGame.players[playerID] ){//&& curGame.players[playerID]  ---- check if player is regitered in tournament
			console.log('I am here ' + JSON.stringify(curGame.players));
			curGame.scores[userName]+= pointsAdd;
			console.log("Player " + userName + " has " + curGame.scores[userName] + " points");
			SwitchPlayer(curGame);
		}
		else{
			console.log("Player " + userName + 
				" Not your turn! Player " + curGame.curPlayerID + " must play");
		}
		CheckForTheWinner(tournamentID, gameID, userName, res);
		console.log('CheckedForTheWinner');
	}
	else{
		sender.Answer(res, getGameStatus(gameID));
		//Answer(res, JSON.stringify(getGameStatus(gameID)));
		//res.end(tournamentFAIL);
	}
}
function playerExists(gameID, userName){
	var playerExistsVal = getGID(gameID, userName);// games[gameID].players.UIDtoGID[userName]; //userIDs[playerID];// games[gameID].players.UIDtoGID[playerID]
	console.log('playerExists:'+playerExistsVal);
	return playerExistsVal ;
}
function PlayerTurn(gameID, userName){
	console.log("PlayerTurn info");
	console.log(gameID);
	console.log(userName);
	console.log(games[gameID].curPlayerID);

	//var a = (getUID(gameID, games[gameID].curPlayerID) == playerID);
	var a = (games[gameID].curPlayerID == getGID(gameID,userName));
	console.log('PlayerTurn:'+a);
	return a;//getUID(gameID, games[gameID].curPlayerID) == playerID
	//return getUID(curGame.curPlayerID) curGame.players[curGame.curPlayerID].playerID ==playerID;//curPlayerID==playerID
}

function getGameStatus(ID){
	return games[ID].status;
}
function SwitchPlayer( curGame){
	//console.log(JSON.stringify(curGame));
	console.log('SwitchPlayer. Current was:' + curGame.curPlayerID + '/' + curGame.players.count);
	if (curGame.curPlayerID<curGame.players.count){
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
	console.log("start game: " + JSON.stringify(data));
	var ID = data['tournamentID'];
	if (!games[ID]){
		var message = 'Cannot find tournament with ID='+ ID;
		console.log(games);
		console.log(message);
		sender.Answer(res, {result:'fail', message:message });
	}
	else{
		games[ID].status=PREPARED;
		//games[ID].players = {};
		games[ID].players.UIDtoGID = {};

		games[ID].scores = {};
		var i=1;
		var userIDs = data['logins'];
		//console.log(userIDs);
		for (var playerID in userIDs){
			//console.log(playerID);
			games[ID].players.UIDtoGID[userIDs[playerID]] = i;
			games[ID].scores[userIDs[playerID]] = 0;
			i++;
			//games[ID].players.push(playerID);// = playerID;
			//games[ID].scores.push(0);
			//games[ID].players[i++]={playerID:playerID , score:0 };
		}
		games[ID].userIDs = userIDs;
		console.log(games[ID].players);
		sender.Answer(res, {result:'success', message:"Starting game:" + ID });
	}
	//res.end();
}

function getUID(gameID, GID){//GID= GamerID, UID= UserID
	return games[gameID].userIDs[GID];
}

function getGID(gameID, UID){//GID= GamerID, UID= UserID
	return games[gameID].players.UIDtoGID[UID];
}

function FinishGame(ID){
	games[ID].status = GAME_FINISH;
	var sortedPlayers = {};
	sortedPlayers.scores = games[ID].scores;// Sort(games[ID].scores);
	sortedPlayers.gameID = ID;
	console.log('FIX IT!!! GAMEID=tournamentID');
	sortedPlayers.tournamentID = ID;// games[ID].tournamentID;
	sender.sendRequest("FinishGame", sortedPlayers , '127.0.0.1', 
			queryProcessor.getPort('GameFrontendServer'), null, sender.printer );
}
function Sort(players){
	return players;
}

function ScoreOfPlayer(gameID, UID){
	return games[gameID].scores[UID];
}

function CheckForTheWinner(tournamentID, gameID, playerID, res) {
	var curGame = games[gameID];

	if (ScoreOfPlayer(gameID, playerID)>500){
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
