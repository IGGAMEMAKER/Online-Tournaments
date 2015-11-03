var sender = require('./requestSender');
var express = require('express');
var app = express();
//var gameServer = require('../gameServer');
var gameServerType = 'ASync';
var serverName = "GameServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var jade = require('jade');
app.use(express.static('./frontend/public'));
//app.use(express.static('games'));
app.use(express.static('./frontend/games/PingPong'));
app.use(express.static('./frontend/games/Questions'));

//var gameModule = require('./gameModule');

var strLog = sender.strLog;

var Stats = sender.Stats;

var fs = require('fs');
const GAME_FINISH = "GAME_FINISH";
const tournamentFAIL="tournamentFAIL";

const PREPARED = "PREPARED";

var UPDATE_TIME = 3000;

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
/*app.use(function(req,res,next){
    strLog(serverName + ': Request/' + req.url);
    next();
});*/

var handler = require('./errHandler')(app, strLog, serverName);
/*app.use(function(err, req, res, next){
  console.error('ERROR STARTS!!');
  //console.error(err.stack);
  //console.error('-------------');
  Log('Error happened in ' + serverName + ' : ' + err, 'Err');
  Log('Description ' + serverName + ' : ' + err.stack, 'Err');
  console.error(err);
  console.error('CATCHED ERROR!!!! IN: ' + req.url);
  res.status(500).send('Something broke!');
  next(err);
});*/


app.set('views', ['./frontend/views', './frontend/games/PingPong', './frontend/games/Questions']);
app.set('view engine', 'jade');

app.all('/Game', RenderGame);

//app.all('/SetGame', SetGame);
app.all('/StartGame', StartGame);
app.all('/ServeGames', ServeGames);
app.all('/GetGames', GetGames);

app.get('/Alive', function (req, res){
	res.end('GET METHOD WORKED');
});
app.get('/Move', function (req, res){
	res.end('Move GET works');
});

var OK = {result: 'OK'};
var Fail = {result: 'Fail'};

app.post('/IsRunning', function (req, res) {
	var data = req.body;
	if (data && data.tournamentID && isRunning(data.tournamentID)){
		//strLog('gameModule: ' + 'OK ' + data.tournamentID, 'chk');
		sender.Answer(res, {result:'OK', tournamentID: data.tournamentID});
	}
	else{
		strLog('gameModule: ' + 'NOT RUNNING ' + data.tournamentID, 'chk');
		sender.Answer(res, Fail);
	}
})

app.post('/StopGame', function (req, res){
	var tournamentID = req.body.tournamentID;
	strLog('StopGame ' + tournamentID, 'Games');
	sender.Answer(res, OK);
	stopGame(tournamentID);
});

function SaveGameResults(results){
	var gameID = results.gameID;
	var tournamentID = results.tournamentID;
	LogToFile('Logs/Games/'+ gameID, results.scores);
}

function LogToFile(filename, text){
	fs.writeFile(filename, JSON.stringify({time: new Date, text:text}), function (err){
		if (err){
			strLog('err: ' + JSON.stringify(err), 'GameResults');
		}
	})
}

function FastLog(text){
	var time = new Date();
	//strLog(time);
	
	/*fs.appendFile(getOption('gameLog'), '\r\n' + time+' ' + text + "\n", function (err) {
		if (err) strLog('err: ' + JSON.stringify(err));
	});*/

	//stream.write(text);
	//strLog('FastLog: ' + text);
}

app.post('/Move', function (req,res){
	var data = req.body;
	MoveHead(data);
	var gameID = data.gameID;
	res.json(games[gameID].gameDatas);
});

function MoveHead(data){
	var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;
  	//strLog('Movement of '+ userLogin + ' is: '+ JSON.stringify(movement));
  	Move(tournamentID, gameID, movement, userLogin);
}

var OPTIONS = {};
var DEFAULT = {
	gameName:'Unknown',
	gameLog:'GMLog.txt',
	gameTemplate:'game'
};


/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/

//DEFAULT.;

var games = { };
var rooms = { };
var timers = { };

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

//console.log(configs)
const STANDARD_PREPARE_TICK_COUNT = 5;
var gameHost = configs.gameHost? configs.gameHost : '127.0.0.1';
var gamePort = configs.gamePort? configs.gamePort : '5010';
var BEFORE_TOURNAMENT_START_DELAY = configs.delay || STANDARD_PREPARE_TICK_COUNT;


function RenderGame (req, res){
	console.log(__dirname);
	var tID = req.query.tournamentID;
	var login = req.body.login;
	/*Log(req.query);
	Log(req.body);*/
	console.log(req.query.tournamentID);
	if ( isNaN(tID)){// || !games[tID] 
		res.status(404);
		res.type('txt').send('Game Not found');
	}
	else{
		res.render(getOption('gameTemplate') , {//'qst_game'  ///  OPTIONS.gameTemplate: ? OPTIONS.gameTemplate : gameTemplate
			tournamentID:tID,
			gameHost:gameHost,
			gamePort:port,
			login:login,
			parameters: getParameters?getParameters(tID, login) : ''
		});
	}

	//res.render('/games/PingPong/game', {tournamentID:111} );
	//res.sendFile(__dirname + '/games/PingPong/game.html');//, {tournamentID:111}, function(err){console.log(err); });
}



function getOption(optionName){
	return OPTIONS[optionName] ? OPTIONS[optionName] : DEFAULT[optionName];
}

function GetGames ( req,res){
	var data = req.body;
	sender.Answer(res, games);
}

strLog('gameModule starts!!');

function ServeGames (req, res){
	//strLog('Game Server serves games');
	var data = req.body;
	var tournamentID = data['tournamentID'];

	var gameID = data['tournamentID'];
	//strLog('FIX IT!!!!   var gameID = data[tournamentID];','shitCode');

	games[gameID]= data;
	initGame(gameID);
	//strLog(games);

	//res.write("serving games");
	res.end();
}

var INIT = 'INIT';
function initGame(ID){

	games[ID].curPlayerID=1;
	
	//strLog('initGame: totalPlayerCount = ' + games[ID].goNext[0]);
	games[ID].players = {};
	games[ID].players.count=games[ID].goNext[0];
	games[ID].status = INIT;

	/*for (i=0;i<games[ID].players.count;++i){
		games[ID].players[i]=0;
	}*/
	//strLog(games[ID]);
}

function Move( tournamentID, gameID, movement, userName){//Must get move from Real GameServer
	if (tournamentIsValid(tournamentID, gameID))
	{
		if (playerExists(gameID, userName)>=0) { 
			var playerID = getGID(gameID,userName);
			
			Action(gameID, playerID, movement, userName);//GET ACTION FROM GAMESERVER
		}
		else{
			strLog('#####PLAYER DOESNT exist#####');
			strLog("Player " + userName + 
				" Not your turn! Player " + games[gameID].curPlayerID + " must play");
		}
	}
}

function playerExists(gameID, userName){
	//if (UPDATE_TIME>100){
	//	strLog('playerExists function: ' + gameID +' ' + userName);
	//}
	var playerExistsVal = getGID(gameID, userName);// games[gameID].players.UIDtoGID[userName]; //userIDs[playerID];// games[gameID].players.UIDtoGID[playerID]
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
	//strLog("......................");
}

function isRunning(gameID){
	var isr = games[gameID] && games[gameID].isRunning;
	if (!isr) strLog('game ' + gameID + ' isRunning= ' + isr, 'chk');
	return isr;
}

/*function CustomInit(gameID){

}*/
var customInit;
var Action;
//var customMove

function setRoom(ID){
	rooms[ID] = {};
	rooms[ID].socketRoom = io.of('/'+ID);

	//var room = games[ID].socketRoom;
	rooms[ID].socketRoom.on('connection', function (socket){
		strLog('Room <' + ID + '> got new player');

		socket.on('movement', function (data){
			//strLog('Getting socketRoom socket.on Movement');
			/*if (UPDATE_TIME > 100) { Stats('OpenedTournament', {tid:ID, gameID:ID, login:data.login||null }); }
			else{

			}*/
			MoveHead(data);
		});
	});
}

function PrepareAndStart(ID, userIDs, res){
	strLog('PrepareAndStart tournament ' + ID, 'Tournaments');
	games[ID].status=PREPARED;
	//games[ID].players = {};
	games[ID].players.UIDtoGID = {};

	games[ID].scores = {};

	//***********
	games[ID].gameDatas = {};
	//***********

	// Fill users
	var i=0; //var userIDs = data['logins']; //strLog(userIDs);
	for (var playerID in userIDs){
		games[ID].players.UIDtoGID[userIDs[playerID]] = i;
		games[ID].scores[userIDs[playerID]] = 0;
		i++;			
		
		//***********
		customInit(ID, playerID);
		//***********
	}
	games[ID].userIDs = userIDs;
	//

	setRoom(ID);

	games[ID].tick = BEFORE_TOURNAMENT_START_DELAY;
	timers[ID] = setInterval(function() {prepare(ID)}, 1000);


	//strLog('Players ' + JSON.stringify(games[ID].players), 'Tournaments');
	sender.Answer(res, {result:'success', message:"Starting game:" + ID });
}

function StopTMR(TMR_ID){
	strLog('StopTMR : ' + TMR_ID, 'Timer');
	clearInterval(timers[TMR_ID]);
}

function GameIsSet(ID){
	return games[ID] && (games[ID].status==INIT || games[ID].status==PREPARED);
}

function StartGame (req, res){
	var data = req.body;
	strLog("start game: " + JSON.stringify(data), 'Games');
	var ID = data['tournamentID'];
	var force = data.force;
	if (GameIsSet(ID)){
		if (force || !isRunning(ID)){
			if (force) { 
				strLog('I am forced to start tournament ' + ID + ' ((( force=' + force, 'Tournaments');
				stopGame(ID);
			}
			else { 
				strLog('It was not running ' + ID, 'Tournaments'); 
			}
			strLog('You need to check if the game was finished', 'shitCode');

			PrepareAndStart(ID, data.logins, res);

			/*fs.readFile('Logs/Games/' + ID, function (err, fileData){
				if (err){
					strLog('File ./Logs/Games/'+ID + ' not found, so I am starting game!');
					
				}
				else{
					//console.log(file);
					var gameResult =  JSON.parse(fileData);
					strLog('tournament ' + ID + ' was finished! ', 'WARN');
					sender.Answer(res, Fail);
					ManualFinishGame(ID, gameResult);
				}
			});	*/
		}
		else{
			strLog('Game ' + ID + ' is running normally and there is no reason to restart it', 'Tournaments');
			sender.Answer(res, Fail);
		}
	}
	else{
		strLog('Game ' + ID + ' was not set, nothing to do with it :)', 'Tournaments');
		sender.Answer(res, Fail);
	}
	/*var message = 'Cannot find tournament with ID='+ ID;
	strLog(games);
	strLog(message, 'ASD');*/
	//sender.Answer(res, {result:'fail', message:message });

	/*if (!games[ID] ){
		var message = 'Cannot find tournament with ID='+ ID;
		strLog(games);
		strLog(message, 'ASD');
		sender.Answer(res, {result:'fail', message:message });
	}
	else{
		if (!isRunning(ID) || games[ID] == null){
			PrepareAndStart(ID, data['logins']);
		}
		else{
			strLog('I am running already!!! ' + ID, 'ASD');
		}
	}*/
}

function prepare(gameID){
	if (games[gameID].tick>0){
		strLog(gameID);
		games[gameID].tick--;
		SendToRoom(gameID, 'startGame', {ticks:games[gameID].tick} );
		games[gameID].isRunning=true;
	}
	else{
		strLog('Trying to stop timer');
		StopTMR(gameID);
		strLog('Stopped timer');
		timers[gameID] = setInterval(
			function() {
				games[gameID].isRunning=true;
				customUpdate(gameID);
			}, UPDATE_TIME);//update(gameID)
	}
}


function getUID(gameID, GID){//GID= GamerID, UID= UserID
	return games[gameID].userIDs[GID];
}

function getGID(gameID, UID){//GID= GamerID, UID= UserID
	/*strLog('UID=' + UID);
	strLog(games[gameID].players.UIDtoGID);*/
	return games[gameID].players.UIDtoGID[UID];
}

//strLog('CHANGE APPLIED', 'ASD');

function stopGame(ID){
	if (games[ID]){
		games[ID].isRunning = false;
		StopTMR(ID);
	}
	else{
		strLog('stopGame that DOES NOT exist : ' + ID, 'WARN');
	}
	//games[ID] = null;

	/*setTimeout(function(){
		strLog('games.length ' + games.length, 'ASD');
		strLog('gameModule... stopGame : ' + ID);
		games[ID].isRunning = false; 
	}, UPDATE_TIME+100);*/
	
	SendToRoom(ID, 'finish', { winner:'Error', players: {} });
	
	strLog('FIX IT!!! GAMEID=tournamentID','shitCode');
}

function ManualFinishGame(tournamentID, gameResult){
	sender.sendRequest("FinishGame", gameResult , '127.0.0.1', 
			'GameFrontendServer', null , sender.printer);
}

function FinishGame(ID, winnerID){ //winnerID== null means, that Game did not finish properly and we retry to do this
	var gameID = ID;
	var tournamentID = ID;
	strLog("Game " + gameID + " in tournament " + tournamentID + " ends. " + winnerID + " wins!!", 'Tournaments');
	games[ID].status = GAME_FINISH;
	var gameResult = { 
		scores: Sort(games[ID].scores),
		gameID: ID,
		tournamentID:ID
	};
	SendToRoom(ID, 'finish', { winner:winnerID, players: gameResult });
	StopTMR(gameID);
	strLog('FIX IT!!! GAMEID=tournamentID','shitCode');
	
	SaveGameResults(gameResult);

	sender.sendRequest("FinishGame", gameResult , '127.0.0.1', 
			'GameFrontendServer', gameResult , SendGameResultsHandler);
	setTimeout(function(){
		delete games[gameID];
	}, 10000);
	
}

var pendingGames={};
strLog('On GameServer crash save pendingGames object to the file ; read this file to pendingGames object after restart and try to send gameResults again', 'WARN');

function SendGameResultsHandler(error, response, body, gameResult){
	if (error) { 
		strLog('SendGameResultsHandler error: ' + JSON.stringify(error) + ' while sending ' + JSON.stringify(gameResult), 'Tournaments'); 
		pendingGames[gameResult.gameID] = gameResult;
		return;
	}
	if (body=='OK'){
		delete pendingGames[gameResult.gameID];
		pendingGames[gameResult.gameID] = null;
	}
}

function Sort(players){
	return players;
}

function ScoreOfPlayer(gameID, i) {
	return games[gameID].scores[getUID(gameID, i)];//games[gameID].scores[UID];
}

var io;
var host;
var port;
var gameName;
var getParameters;
function StartGameServer(options, initF, updateF, actionF, updateTime, parameterF){
	//if (options.port)
	strLog('Trying to StartGameServer: ' + options.gameName);
	if (options && options.port && options.gameName && initF && actionF){
		customInit = initF;
		customUpdate = updateF;
		Action = actionF;
		getParameters = parameterF;

		UPDATE_TIME = updateTime;
		gameName = options.gameName;
		gameTemplate = options.gameTemplate;
		OPTIONS = options;

		var server = app.listen(options.port, function () {
		  host = server.address().address;
		  port = server.address().port;
		  //console.log('listening');
		  strLog(getOption('gameName') + ' game server listening at http://'+ host+':'+ port);
		});
		io = require('socket.io')(server);
		Initialize();
	}
}

/*function incr(gameID, i){
	var userName = getUID(gameID, i);
	var game = games[gameID];

	strLog('increment score of ' + userName + ' in game ' + gameID);

	game.scores[userName]++;
	game.gameDatas[i].score++;

	if( game.scores[userName] == 3){ 
		FinishGame(gameID, userName);
	}
	else{
		incrAction();
	}
}*/

function SendToRoom( room, event1, msg){
	if (UPDATE_TIME>100){
		strLog('SendToRoom:' + room + '/'+event1+'/'+ JSON.stringify(msg));
	}

	rooms[room].socketRoom.emit(event1, msg);
	//FastLog('Я отправиль...');
}
function Initialize(){
	strLog('gameModule Initialize');
	sender.sendRequest("GameServerStarts", {gameName:gameName} , '127.0.0.1', 
			'GameFrontendServer', null, sender.printer );
}


this.StartGameServer = StartGameServer;
this.app = app;
this.games = games;
this.SendToRoom = SendToRoom;
this.strLog = strLog;
this.getUID = getUID;
this.FinishGame = FinishGame;
this.FastLog = FastLog;