// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60 / 10);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();
/*alert('This instance!');
console.log('This instance!');*/
// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"), // Create canvas context
		W = window.innerWidth, // Window's width
		H = window.innerHeight, // Window's height
		particles = [], // Array containing particles
		ball = {}, // Ball object
		paddles = [2], // Array containing two paddles
		mouse = {}, // Mouse object to store it's current position
		points = 0, // Varialbe to store points
		fps = 60, // Max FPS (frames per second)
		particlesCount = 20, // Number of sparks when ball strikes the paddle
		flag = 0, // Flag variable which is changed on collision
		particlePos = {}, // Object to contain the position of collision 
		multipler = 1, // Varialbe to control the direction of sparks
		startBtn = {}, // Start button object
		restartBtn = {}, // Restart button object
		over = 0, // flag varialbe, cahnged when the game is over
		init, // variable to initialize animation
		paddleHit;

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

// Initialise the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

var playerPaddle= 'bottom';



// Function for creating paddles
function Paddle(pos) {
	// Height and width
	this.h = 5;
	this.w = 150;
	
	// Paddle's position
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h - 50 ;
	
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

// Ball object
ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 4,
	vy: 8,
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};


// Start Button object
startBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 25,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Start", W/2, H/2 );
	}
};
//alert(window.logins);
var logins = window.logins;

const STATUS_WAITING=1;
const STATUS_RUNNING=2;
const STATUS_RESTART_ROUND=3;
const STATUS_FINISHING=4;

var gameStatus = STATUS_WAITING;


//var tournamentID = "#{tournamentID}";
console.log('AZAZA ' + tournamentID);
//alert('AZAZA ' + tournamentID);
var room = io('http://localhost:5009' + '/'+tournamentID);
var socket = io();

socket.emit('event1', {data:'tratata'});
//var login;
var opponentLogin;

//console.log(io.sockets);
room.on('azz', function(msg){
	//alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});

var drawObjects = {};

//room.on('')
var starter=0;
room.on('startGame', function(msg){
	//alert('alert, MOTHERFUCKER!!' + JSON.stringify(msg));
	var ticks = msg['ticks'];
	
	console.log(ticks);
	if (ticks==0){
		starter=1;
	}
	else{
		printText('startAfter', 'startGame in '+ ticks + ' seconds', 400, 250);
		Draw();
	}
	//alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});
var gameDatas;// = [];

room.on('update', function(msg){
	if (starter==1){ starter = 2; myStartGame();}
	//alert(JSON.stringify(msg));
	var opponentX = msg['opponentX'];
	var sBallX = (msg['ball']).x;
	var sBallY = (msg['ball']).y;
	ball.x = sBallX*canvas.width / 100;
	ball.y = sBallY*canvas.height / 100;

	gameDatas = msg.gameDatas;
	//console.log(ball);
	printText('coordinates', JSON.stringify(msg), 400, 175);
});

room.on('statusChange', function(msg){
	var myScore = msg[login];
	var opponentScore = msg[opponentLogin];
	var gameStatus = msg['gameStatus'];
});

function deleteText(name){
	delete drawObjects[name];
}

/*room.on('azz', function(msg){
	alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});*/
function getNormalizedCoords(mouseCoords){
	return { 
		X:mouseCoords.X*100/canvas.width, 
		Y:mouseCoords.Y*100/canvas.height
	}
}
//console.log(room);
function myStartGame(){
	deleteText('startAfter');
	//alert('MY START Game!!!');
	//animloop();
	/*timer = setInterval(function (){
		sendGameData(getNormalizedCoords(mouse));
	}, 500);*/
}

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.emit('chat message', msg);
  });
});*/

/**/

function sendGameData(data1, url){
	socket.emit('movement', {movement : data1, tournamentID:tournamentID, gameID:tournamentID, login:login } );
	/*$.ajax({
	url: url?url:'http://localhost:5009/Move',
	method: 'POST',
	data: data1,
	success: function( data ) {
		var msg = JSON.stringify(data);
		//alert(msg);
		console.log(msg);
	}});*/
}

/*
timer = setInterval(function (){
	$.ajax({
		url: 'Alive',
		method: 'POST',
		data: { f1:'ololo' },
		success: function( data ) {
			var msg = JSON.stringify(data);
			//alert(msg);
			console.log(msg);
		}});
}, 10050);
*/
var curBallX=0;
var curBallY=0;

/*var tmr1 = setInterval(function(){
	console.log('tmr1');
	//room.emit('event1', 'TIMER message');
	socket.emit('event1', {data:'tratata'});
	//io.to('/'+tournamentID).emit('event1', { dat1: 'datatata'});
	//room.emit('/111' ,'AZAZA ROOOOOOOOOM');
}, 3000);*/

function printText(name, text, startX, startY, colour) {
	drawObjects[name] = {text:text, startX: startX, startY: startY, colour:colour};
	texts.push({text:text, startX: startX, startY: startY, colour:colour});
}

function drawText(obj){
	if (obj){
		var colour = obj.colour;
		var startX = obj.startX;
		var startY = obj.startY;
		var text = obj.text;

		ctx.fillStlye = colour?colour:"white";
		ctx.font = "16px Arial, sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText(text, startX?startX:50, startY?startY:50 );
	}
}

// Restart Button object
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Restart", W/2, H/2 - 25 );
	}
};

// Function for creating particles object
function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 1.2;
	
	this.vx = -1.5 + Math.random()*3;
	this.vy = m * Math.random()*1.5;
}
var jjj=0;

/*function drPad(id){
	p = paddles[i];
		//console.log('length=' + paddles.length);
		if (gameDatas){
			//p.x = (gameDatas[i].padX?gameDatas[i].padX:50)*canvas.width/100  - p.w/2;
			if (gameDatas[i-1]){
				var a = gameDatas[i-1];
				//console.log(JSON.stringify(a));
				var padX = a.padX;
				//console.log('i: ' + i + ' ' + padX);

				p.x = padX * canvas.width/100  - p.w/2;//(gameDatas[i])['padX']
			}
			else{
				console.log('ERROR!! i= '+ i + ' while length= '+ paddles.length);
			}
		}
		//p.y = gameDatas[i].padY =='top'? 0:500;
		//ctx.fillStyle = 'red';
		//if (i==0) 
		ctx.fillStyle = "white";// (i==0?"white":"red");
		if (i==0) { printText('AZAZA', p.x, 400, 300); }
		ctx.fillRect(p.x, p.y, p.w, p.h);
}*/

function drawPaddles(){
	/*for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}*/

	//console.log(JSON.stringify(paddles));
	
	for(var i = 1; i < paddles.length; i++) {
		//alert('i(' + i + ')' + JSON.stringify(paddles[i]));
		
		p = paddles[i];
		printText(i, JSON.stringify(p));
		//console.log('length=' + paddles.length);
		if (gameDatas){
			//p.x = (gameDatas[i].padX?gameDatas[i].padX:50)*canvas.width/100  - p.w/2;
			if (gameDatas[i-1]){
				var a = gameDatas[i-1];
				//console.log(JSON.stringify(a));
				var padX = a.padX;
				//console.log('i: ' + i + ' ' + padX);

				p.x = padX * canvas.width/100  - p.w/2;//(gameDatas[i])['padX']
			}
			else{
				console.log('ERROR!! i= '+ i + ' while length= '+ paddles.length);
			}
		}
		//p.y = gameDatas[i].padY =='top'? 0:500;
		//ctx.fillStyle = 'red';
		//if (i==0) ctx.fillStyle = "white";// (i==0?"white":"red");
		ctx.fillStyle = "white";// (i==0?"white":"red");
		if (i==0) { printText('AZAZA', p.x, 400, 300); }
		ctx.fillRect(p.x, p.y, p.w, p.h);

		//ctx.fillRect(p.x, p.y, p.w, p.h);
	}
}

// Draw everything on canvas
function Draw() {
	/*switch(gameStatus){
		case STATUS_WAITING:

		break;
		case STATUS_RUNNING
	}*/

	paintCanvas();

	drawPaddles();
	
	for (var index in drawObjects){
		drawText(drawObjects[index]);
	}
	/*for (var i = texts.length - 1; i >= 0; i--) {
		drawText(texts[i]);
	};*/
	ball.draw();
	update();
}
var texts = [];

printText('Campeon' , 'Gaga Campeon ' + jjj++, 20, 50);
printText('user1' , logins[0], 20, 50+2*20);
printText('user2' , logins[1], 20, 50+3*20);

/*var tmr0 = setInterval(function(){
	//printText('Gaga Campeon ')
	//alert(1);
	
	//printText('Gaga Campeon ' + jjj++, 20, 50+jjj*20);
	Draw();
}, 2500);*/

function clearTexts(){
	texts = [];
}
// Function to increase speed after every 5 points
function increaseSpd() {
	if(points % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}

// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
	//console.log('Mouse move : trackPosition function');
}



// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {
	
	// Update scores
	updateScore(); 
	
	/*// Move the paddles on mouse move
	if(mouse.x && mouse.y) {
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = mouse.x - p.w/2;
		}		
	}*/
	//DUBLICATE
	// Move the paddles on mouse move
	if(mouse.x && mouse.y) {
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = mouse.x - p.w/2;
		}		
	}

	// Move the ball
	/*ball.x += ball.vx;
	ball.y += ball.vy;*/
	
	// Collision with paddles
	p1 = paddles[1];
	p2 = paddles[2];
	
	// If the ball strikes with paddles,
	// invert the y-velocity vector of ball,
	// increment the points, play the collision sound,
	// save collision's position so that sparks can be
	// emitted from that position, set the flag variable,
	// and change the multiplier
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	// If flag is set, push the particles
	/*if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	// Emit particles/sparks
	emitParticles();*/
	
	// reset flag
	flag = 0;
}





//Function to check collision between ball and one of
//the paddles
function collides(b, p) {
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
		particlePos.y = ball.y + ball.r;
		multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		particlePos.y = ball.y - ball.r;
		multiplier = 1;	
	}
	
	points++;
	increaseSpd();
	
	if(collision) {
		if(points > 0) 
			collision.pause();
		
		collision.currentTime = 0;
		collision.play();
	}
	
	particlePos.x = ball.x;
	flag = 1;
}

// Function for emitting particles
function emitParticles() { 
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];
		
		ctx.beginPath(); 
		ctx.fillStyle = "white";
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		// Reduce radius so that the particles die after a few seconds
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

// Function for updating score
function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20 );
}

function nextRound(){
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	restartBtn.draw();
}

// Function to run when the game overs
function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	restartBtn.draw();
}

// Function for running the whole animation
function animloop() {
	init = requestAnimFrame(animloop);
	Draw();
}

// Function to execute at startup
function startScreen() {
	Draw();
	startBtn.draw();
}

// On button click (Restart and start)
function btnClick(e) {
	
	// Variables for storing mouse position on click
	var mx = e.pageX,
			my = e.pageY;
	
	// Click start button
	if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
		animloop();
		
		// Delete the start button after clicking it
		startBtn = {};
	}
	
	// If the game is over, and the restart button is clicked
	if(over == 1) {
		if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
			ball.x = 20;
			ball.y = 20;
			points = 0;
			ball.vx = 4;
			ball.vy = 8;
			animloop();
			
			over = 0;
		}
	}
}

function Redraw(){
	ball.x = 20;
			ball.y = 20;
			points = 0;
			ball.vx = 4;
			ball.vy = 8;
			animloop();
			
			over = 0;
			startBtn = {};
}

// Show the start screen
startScreen();
animloop();