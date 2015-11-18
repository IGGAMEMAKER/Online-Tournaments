// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
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
var resize =0;
// Set the canvas's height and width to full screen
H=W*3/4;
if (H>window.innerHeight){
	H = window.innerHeight;
	W = H * 4 / 3;
	resize = 1;
}

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
	this.h = H*0.05;
	this.w = W*0.2;//150;
	
	// Paddle's position
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H*0.95;// - this.h - 50 ;
	
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("top"));
paddles.push(new Paddle("bottom"));

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
//var curX = getRandomArbitrary(0,99);

logins = logins.split(',');

var myID=0;
var oppID=1;

const STATUS_WAITING=1;
const STATUS_RUNNING=2;
const STATUS_RESTART_ROUND=3;
const STATUS_FINISHING=4;

var gameStatus = STATUS_WAITING;


//var tournamentID = "#{tournamentID}";
var gameUrl = 'http://' + gameHost+':' + gamePort + '/'+tournamentID;
//alert(gameUrl);
var room = io.connect(gameUrl);

var opponentLogin;

var drawObjects = {};

var starter=0;

room.on('startGame', function(msg){
	//alert('alert, MOTHERFUCKER!!' + JSON.stringify(msg));
	recievedData = 1;
	
	var ticks = msg['ticks'];
	
	console.log(ticks);
	if (ticks==0){
		gameStatus = STATUS_RUNNING;
		starter=1;
	}
	else{
		printText('startAfter', 'startGame in '+ ticks + ' seconds', 400, 250);
	}
	//alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});
var gameDatas;// = [];

room.on('update', function (msg){
	if (starter==1){ starter = 2; myStartGame();}
	if (senderStatus==0){
		initSender();
		senderStatus =1;
	}
	//alert(JSON.stringify(msg));

	drawMap(msg.map);
	console.log(msg.armies);
	drawArmies(msg.armies);

	//console.log(msg.map);
	
	/*printText('u0', gameDatas[0].score, 200, 50+2*20, 'red');
	printText('u1', gameDatas[1].score, 200, 50+3*20);*/

	//recievedData = 1;

	//printText('Server Update', JSON.stringify(gameDatas), 75, 305);
});

room.on('finish' , function(msg){
	clearInterval(timer);
	gameOver(JSON.stringify(msg));
	//alert('Game finished! winner is : ' + JSON.stringify(msg) );
});

function drawArmies(armies){
	var canvas1 = document.getElementById("canvas");
	var ctx1 = canvas.getContext("2d");
	console.log('drawArmies', armies[0]);
	drawArmy(ctx1, armies[0], 'red');
	drawArmy(ctx1, armies[1], 'blue');
	/*if (armies && armies.length){
		for (var i = 0; i<armies.length; i++){
			var colour = i%2?'red':'blue';
			drawArmy(ctx1, armies[i], colour);
		}
	}*/

	//drawSquare(ctx1, 'red', 25, 0,0);
}

var fieldSize=30;

var soldierOffset = 5;
var soldierSize= fieldSize - 7;

function drawArmy(ctx1, army, colour){
	console.log('drawArmy', army);

	for (var soldierIndex in army){
		var soldier = army[soldierIndex];
		console.log('soldier', soldier);
		var x = soldier.x*fieldSize + soldierOffset;
		var y = soldier.y*fieldSize + soldierOffset;

		drawSquare(ctx1, colour, soldierSize, x, y);
	}
}

function drawSquare(ctx, colour, size, x, y){
	ctx.fillStyle = colour;
	ctx.fillRect(x, y, size, size);
}

function drawMap(map){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var size = map.length;
	console.log(size);

	ctx.fillStyle = 'black';
	ctx.fillRect(0,0, fieldSize*size+offset, fieldSize*size+offset);

	for (var row = 0; row < size; row ++)
	{
		for (var column = 0; column < size; column ++)
		{
			// coordinates of the top-left corner

			var x = column * fieldSize;
			var y = row * fieldSize;
			
			/*if (row%2 == 0)
			{
				if (column%2 == 0)
				{
					ctx.fillStyle = "black";
				}
				else
				{
					ctx.fillStyle = "white";
				}
			}
			else
			{
				if (column%2 == 0)
				{
					ctx.fillStyle = "white";
				}
				else
				{
					ctx.fillStyle = "black";
				}
			}*/
			
			drawField(ctx, x, y, fieldSize, fieldSize, {});
			
			//ctx.fillRect(x, y, fieldSize, fieldSize);
		}
	}
}

var offset=2;

function drawField(ctx, x, y, fieldSize, data){
	ctx.fillStyle = 'white';
	ctx.fillRect(x+offset, y+offset, fieldSize - offset, fieldSize - offset);
	//ctx.
}

function deleteText(name){
	delete drawObjects[name];
}

function getNormalizedCoords(mouseCoords){
	return { 
		x:mouseCoords.x*100/W, 
		y:mouseCoords.y*100/H
	}
}
var timer;
var senderStatus=0;
function initSender(){
	timer = setInterval(sendGameData , 1000);

}
//console.log(room);



function myStartGame(){
	deleteText('startAfter');
	//alert('MY START Game!!!');
	//animloop();

	initSender();
	senderStatus = 1;
}

function sendGameData(data1, url){
	//room.emit('movement', {movement : getNormalizedCoords(mouse), tournamentID:tournamentID, gameID:tournamentID, login:login } );
	var mvm = getNormalizedCoords(mouse);
	//printText('MOUSE', JSON.stringify(mvm), 0, 350);
	
	var sendData = { 
		movement: mvm, 
		tournamentID: tournamentID, 
		gameID: tournamentID, 
		login: login //window.login 
	};
	

	ajaXSend(sendData, 'http://'+ gameHost+':' + gamePort +'/Move');
}

function ajaXSend(dat, url){
	room.emit('movement', dat );
}

var curBallX=0;
var curBallY=0;

function printText(name, text, startX, startY, colour) {
	var nameStr=' ';
	switch(name){
		case 'user0':
		case 'user1':
		case 'u0':
		case 'u1':
		break;
			
		default:
			nameStr = '<'+name+'> ';
		break;
	}
	drawObjects[name] = {text: nameStr + text, startX: startX, startY: startY, colour:colour};
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
		ctx.fillStyle = "white";
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


// Draw everything on canvas
function Draw() {

	paintCanvas();

	drawPaddles();
	/*if (resize){
		printText('resize', 'res', 0, 0);
	}*/
	//ctx.fillStyle
	for (var index in drawObjects){
		drawText(drawObjects[index]);
	}
	
	ball.draw();
	update();
}
var texts = [];

printText('user0' , logins[0], 20, 50+2*20, 'red');
printText('user1' , logins[1], 20, 50+3*20, '');



function clearTexts(){
	texts = [];
}

// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

function update() {
}

function drawText(obj){
	if (obj){
		var colour = obj.colour;
		var startX = obj.startX;
		var startY = obj.startY;
		var text = obj.text;

		ctx.fillStyle = colour?colour:"white";
		ctx.font = "16px Arial, sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText(text, startX?startX:50, startY?startY:50 );
	}
}

function StopAnimation(){
	cancelRequestAnimFrame(init);
}

// Function to run when the game overs
function gameOver(winner) {
	ctx.fillStyle = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (winner==login){
		ctx.fillText("YOU WON THE GAME, CONGRATULATIONS!", W/2, H/2 + 25 );	
	}
	else{
		ctx.fillText("Winner is : " + (JSON.parse(winner)).winner , W/2, H/2 + 25 );
		console.log(winner);
	}
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;

	//setTimeout(window.close, 7000);
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
/*	
	// Variables for storing mouse position on click
	var mx = e.pageX,
			my = e.pageY;
*/
	
}

//printText('User', 'I am ' + login, 0, 20);

// Show the start screen
//startScreen();
//animloop();