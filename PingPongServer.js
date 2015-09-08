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
	//console.log( 'app.use Movement');
	//console.log('Getting movement DATA!  APP');
	MoveHead(data);
	var gameID = data.gameID;
	res.json(games[gameID].gameDatas);

  	/*var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;

  	strLog('Movement of '+ userLogin + ' is: '+ JSON.stringify(movement));

  	Move(tournamentID, gameID, movement, userLogin);
  	res.json(games[gameID].gameDatas);*/

});

function MoveHead(data){
	var tournamentID = data.tournamentID;
  	var gameID = data.gameID;
  	var movement = data.movement;
  	var userLogin = data.login;

  	//strLog('Movement of '+ userLogin + ' is: '+ JSON.stringify(movement));

  	Move(tournamentID, gameID, movement, userLogin);
}

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
const STANDARD_PREPARE_TICK_COUNT = 5;
const UPDATE_TIME = 1000/50; //50 times per second = 20ms
const PREPARED = "PREPARED";


/*funcArray["/PauseGame"] = PauseGame;
funcArray["/AbortGame"] = AbortGame;
funcArray["/UnSetGame"] = UnSetGame;*/



var games = {
	count:0

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

			//var gameCur = games[gameID].gameDatas[playerID];
			//strLog(JSON.stringify(gameCur));
			
			//console.log();
			//console.log(gameID+'_' + userName);
			games[gameID].gameDatas[playerID].x = movement.x;
		}
		else{
			strLog('#####PLAYER DOESNT exist#####');
			console.log("Player " + userName + 
				" Not your turn! Player " + curGame.curPlayerID + " must play");
		}
		//CheckForTheWinner(tournamentID, gameID, userName);
	}
}

function playerExists(gameID, userName){
	var playerExistsVal = getGID(gameID, userName);// games[gameID].players.UIDtoGID[userName]; //userIDs[playerID];// games[gameID].players.UIDtoGID[playerID]
	//strLog('player ' + userName + 'in (' + gameID + ') exists= ' + playerExistsVal);
	
	/*if (!playerExistsVal){
		strLog('UID to GID list : ' + JSON.stringify(games[gameID].players.UIDtoGID));
	}*/
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
	//return val%2==0?'top':'bottom';
	return val%2==0?0:95;
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
			var speed = 0.4/4;
			//***********
			games[ID].gameDatas[playerID] = { x: 50, y: mod2(playerID), h: 5, w: 20, score:0 };
			games[ID].ball = {x:15, y:35, vy:-speed*2, vx:speed*8*0, r:3 };
			//***********
		}
		games[ID].tick = STANDARD_PREPARE_TICK_COUNT;
		games[ID].timer = setInterval(function() {prepare(ID)}, 1000);

		games[ID].userIDs = userIDs;

		games[ID].socketRoom = io.of('/'+ID);
		//var room = games[ID].socketRoom;
		games[ID].socketRoom.on('connection', function (socket){
			strLog('Room <' + ID + '> got new player');
			socket.on('movement', function (data){
				//strLog('Getting socketRoom socket.on Movement');
				MoveHead(data);
			});
		});

		console.log('Players');
		console.log(games[ID].players);

		sender.Answer(res, {result:'success', message:"Starting game:" + ID });
		console.log('Answered');
	}
	//res.end();
}

function prepare(gameID){
	if (games[gameID].tick>0){
		console.log(gameID);
		games[gameID].tick--;
		SendToRoom(gameID, 'startGame', {ticks:games[gameID].tick} );
	}
	else{
		console.log('Trying to stop timer');
		clearInterval(games[gameID].timer);
		console.log('Stopped timer');
		games[gameID].timer = setInterval(function() {update(gameID) }, UPDATE_TIME);
		//setTimeout( function(){ stream.end(); console.log('File closed');} , 15000 );
	}
}

function update(gameID){
	UpdateCollisions(gameID, gameID);
	SendToRoom(gameID, 'update', { ball: games[gameID].ball, gameDatas: games[gameID].gameDatas });
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

function FinishGame(ID, playerID){
	var gameID = ID;
	var tournamentID = ID;
	strLog("Game " + gameID + " in tournament " + tournamentID + " ends. " + playerID + " wins!!");
	games[ID].status = GAME_FINISH;
	var sortedPlayers = { 
		scores: Sort(games[ID].scores),
		gameID: ID,
		tournamentID:ID
	};
	//games[ID].
	/*sortedPlayers.scores = Sort(games[ID].scores);//games[ID].scores;// Sort(games[ID].scores);
	sortedPlayers.gameID = ID;
	sortedPlayers.tournamentID = ID;// games[ID].tournamentID;*/
	clearInterval(games[gameID].timer);
	strLog('FIX IT!!! GAMEID=tournamentID');
	sender.sendRequest("FinishGame", sortedPlayers , '127.0.0.1', 
			queryProcessor.getPort('GameFrontendServer'), null, sender.printer );
}
function Sort(players){
	return players;
}

function ScoreOfPlayer(gameID, i) {
	return games[gameID].scores[getUID(gameID, i)];//games[gameID].scores[UID];
}

function CheckForTheWinner(tournamentID, gameID) {
	for (var i = 0; i < 2; i++) {
		if (ScoreOfPlayer(gameID, i) == 3){ 
			strLog("Game " + gameID + " in tournament " + tournamentID + " ends. " + playerID + " wins!!");
			FinishGame(gameID);
		}
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
});

function incr(gameID, i){
	var userName = getUID(gameID, i);
	var game = games[gameID];

	strLog('increment score of ' + userName + ' in game ' + gameID);

	game.scores[userName]++;
	game.gameDatas[i].score++;

	if( game.scores[userName] == 3){ 
		FinishGame(gameID, userName);
	}
	else{
		strLog('Drag me!');
		game.ball.x = 50;
		game.ball.y = 50;
	}
}

function UpdateCollisions(tournamentID,gameID){
	var game = games[gameID];
	var gameDatas = game.gameDatas;
	// Collision with paddles
	/*p0 = paddles[1];
	p1 = paddles[2];*/
	var ball = game.ball;

	/*var ballRadius = 2;
	ball.r = ballRadius;*/
	//strLog('Movement : vy=' + ball.vy + ' vx =' + ball.vx + ";; \n" + JSON.stringify(ball));
	ball.y += ball.vy;
	ball.x += ball.vx;
	strLog('Result : y=' + ball.y + ' x=' + ball.x);

	H=100;
	W=100;
	//SICK!

	var p0 = gameDatas[0];
	var p1 = gameDatas[1];

	// If the ball strikes with paddles,
	// invert the y-velocity vector of ball,
	// increment the points, play the collision sound,
	// save collision's position so that sparks can be
	// emitted from that position, set the flag variable,
	// and change the multiplier
	var flag = 0;




	if(collides(ball, p0, 'p0')) {
		flag = 1;
		strLog("# Collision with p0, MOTHERFUCKER! \n " + JSON.stringify(ball) + " " + JSON.stringify(p0) );
	}
	
	
	else if(collides(ball, p1, 'p1')) {
		flag = 1;
		strLog("# Collision with p1, MOTHERFUCKER! \n " + JSON.stringify(ball) + " " + JSON.stringify(p1) );
	} 
	
	else {
		//strLog('No collision');
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		//strLog('ball.y=' + ball.y + ' ball.r=' + ball.r);

		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			incr(gameID, 1);
			
			//gameDatas[1].score++;
			//CheckForTheWinner(tournamentID, gameID);
			//gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			incr(gameID, 0);
			//game.scores[getUID(gameID, 0)]++;
			//CheckForTheWinner(tournamentID, gameID);
			//gameDatas[0].score++;
			//gameOver();
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > W) {
			strLog ('# HIT Right');
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x - ball.r < 0) {
			strLog ('# HIT Left');
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
}

function collides(b, p, padName) {
	if (padName=='p0'){
		strLog('padName: ' + padName);
		strLog('b.x: ' + b.x + '; b.y: ' + b.y + '; b.r: ' + b.r); 
		strLog('p.x: ' + p.x + '; p.y: ' + p.y + '; p.w: ' + p.w + '; p.h: ' + p.h);
	}
	if(b.x + b.r >= p.x - p.w/2 && b.x - b.r <=p.x + p.w/2) {
		//strLog('Fits width');
		if(b.y >= (p.y - p.h) && p.y > 0){
			//paddleHit = 1;
			
			b.vy = -b.vy;
			b.y = p.y - p.h;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			//paddleHit = 2;

			b.vy = -b.vy;
			b.y = p.h + b.r;
			return true;
		}
		
		else return false;
	}
	else{
		strLog('DOESNT fit width');
	}
}

//Do this when collides == true
/*function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		//particlePos.y = ball.y + ball.r;
		//multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		//particlePos.y = ball.y - ball.r;
		//multiplier = 1;	
	}
	
	flag = 1;
}*/


//Function to check collision between ball and one of
//the paddles
/*function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

//Do this when collides == true
function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		//particlePos.y = ball.y + ball.r;
		//multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		//particlePos.y = ball.y - ball.r;
		//multiplier = 1;	
	}
	
	flag = 1;
}*/



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

function SendToRoom( room, event1, msg, socket){
	//console.log('SendToRoom:' + room + ' ' + event1 + ' ');
	//strLog('SendToRoom:' + room + ' ' + event1 + ' ' + JSON.stringify(msg));
	//console.log('Send Message:' + JSON.stringify(msg));
	//strLog('Trying to send to room ' + room +' event= '+ event1 + ' msg= ' + JSON.stringify(msg));

	games[room].socketRoom.emit(event1, msg);
	//strLog('Я отправиль...');
	
	//io.of(room).emit(event1, msg);
	//console.log('Emitted');
}
