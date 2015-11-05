var gs = require('../gameModule');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;
var FastLog = function(){}// gs.FastLog;

var UpdPeriod = 1000/50; //50 times per second = 20ms;

var fs = require('fs');
var file = fs.readFileSync('./configs/ppConfigs.txt', "utf8");
console.log(file);
var gameConfigs =  JSON.parse(file);


app.post('/Sender', function (req, res){
	strLog('POST Sender ' + JSON.stringify(req.body));
	res.json({obj:'lul'});
});

strLog('pp Server starts!!');

function mod2(val){
	//return val%2==0?'top':'bottom';
	if (val>0){ return 95; }
	else { return 0; }
}

function Init(gameID, playerID){
	var horiz = gameConfigs.horizontal||0;

	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);
	var speed = gameConfigs.speed || 0.4;
	//***********
	games[gameID].gameDatas[playerID] = { x: 50, y: mod2(playerID), h: 5, w: 20, score:0 };
	games[gameID].ball = {x:15, y:35, vy:-speed, vx:speed*horiz, r:3 };
	//***********
}

function getParameters(gameID, userName){
	strLog('getParameters');
	console.log(games[gameID].userIDs);
	strLog(JSON.stringify(games[gameID].userIDs));
	return games[gameID].userIDs;
}

function AsyncUpdate(gameID){
	UpdateCollisions(gameID, gameID);
	var ball = games[gameID].ball || null;
	var datas = games[gameID].gameDatas || null;
	send(gameID, 'update', { ball: ball, gameDatas: datas });
}

function Action(gameID, playerID, movement, userName){
	games[gameID].gameDatas[playerID].x = movement.x;
}

gs.StartGameServer({
	port:5009,
	gameName:'PingPong',
	gameTemplate: 'game'
}, Init, AsyncUpdate, Action, UpdPeriod, getParameters);

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
	//FastLog('Movement : vy=' + ball.vy + ' vx =' + ball.vx + ";; \n" + JSON.stringify(ball));
	ball.y += ball.vy;
	ball.x += ball.vx;
	//FastLog('Result : y=' + ball.y + ' x=' + ball.x);

	H=100;
	W=100;
	//SICK!

	var p0 = gameDatas[0];
	var p1 = gameDatas[1];

	var flag = 0;


	if (ball.vy>0 && ball.y > H*0.95){
		if (fitsWidth(ball, p1)){
			ball.vy *= -1;
		}
		else{
			incr(gameID, 0);
			ball.y = ball.x = 50;
		}

	}
	else if (ball.vy<0 && ball.y< H*0.05){
		if (fitsWidth(ball, p0)){
			ball.vy *= -1;
		}
		else{
			incr(gameID, 1);
			ball.y = ball.x = 50;
		}

	}
	else{
		if(ball.x + ball.r > W) {
			FastLog ('# HIT Right');
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x - ball.r < 0) {
			FastLog ('# HIT Left');
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
}


function fitsWidth(ball, pad){
	var a = (ball.x + ball.r >= pad.x - pad.w/2 && ball.x - ball.r <= pad.x + pad.w/2);
	return a;
}

function fitsHeight(ball, pad){
	var a = ball.y > pad.y - 3 && ball.y < pad.y + pad.h ;
}

function SetGame (req, res){
	var data = req.body;
	strLog("SetGame PingPong Server", 'Games');
	//strLog(data);
	var gameID = data['tournamentID'];
	strLog('****FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID] = data;
	games[gameID].tournamentID = data['tournamentID'];
	res.end("Game " + gameID + " Is Set");
}