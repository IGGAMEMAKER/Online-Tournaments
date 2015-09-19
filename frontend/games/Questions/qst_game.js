// RequestAnimFrame: a browser API for getting smooth animations
/*window.requestAnimFrame = (function(){
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
} )();*/
//alert('This instance!');

// Add mousemove and mousedown events to the canvas
//canvas.addEventListener("mousemove", trackPosition, true);

//canvas.addEventListener("mousedown", btnClick, true);

var gamePort=5009;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var login = window.login;

const STATUS_WAITING=1;
const STATUS_RUNNING=2;
const STATUS_RESTART_ROUND=3;
const STATUS_FINISHING=4;

var gameStatus = STATUS_WAITING;

function drawRB(val, ans){
		var rb = document.getElementById(val);
		rb.innerHTML='<input type="radio" value='+val+', name="answer"/> ';
		rb.innerHTML+= ans;
	}

//var tournamentID = "#{tournamentID}";
//console.log('AZAZA ' + tournamentID);
//alert('AZAZA ' + tournamentID);
	//alert(#{tournamentID});
	//var answs = document.getElementById('Answers');
	//alert('answs');
	//answs.innerHTML='';
	drawRB(1,'bar');
	/*var rb = document.getElementById('1');
	rb.innerHTML='<input type="radio" value=1, name="answer"/> ';
	rb.innerHTML+= 'bar';*/
	/*function drawAnswers(){
		var rb = document.getElementById('1');
		rb.innerHTML='';
		//answs.appendChild();
	}
	drawAnswers();*/
	

var room = io.connect('http://localhost:' + gamePort + '/'+tournamentID);


var starter=0;

room.on('startGame', function(msg){
	//alert('alert, MOTHERFUCKER!!' + JSON.stringify(msg));
	var ticks = msg['ticks'];
	
	console.log(ticks);
	if (ticks==0){
		$('#Question').innerHTML = 'startGame in '+ ticks + ' seconds';
		gameStatus = STATUS_RUNNING;
		starter=1;
	}
	else{
		//printText('startAfter', 'startGame in '+ ticks + ' seconds', 400, 250);
	}
	//alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});
var gameDatas;// = [];

room.on('update', function(msg){
	alert(JSON.stringify(msg));

	for (i=0;i<msg.answers.Length;++i){
		drawRB(i+1, msg.answers[i]);
	}
	//if (starter==1){ starter = 2;}

	//alert(JSON.stringify(msg));

	//gameDatas = msg.gameDatas;
});

room.on('statusChange', function(msg){
	var myScore = msg[login];
	var gameStatus = msg['gameStatus'];
});

/*var timer;

function initSender(){
	var tmr0 = setInterval(sendGameData , 20);
	//timer = setInterval(function(){ sendGameData();} , 1000);
}

function myStartGame(){
	initSender();
}*/


function sendGameData(data1, url){
	var sendData = { 
		movement: {answer:data1}, 
		tournamentID: tournamentID, 
		gameID: tournamentID, 
		login: window.login 
	};

	ajaXSend(sendData, 'http://localhost:' + gamePort + '/Move');
	//alert('Sended :' + JSON.stringify(sendData));
}

function ajaXSend(dat, url){
	/*$.ajax({
	url: url?url:'http://localhost:5009/Move',
	method: 'POST',
	data: dat,
	success: function( data ) {
		var msg = JSON.stringify(data);
		//alert(msg);
		console.log(msg);
	}});*/
	room.emit('movement', dat );

}