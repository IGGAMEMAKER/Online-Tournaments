function GetRunningTournaments(){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'TournamentsRunning' },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		//console.log(msg);
		var obj = JSON.parse(msg);
		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
			$("#Running").html('<h2>'+'Running Tournaments (GOT FROM TS) '+size(obj)+'</h2>');
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';*/
			console.log(data);
			drawTournaments(obj );
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';
	  }
	});
}

function size(obj){
	return Object.keys(obj).length;
}

function GetPingPongGames(){
	GetGame(1);
}
function GetQuestionGames(){
	GetGame(2);
}

function GetGame(gameNameID){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'GetGameFromGameServer', gameNameID:gameNameID },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		//console.log(msg);
		var obj = JSON.parse(msg);
		//console.log(obj);
		//console.log(size(obj));
		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
			$("#"+gameNameID).html('<h2>'+'Total Games (GOT FROM GS) ' +size(obj)+ '</h2>');
			//$("#Tournaments").append(msg); 
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';*/
			drawGames(obj, gameNameID );
	  }
	});
}


function GetTotalTournaments(){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'Tournaments' },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		//console.log(msg);
		var obj = JSON.parse(msg);
		//console.log(obj);
		//console.log(size(obj));
		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
			$("#Tournaments").html('<h2>'+'Total Tournaments (GOT FROM TS) ' +size(obj)+ '</h2>');
			//$("#Tournaments").append(msg); 
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';*/
			drawTotalTournaments(obj );
	  }
	});
}

function restartGame(tournamentID){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'runTournament', tournamentID:tournamentID },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		//console.log(msg);
		alert('restartGame in Tournament ' + tournamentID);
	  }
	});
}


function stopTournament(tournamentID){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'stopTournament', tournamentID:tournamentID },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		//console.log(msg);

		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
		alert('Stop Tournament ' + tournamentID);
			/*$("#Running").html('<h2>'+'Running Tournaments'+'</h2>');
			drawTournaments(msg);
			$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';*/
	  }
	});
}

function drawGames(msg, gameNameID){
	/*for (var running in msg){
		var func = "stopTournament("+running +")";
		var func1 = "restartGame("+running +")";
		var separator = '  --  ';
		var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		var restart_game = '<a href="" onclick="' + func1 + '"> restartGame ' +running+'</a>';

		$("#"+gameNameID).append(stopTourn + separator); 
		$("#"+gameNameID).append(restart_game);// '<b>'+JSON.stringify(msg)+'</b>';
	}*/
	//$("#"+gameNameID).html(JSON.stringify(msg));
	var counter=0;
	for (var running in msg){
		//if (counter==0){ $("#"+gameNameID).html(JSON.stringify(msg[running])); counter++;}
		//else{
			var game = msg[running];
			var func = "restartGame("+running +")";

			var tag = '<span style="color: gray;">';
			if (game.isRunning) tag = '<span style="color: green;"> ';

			var message = 	tag + 'status: '+game.isRunning + 
							'| ID: ' + JSON.stringify(game.scores)+'</span>';// JSON.stringify(msg[running]);

			var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';

			$("#"+gameNameID).append(message + ' ' + stopTourn + '<br>'); 
		//}
	}

	/*for (var running in msg){
		var func = "stopTournament("+running +")";
		var func1 = "restartGame("+running +")";
		var separator = '  --  ';
		var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		var restart_game = '<a href="" onclick="' + func1 + '"> restartGame ' +running+'</a>';

		$("#"+gameNameID).append(stopTourn + separator); 
		$("#"+gameNameID).append(restart_game);// '<b>'+JSON.stringify(msg)+'</b>';
	}*/
}

function drawTournaments(msg){
	for (var i in msg){
		var running = msg[i];
		var func = "stopTournament("+running +")";
		var func1 = "restartGame("+running +")";
		var separator = '  --  ';
		var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		var restart_game = '<a href="" onclick="' + func1 + '"> restartGame ' +running+'</a>';

		$("#Running").append(stopTourn + separator); 
		$("#Running").append(restart_game);// '<b>'+JSON.stringify(msg)+'</b>';
	}
}
function drawTotalTournaments(msg){
	for (var running in msg){
		var func = "stopTournament("+running +")";
		var func1 = "restartGame("+running +")";
		var separator = '  --  ';
		var tournament =  msg[running];
		var message = 	'status: '+tournament.status + 
						'| ID: ' + tournament.tournamentID;// JSON.stringify(msg[running]);
		/*
			
						'| gameNameID: ' + tournament.gameNameID + 
						'| buyIn: ' + tournament.buyIn + 
						'| players: ' + tournament.players + 
		*/
		var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		$("#Tournaments").append(message + ' ' + stopTourn + '<br>'); 

		/*var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		var restart_game = '<a href="" onclick="' + func1 + '"> restartGame ' +running+'</a>';
		$("#Tournaments").append(stopTourn + separator); 
		$("#Tournaments").append(restart_game +'<br>');// '<b>'+JSON.stringify(msg)+'</b>';*/
	}
}
GetRunningTournaments();
GetTotalTournaments();
/*var tmr = setInterval(GetRunningTournaments, 5000);
var tmr2 = setInterval(GetTotalTournaments, 5000);*/
window.onfocus = function(){location.reload(true);}

//var tmr3 = setInterval(GetPingPongGames, 4000);
//var tmr4 = setInterval(GetQuestionGames, 4000);