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
			drawTournaments(obj );
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';
	  }
	});
}

function size(obj){
	return Object.keys(obj).length;
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
		console.log(obj);
		console.log(size(obj));
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

function drawTournaments(msg){
	for (var running in msg){
		var func = "stopTournament("+running +")";
		var func1 = "restartGame("+running +")";
		var separator = '  --  ';
		var stopTourn = '<a href="" onclick="' + func + '"> stopTournament ' +running+'</a>';
		var restart_game = '<a href="" onclick="' + func1 + '"> restartGame ' +running+'</a>';

		$("#Running").append(stopTourn + separator); 
		$("#Running").append(restart_game);// '<b>'+JSON.stringify(msg)+'</b>';
	}
}