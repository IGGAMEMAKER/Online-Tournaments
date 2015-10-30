
//var gamePort=5009;
//var gameHost='46.101.157.129';//'127.0.0.1';
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//var login = login || window.login;
//alert(login);

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
	setQuestionTab('Question will be here');
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
var con = 'http://' + gameHost+':' + gamePort + '/'+tournamentID;
//alert(con);
var room = io.connect(con);


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
	}
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});

room.on('finish', function(msg){
	setQuestionTab('Game Finished. Thank you for participation!');
	drawRB(1,'');
	drawRB(2,'');
	drawRB(3,'');
	drawRB(4,'');
	DrawPlayers(msg);
	getMyPoints();
	//alert('Winner is :' + msg.winner);
})
var gameDatas;// = [];

room.on('update', function(msg){
	//alert(JSON.stringify(msg));
	setQuestionTab(msg.question);

	for (var i=0;i<msg.answers.length;++i){
		drawRB(i+1, msg.answers[i]);
	}
	getMyPoints();
	//if (starter==1){ starter = 2;}

	//alert(JSON.stringify(msg));

	//gameDatas = msg.gameDatas;
});

room.on('statusChange', function(msg){
	var myScore = msg[login];
	var gameStatus = msg['gameStatus'];
});


function DrawPlayers(results){
	var q = document.getElementById('Question');
	q.innerHTML = '<b style="font-size: 72px;">User results</b>';
	if (login==results.winner){
		$('#Question').append($('<p style="color: #FF0000; ">').text('WINNER : ' + results.winner));
	}
	else{
		$('#Question').append($('<p>').text('WINNER : ' + results.winner));
	}

	$('#Question').append('<br>');
	$('#Question').append('<br>');

	for (var ind in results.players.scores){
		var style="";
		if (ind==login){
			//style="style = 'color: #FF0000;'";

			$('#Question').append($('<li style= "color: #FF0000;">').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );	
		}
		else{
			$('#Question').append($('<li>').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );
		}
		//$('#Question').append($('<li ' + style + '>').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );

	}
}



function sendGameData(data1, url){
	var sendData = { 
		movement: {answer:data1}, 
		tournamentID: tournamentID, 
		gameID: tournamentID, 
		login: login
	};
	//alert(JSON.stringify(sendData));
	sendToRoom(sendData, 'http://' + gameHost+':' + gamePort + '/Move');
	//alert('Sended :' + JSON.stringify(sendData));
}

function sendToRoom(dat, url){
	room.emit('movement', dat );
}

function drawPoints(data){
	var q = document.getElementById('Score');
	q.innerHTML = 'Your score: '+ data.points;	
	//$('#Score').innerHTML = 'Your score: '+ data.points;
	//alert('Points : ' + JSON.stringify(data));
}

function getMyPoints(){
	setTimeout( function(){
		aj('http://' + gameHost+':' + gamePort + '/Points', drawPoints);
	}, getRandomArbitrary(0, 50) );
}

function aj(url, callback){
	$.ajax({
	url: url,
	method: 'POST',
	data: {login:login, tournamentID:tournamentID, gameID:tournamentID },
	success: callback});
	/*
	function( data ) {
		var msg = JSON.stringify(data);
		//alert(msg);
		console.log(msg);
	}
	*/
}