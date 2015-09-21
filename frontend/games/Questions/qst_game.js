
//var gamePort=5009;
//var gameHost='46.101.157.129';//'127.0.0.1';
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
	rb.innerHTML='<input type="radio" onclick=sendGameData('+val+') value='+val+', name="answer"/> ';
	rb.innerHTML+= ans;
}
function setQuestionTab(question){
	var q = document.getElementById('Question');
	q.innerHTML = question;	
}

//var tournamentID = "#{tournamentID}";
//console.log('AZAZA ' + tournamentID);
//alert('AZAZA ' + tournamentID);
	//alert(#{tournamentID});
	//var answs = document.getElementById('Answers');
	//alert('answs');
	//answs.innerHTML='';
	drawRB(1,'bar');
	setQuestionTab('Question TROLOLO');
	/*var rb = document.getElementById('1');
	rb.innerHTML='<input type="radio" value=1, name="answer"/> ';
	rb.innerHTML+= 'bar';*/
	/*function drawAnswers(){
		var rb = document.getElementById('1');
		rb.innerHTML='';
		//answs.appendChild();
	}
	drawAnswers();*/
	
/*var gameHost = 'localhost';
var gamePort = 5009;*/
var room = io.connect('http://' + gameHost+':' + gamePort + '/'+tournamentID);


var starter=0;

room.on('startGame', function(msg){
	//alert('alert, MOTHERFUCKER!!' + JSON.stringify(msg));
	var ticks = msg['ticks'];
	
	console.log(ticks);
	if (ticks==0){

		//$('#Question').innerHTML = 'startGame in '+ ticks + ' seconds';
		gameStatus = STATUS_RUNNING;
		starter=1;
	}
	else{
		setQuestionTab('startGame in '+ ticks + ' seconds');
		//printText('startAfter', 'startGame in '+ ticks + ' seconds', 400, 250);
	}
	//alert(msg);
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});
room.on('finish', function(msg){
	setQuestionTab('Game Finished. Thank you for participation!');
	drawRB(1,'');
	drawRB(2,'');
	drawRB(3,'');
	drawRB(4,'');
	alert('Winner is :' + msg.winner);
})
var gameDatas;// = [];

room.on('update', function(msg){
	//alert(JSON.stringify(msg));
	setQuestionTab(msg.question);

	for (var i=0;i<msg.answers.length;++i){
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

function sendGameData(data1, url){
	var sendData = { 
		movement: {answer:data1}, 
		tournamentID: tournamentID, 
		gameID: tournamentID, 
		login: window.login 
	};
	//alert(JSON.stringify(sendData));
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