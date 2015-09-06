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



var fs = require('fs');


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.all('/SetGame', SetGame);
app.all('/StartGame', StartGame);
app.all('/ServeGames', ServeGames);
app.all('/GetGames', GetGames);

app.get('/Alive', function (req, res){
	res.end('GET METHOD WORKED');
});
app.get('/Move', function (req, res){
	res.end('Move GET works');
});
app.post('/Sender', function (req, res){
	strLog('POST Sender ' + JSON.stringify(req.body));
	res.json({obj:'lul'});
});

app.post('/Move', function (req,res){
	var data = req.body;
	console.log( 'app.use Movement');
	console.log('Getting movement DATA!  APP');
  	var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;

  	strLog('Movement of '+ userLogin + ' is: '+ JSON.stringify(movement));

  	Move(tournamentID, gameID, movement, userLogin);
  	res.json(games[gameID].gameDatas);
});

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
const STANDARD_PREPARE_TICK_COUNT = 10;
const UPDATE_TIME = 1000*50/50; //50 times per second = 20ms
const PREPARED = "PREPARED";


/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/



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

function strLog(text){
	var time = new Date();
	console.log(time);
	fs.appendFile('message.txt', time+' ' + text + "\n", function (err) {
		if (err) console.log('err: ' + JSON.stringify(err));
	});
	//stream.write(text);
	console.log('strLog: ' + text);
}

function Move( tournamentID, gameID, movement, userName){
	if (tournamentIsValid(tournamentID, gameID))
	{
		if (playerExists(gameID, userName)>=0) { // curGame.players[playerID] ){//&& curGame.players[playerID]  ---- check if player is regitered in tournament
			//console.log('I am here ' + JSON.stringify(curGame.players));
			//curGame.scores[userName]+= pointsAdd;
			//console.log("Player " + userName + " has " + curGame.scores[userName] + " points");
			//SwitchPlayer(curGame);
			//console.log(JSON.stringify(movement));

			var playerID = getGID(gameID,userName);
			//strLog('Movement of '+ userName + ' with plID=' + playerID+' is: '+ JSON.stringify(movement));
			
			//console.log('plID = ' + JSON.stringify(playerID));

			var gameCur = games[gameID].gameDatas[playerID];
			strLog(JSON.stringify(gameCur));
			//console.log();
			//console.log(gameID+'_' + userName);
			games[gameID].gameDatas[playerID].padX = movement.x;
		}
		else{
			console.log("Player " + userName + 
				" Not your turn! Player " + curGame.curPlayerID + " must play");
		}
		//CheckForTheWinner(tournamentID, gameID, userName);
	}
}

function playerExists(gameID, userName){
	var playerExistsVal = getGID(gameID, userName);// games[gameID].players.UIDtoGID[userName]; //userIDs[playerID];// games[gameID].players.UIDtoGID[playerID]
	strLog('player ' + userName + 'in (' + gameID + ') exists= ' + playerExistsVal);
	if (!playerExistsVal){
		strLog('UID to GID list : ' + JSON.stringify(games[gameID].players.UIDtoGID));
	}
	//console.log('playerExists:'+playerExistsVal);
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

function mod2(val){
	return val%2==0?'top':'bottom';
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

		//***********
		games[ID].gameDatas = {};
		//***********


		var i=0;
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

			//***********
			games[ID].gameDatas[playerID] = { padX:50, padY: mod2(playerID), score:0 };
			games[ID].ball = {x:15, y:15};
			//***********
		}
		games[ID].tick = STANDARD_PREPARE_TICK_COUNT;
		games[ID].timer = setInterval(function() {prepare(ID)}, 1000);

		games[ID].userIDs = userIDs;

		games[ID].socketRoom = io.of('/'+ID);
		//var room = games[ID].socketRoom;
		games[ID].socketRoom.on('connection', function (socket){
			strLog('Room <' + ID + '> got new player');
		})
		games[ID].socketRoom.on('movement', function (data) {
			strLog('Getting movement DATA!2');
		  	var tournamentID = data.tournamentID;
		  	var gameID = data.gameID;
		  	var movement = data.movement;
		  	var userLogin = data.login;

		  	Move(tournamentID, gameID, movement, userLogin);
		})

		//SetGameListenerRoom(ID);

		console.log('Players');
		console.log(games[ID].players);

		sender.Answer(res, {result:'success', message:"Starting game:" + ID });
		console.log('Answered');
	}
	//res.end();
}

function SetGameListenerRoom(ID){//gameID
	/*var room = games[ID].socketRoom;
	room.on('connection', function (socket){
		strLog('Room <' + ID + '> got new player');
	});

	room.on('movement', function (data) {
		strLog('Getting movement DATA!2');
	  	var tournamentID = data.tournamentID;
	  	var gameID = data.gameID;
	  	var movement = data.movement;
	  	var userLogin = data.login;

	  	Move(tournamentID, gameID, movement, userLogin);
	});*/
	/*var room = games[ID].socketRoom;
	room.on('connection', function (socket){
		strLog('Room <' + ID + '> got new player');
	});
	room.on('movement', function (data) {
		strLog('Getting movement DATA!2');
	  	var tournamentID = data.tournamentID;
	  	var gameID = data.gameID;
	  	var movement = data.movement;
	  	var userLogin = data.login;

	  	Move(tournamentID, gameID, movement, userLogin);
	});*/
}

function prepare(gameID){
	if (games[gameID].tick>0){
		console.log(gameID);
		games[gameID].tick--;
		SendToRoom(gameID, 'startGame', {ticks:games[gameID].tick} );

		//games[gameID].socketRoom.emit('');
	}
	else{
		console.log('Trying to stop timer');
		clearInterval(games[gameID].timer);
		console.log('Stopped timer');
		games[gameID].timer = setInterval(function() {update(gameID) }, UPDATE_TIME);
		//setTimeout( function(){ stream.end(); console.log('File closed');} , 15000 );
	}
}

/*var fs = require('fs');
var stream = fs.createWriteStream("my_file.txt");
stream.once('open', function(fd) {
  stream.write("My first row\n");
  stream.write("My second row\n");
  stream.end();
});*/

function update(gameID){

	//SendToRoom('/'+gameID, 'update', { opponentX:10, bX:10, bY:60, gameDatas:games[gameID].gameDatas});
	//SendToRoom('/'+gameID, 'update', { opponentX:10, bX:games[gameID].ball.x, bY:games[gameID].ball.y, gameDatas:games[gameID].gameDatas });
	SendToRoom(gameID, 'update', { ball: games[gameID].ball, gameDatas: games[gameID].gameDatas });
	games[gameID].ball.x+=1;
	//games[gameID].ball.y+=2;
}

/*function getOpponentGID(gameID, userName, count){
	if (count)
}*/

function getUID(gameID, GID){//GID= GamerID, UID= UserID
	return games[gameID].userIDs[GID];
}

function getGID(gameID, UID){//GID= GamerID, UID= UserID
	/*console.log('UID=' + UID);
	console.log(games[gameID].players.UIDtoGID);*/
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
    console.log('io.on connection--> socket.on event1'); console.log(data);

    //SendToRoom('/111', 'azz', 'LALKI', socket);
    //io.of('/111').emit('azz','LALKI');
  });
  /*socket.on('movement', function(data){
  	console.log('Getting movement DATA!1');
  	var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;
  	strLog('Movement of '+ userLogin + ' is: '+ JSON.stringify(movement));

  	Move(tournamentID, gameID, movement, userLogin);
  });*/

});

/*var specialRoom = io.of('/Special')
	.on('connection', function(socket){
		strLog('/Special connection');

		socket.emit('event2', {data2:'specialRoom message'} );
		socket.on('echo', function (msg){
			strLog('ECHO Message: ' + JSON.stringify(msg));
			//socket.emit('event2', {data2:'specialRoom ECHO message!!'} );
		})
	})
	.on('echo', function (msg){
		strLog('Got echo!!');
		console.log(JSON.stringify(msg));
	});*/

/*var specialRoom = io.of('/Special');

	specialRoom.on('connection', function(socket){
		strLog('/Special connection');

		socket.emit('event2', {data2:'specialRoom message'} );
		socket.on('echo', function (msg){
			strLog('ECHO Message: ' + JSON.stringify(msg));
			//socket.emit('event2', {data2:'specialRoom ECHO message!!'} );
		})
	})
	specialRoom.on('echo', function (msg){
		strLog('Got echo!!');
		console.log(JSON.stringify(msg));
	});
setTimeout(function() {specialRoom.emit('event3', { asd:'TIMEOUT SEND FROM ROOM'} ) } , 3000 );*/

/*io.on('movement', function(data){
  	console.log('Getting movement DATA!2');
  	var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;

  	Move(tournamentID, gameID, movement, userLogin);
  });*/

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
	//console.log('SendToRoom:' + room + ' ' + event1 + ' ');
	//strLog('SendToRoom:' + room + ' ' + event1 + ' ' + JSON.stringify(msg));
	//console.log('Send Message:' + JSON.stringify(msg));
	//strLog('Trying to send to room ' + room +' event= '+ event1 + ' msg= ' + JSON.stringify(msg));
	//console.log('00000000000000000000000000000000000');
	games[room].socketRoom.emit(event1, msg);
	//strLog('Я отправиль...');
	
	//io.of(room).emit(event1, msg);
	//console.log('Emitted');
}

//var server = require('./script');
//queryProcessor.getGamePort(curGameNameID)
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
