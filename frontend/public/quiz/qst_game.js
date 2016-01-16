
//var gamePort=5009;
//var gameHost='46.101.157.129';//'127.0.0.1';
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var MAX_TICKS = 10000;

//var login = login || window.login;
//alert(login);

const STATUS_WAITING=1;
const STATUS_RUNNING=2;
const STATUS_RESTART_ROUND=3;
const STATUS_FINISHING=4;

var gameStatus = STATUS_WAITING;

function drawRB(val, ans){
	var rb = document.getElementById(val);
	//rb.innerHTML='<input type="radio" onclick=sendGameData('+val+') value='+val+', name="answer"/> ';
	//rb.innerHTML+= ans;
	var txt = '<a class="btn btn-lg btn-block btn-rd btn-d btn-clean" id="a'+val+'" onclick=sendGameData('+val+') value='+val+', name="answer">' + ans +'</a>';
	rb.innerHTML = txt;
	//console.log(ans, txt);
}

function hideRB(val){
	var rb = document.getElementById(val);

	rb.style.display = 'none';
}

function setQuestionTab(question){
	var q = document.getElementById('Question');
	q.innerHTML = question;	
}

function setTicker(ticks){
	var q = document.getElementById('ticker');
	q.innerHTML = ticks;	
}

/*var gameHost = 'localhost';
var gamePort = 5009;*/
var con = 'http://' + gameHost+':' + gamePort + '/'+tournamentID;
//alert(con);
var room = io.connect(con);


var starter=0;

function countDown(seconds){
	setTicker(seconds);
	if (seconds>0){
		setTimeout(function() { countDown(seconds-1); }, 1000);
	}
}

room.on('startGame', function(msg){
	var ticks = msg['ticks'];
	
	console.log(ticks);
	if (ticks==0){
		//$('#Question').innerHTML = 'startGame in '+ ticks + ' seconds';
		gameStatus = STATUS_RUNNING;
		starter=1;

		countDown(10);
		/*setTimeout(function(){ setTicker(10); },0);
		setTimeout(function(){ setTicker(9); },1000);
		setTimeout(function(){ setTicker(8); },2000);
		setTimeout(function(){ setTicker(7); },3000);
		setTimeout(function(){ setTicker(6); },4000);
		setTimeout(function(){ setTicker(5); },5000);
		setTimeout(function(){ setTicker(4); },6000);
		setTimeout(function(){ setTicker(3); },7000);
		setTimeout(function(){ setTicker(2); },8000);
		setTimeout(function(){ setTicker(1); },9000);*/
		//show_answer_buttons();
	}
	else{
		setTicker(ticks+10);
	}
	recievedData = 1;
	//$('#messages').append($('<li>').text(JSON.stringify(msg)));
});

/*setInterval(function(){
	document.getElementById(1).style.color = 'blue';
}, 1000);*/

room.on('finish', function(msg){
	hideRB(1);
	hideRB(2);
	hideRB(3);
	hideRB(4);

	/*drawRB(1,'');
	drawRB(2,'');
	drawRB(3,'');
	drawRB(4,'');*/
	document.getElementById("Score").style.display = 'none';
	document.getElementById("ticker").style.display = 'none';
	setQuestionTab('Игра завершена. Ждём вас в следующих турнирах!');

	DrawPlayers(msg);
	//getMyPoints();

	//setTimeout(window.close, 7000);
	
	//alert('Winner is :' + msg.winner);
})

var gameDatas;// = [];
var qTick = MAX_TICKS;
var tickerID;


/*var qTicker = function(){
	setTicker()
}*/

function show_answer_buttons(){
	document.getElementById("Answers").style.display = "block";
}

room.on('update', function(msg){
	//alert(JSON.stringify(msg));
	recievedData = 1;
	setQuestionTab(msg.question);

	for (var i=0;i<msg.answers.length;++i){
		drawRB(i+1, msg.answers[i]);
	}
	getMyPoints();

	var MAX_SECONDS=MAX_TICKS / 1000;
	//for (var i=0; i<MAX_SECONDS; i++){
	//	setTimeout(function(){ setTicker(MAX_SECONDS-i); }, i*1000);
	//}
	show_answer_buttons();
	setTimeout(function(){ setTicker(10); },0);
	setTimeout(function(){ setTicker(9); },1000);
	setTimeout(function(){ setTicker(8); },2000);
	setTimeout(function(){ setTicker(7); },3000);
	setTimeout(function(){ setTicker(6); },4000);
	setTimeout(function(){ setTicker(5); },5000);
	setTimeout(function(){ setTicker(4); },6000);
	setTimeout(function(){ setTicker(3); },7000);
	setTimeout(function(){ setTicker(2); },8000);
	setTimeout(function(){ setTicker(1); },9000);
	//setTimeout(function(){ setTicker(1); },7000);
	//if (starter==1){ starter = 2;}

	//alert(JSON.stringify(msg));

	//gameDatas = msg.gameDatas;
});

room.on('statusChange', function(msg){
	var myScore = msg[login];
	var gameStatus = msg['gameStatus'];
});

var resultField="#resultField";

function DrawPlayers(results){
	var q = document.getElementById('Question');
	//q.innerHTML = '<b style="font-size: 72px;">Результаты турнира</b>';

	$('#Question').append('<br>')
	if (login==results.winner) {
		$('#Question').append($('<p style="color: #FF0000; ">').text('ВЫ ПОБЕДИЛИ!!!!'));
	} else {
		$('#Question').append($('<p>').text('Победитель : ' + results.winner));
	}
	$('#Question').append('<br><br>')
	//$('#Question').append('<br>');
	//$('#Question').append('<br>');

	var places = results.players.places;
	var prizes = results.players.prizes;
	var scores = results.players.scores;



	for (var ind in scores){
		var style="";

		var name = scores[ind].login;
		var score = Math.round(scores[ind].value);

		var winning;
		if (ind<places[1]){
			winning = prizes[0]/100+'$';//'<td>'+prizes[0]/100+'$</td>';
		} else {
			winning = '--';
		}

		var winBlock;
		var style = '';
		if (name==login){
			style = 'style="color: red;"';
		}

		var text = '<tr>';
		text += '<td ' + style + '><b>'+name+'</b><br>('+score+')</td>';
		//text += '<td style="color: red;">' + score + '</td>';
		text += '<td ' + style + '>' + winning + '</td>';
		text += '</tr>';
		$(resultField).append(text);

		//console.log(ind)
		/*if (name==login){
			//style="style = 'color: #FF0000;'";
			//winBlock = '<td style="color: red;>'+winning+'</td>';
			var text = '<tr>'
			text += '<td style="color: red;"><b>'+name+'</b><br>('+score+')</td>';
			//text += '<td style="color: red;">' + score + '</td>';
			text += '<td style="color: red;">' + winning + '</td>';
			text += '</tr>';
			$(resultField).append(text);

			//$('#Question').append($('<li style= "color: #FF0000;">').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );	
		}
		else{
			//winBlock = '<td>'+winning+'</td>';
			//var text = '<tr><td>'+name+'</td><td>'+ score +'</td>' + winBlock + '</tr>'
			var text = '<tr>'
			text += '<td ><b>'+name+'</b><br>('+score+')</td>';
			//text += '<td >' + score + '</td>';
			text += '<td >' + winning + '</td>';
			text += '</tr>';

			$(resultField).append(text);
			//$('#Question').append($('<li>').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );
		}*/
		//$('#Question').append($('<li ' + style + '>').text(ind + ' : ' + results.players.scores[ind]) ); //JSON.stringify(results)) );

		// show winner table
		var winnerTable = document.getElementById("winnerTable");

		winnerTable.style.display = 'block';
		//$('#winnerTable').css('display', )

	}
}

var default_colour = 'rgba(0,0,0, 0.3)';

function blockAllButtons(){
	document.getElementById("a1").style.background = default_colour;
	document.getElementById("a2").style.background = default_colour;
	document.getElementById("a3").style.background = default_colour;
	document.getElementById("a4").style.background = default_colour;
}

function colorize(id){
	document.getElementById("a"+id).style.background = 'blueviolet';
}


function sendGameData(data1, url){
	var sendData = { 
		movement: {answer:data1}, 
		tournamentID: tournamentID, 
		gameID: tournamentID, 
		login: login
	};
	blockAllButtons();
	colorize(data1);
	//alert(JSON.stringify(sendData));
	sendToRoom(sendData, 'http://' + gameHost+':' + gamePort + '/Move');
	//alert('Sended :' + JSON.stringify(sendData));
}

function sendToRoom(dat, url){
	room.emit('movement', dat );
}

function drawPoints(data){
	var q = document.getElementById('Score');
	q.innerHTML = 'Ваш счёт : '+ Math.round(data.points);	

	//$('#Score').innerHTML = 'Your score: '+ data.points;
	//alert('Points : ' + JSON.stringify(data));
}

function getMyPoints(){
	setTimeout( function(){
		var urlUrl='http://' + gameHost + '/Game/Points';
		console.log(urlUrl);
		aj(urlUrl, drawPoints);
		//aj('http://' + gameHost+':' + gamePort + '/Points', drawPoints);
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