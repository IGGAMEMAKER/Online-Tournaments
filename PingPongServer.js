var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');


var express = require('express');
var app = express();


var qs = require('querystring');
//var gameServer = require('../gameServer');
var gameServerType = 'ASync';
var serverName = "GameServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
var curGameNameID = 1;

var funcArray = {};
/*funcArray["/SetGame"] = SetGame;
funcArray["/StartGame"] = StartGame;
funcArray["/ServeGames"] = ServeGames;

funcArray["/GetGames"] = GetGames;*/



//var fs = require('fs');


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.all('/SetGame', SetGame);
app.all('/StartGame', StartGame);
app.all('/ServeGames', ServeGames);
app.all('/GetGames', GetGames);

//var outputFilename = 'RQW.txt';

	/*fs.writeFile(outputFilename, JSON.stringify(req), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	}); */

/*app.all('/ServeGames', function (req, res){
	console.log('ServeGames app!!!!');
	//console.log(req);
	if (req.body){ 
		console.log('Body');
		console.log(req.body); }
	if (req.query){
	console.log(req.query);}
	
	res.end('Served');
});*/

//app.all('/')
//app.get('/Move', Move);
/*if (gameServerType ==='Sync'){
	app.get('/Move', Move);
}*/
const GAME_FINISH = "GAME_FINISH";
const tournamentFAIL="tournamentFAIL";
const STANDARD_PREPARE_TICK_COUNT = 15;
const UPDATE_TIME = 1000/50; //50 times per second = 20ms
const PREPARED = "PREPARED";


/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/

/*var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected'):
});
nsp.emit('hi', 'everyone!');*/


var games = {
	count:0,
}

//console.log(JSON.stringify(games));
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();

function GetGames ( req,res){
	var data = req.body;
	sender.Answer(res, games);
}

function SetGame (req, res){
	var data = req.body;
	console.log("SetGame ");
	console.log(data);
	var gameID = data['tournamentID'];
	console.log('FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID] = data;
	games[gameID].tournamentID = data['tournamentID'];
	res.end("Game " + gameID + " Is Set");
}

console.log('pp Server starts!!');

function ServeGames (req, res){
	console.log('PP Server serves games');
	//console.log(req);
	var data = req.body;
	console.log("ServeGame ")
	console.log(data);
	var tournamentID = data['tournamentID'];

	var gameID = data['tournamentID'];
	console.log('FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID]= data;
	initGame(gameID);
	//console.log(games);

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
	//console.log(games[ID]);
}

function Move (req, res){
	var data = req.body;
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
		console.log('curGame.curPlayerID= '+ curPlayerID+' ')

		if (PlayerTurn(gameID, userName) && playerExists(gameID, userName)) { // curGame.players[playerID] ){//&& curGame.players[playerID]  ---- check if player is regitered in tournament
			console.log('I am here ' + JSON.stringify(curGame.players));
			//curGame.scores[userName]+= pointsAdd;
			console.log("Player " + userName + " has " + curGame.scores[userName] + " points");
			//SwitchPlayer(curGame);
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

function getGameStatus(ID){
	return games[ID].status;
}

function tournamentIsValid(tournamentID, gameID){
	return games[gameID].status === PREPARED;//
}

function Answer(res, code){
	res.end(code);
	//console.log(write);//, write
	console.log("......................");//, write
}



function StartGame (req, res){
	var data = req.body;
	console.log("start game: " + JSON.stringify(data));
	var ID = data['tournamentID'];
	if (!games[ID]){
		var message = 'Cannot find tournament with ID='+ ID;
		//console.log(games);
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
		games[ID].tick= STANDARD_PREPARE_TICK_COUNT;
		//oneTournID = ID;
		games[ID].timer = setInterval(function() {prepare(ID)}, 1000);

		games[ID].userIDs = userIDs;
		//games[ID].socketRoom = io.of('/'+ID);
		console.log('Players');
		console.log(games[ID].players);

		sender.Answer(res, {result:'success', message:"Starting game:" + ID });
		console.log('Answered');
	}
	//res.end();
}
var oneTournID;
function prepare(gameID){
	if (games[gameID].tick>0){
		console.log(gameID);
		games[gameID].tick--;
		SendToRoom('/'+gameID, 'startGame', {ticks:games[gameID].tick} );
		//SendToRoom('/'+oneTournID, 'startGame', {ticks:games[oneTournID].tick} );

		//games[gameID].socketRoom.emit('');
	}
	else{
		console.log('Trying to stop timer');
		clearInterval(games[gameID].timer);
		console.log('Stopped timer');
		games[gameID].timer = setInterval(function() {update(gameID) }, UPDATE_TIME);
	}
}
function update(gameID){
	
	SendToRoom('/'+gameID, 'update', {opponentX:10, bX:10, bY:60});
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
var server = app.listen(5009, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var clients = [];

var io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('IO connection');
  //socket.join('/111');
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
  socket.on('event1', function(data){
    //console.log('io.on connection--> socket.on event1'); console.log(data);
    SendToRoom('/111', 'azz', 'LALKI', socket);
    //io.of('/111').emit('azz','LALKI');
  });
});

/*var tmr2 = setTimeout(function(){
  console.log(io.sockets.server.nsps['/111'].sockets);
}, 11000);*/

/*io.of('/111').on('connection', function(socket){
  console.log('ololo222');
  socket.on('event1', function(data){
    console.log('ololo111');
    console.log(data);
  })
})*/

function SendToRoom( room, event1, msg, socket){
	console.log('SendToRoom:' + room + ' ' + event1 + ' ');
	//console.log('Message:' + JSON.stringify(msg));
	io.of(room).emit(event1, msg);
	//console.log('Emitted');
}

//var server = require('./script');
//queryProcessor.getGamePort(curGameNameID)
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
