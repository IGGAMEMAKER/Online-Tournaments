var gs = require('../gameModule');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;
var FastLog = function(){}// gs.FastLog;

var UpdPeriod = 1000/50; //50 times per second = 20ms;

app.post('/Sender', function (req, res){
	strLog('POST Sender ' + JSON.stringify(req.body));
	res.json({obj:'lul'});
});

strLog('pp Server starts!!');

function mod2(val){
	//return val%2==0?'top':'bottom';
	if (val>0){
		return 95;
	}
	else {
		return 0;
	}
}

function Init(gameID, playerID){
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);
	var speed = 0.4/2;
	//***********
	games[gameID].gameDatas[playerID] = { x: 50, y: mod2(playerID), h: 5, w: 20, score:0 };
	games[gameID].ball = {x:15, y:35, vy:-speed*2, vx:speed*8*0, r:3 };
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
	send(gameID, 'update', { ball: games[gameID].ball, gameDatas: games[gameID].gameDatas });
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
	/*
	if(collides(ball, p0, 'p0')) {
		flag = 1;
		FastLog("# Collision with p0, MOTHERFUCKER! \n " + JSON.stringify(ball) + " " + JSON.stringify(p0) );
	}
	
	
	else if(collides(ball, p1, 'p1')) {
		flag = 1;
		FastLog("# Collision with p1, MOTHERFUCKER! \n " + JSON.stringify(ball) + " " + JSON.stringify(p1) );
	} 
	
	else {
		//FastLog('No collision');
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		//FastLog('ball.y=' + ball.y + ' ball.r=' + ball.r);

		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			incr(gameID, 1);
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			incr(gameID, 0);
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
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
	}*/
}

function fitsWidth(ball, pad){
	var a = (ball.x + ball.r >= pad.x - pad.w/2 && ball.x - ball.r <= pad.x + pad.w/2);
	return a;
}

function fitsHeight(ball, pad){
	var a = ball.y > pad.y - 3 && ball.y < pad.y + pad.h ;
}

function collides(b, p, padName) {
	//if(b.x + b.r >= p.x - p.w/2 && b.x - b.r <= p.x + p.w/2) {
	if (fitsWidth(b,p) ){
		//FastLog('Fits width');
		if(b.y >= (p.y - p.h) && p.y > 0){
			//paddleHit = 1;
			
			b.vy = -b.vy;
			b.y = p.y - p.h;

			FastLog('padName: ' + padName);
			FastLog('b.x: ' + b.x + '; b.y: ' + b.y + '; b.r: ' + b.r); 
			FastLog('p.x: ' + p.x + '; p.y: ' + p.y + '; p.w: ' + p.w + '; p.h: ' + p.h);

			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			//paddleHit = 2;

			b.vy = -b.vy;
			b.y = p.h + b.r;

			FastLog('padName: ' + padName);
			FastLog('b.x: ' + b.x + '; b.y: ' + b.y + '; b.r: ' + b.r); 
			FastLog('p.x: ' + p.x + '; p.y: ' + p.y + '; p.w: ' + p.w + '; p.h: ' + p.h);

			return true;
		}
		
		else return false;
	}
	else{
		FastLog('DOESNT fit width');
	}
}
/*function getOpponentGID(gameID, userName, count){
	if (count)
}*/

/*function CheckForTheWinner(tournamentID, gameID) {
	for (var i = 0; i < 2; i++) {
		if (ScoreOfPlayer(gameID, i) == 3){ 
			strLog("Game " + gameID + " in tournament " + tournamentID + " ends. " + playerID + " wins!!");
			FinishGame(gameID);
		}
	}
}*/

function SetGame (req, res){
	var data = req.body;
	strLog("SetGame ");
	//strLog(data);
	var gameID = data['tournamentID'];
	strLog('****FIX IT!!!!   var gameID = data[tournamentID];'  );
	//+ data + 
	games[gameID] = data;
	games[gameID].tournamentID = data['tournamentID'];
	res.end("Game " + gameID + " Is Set");
}