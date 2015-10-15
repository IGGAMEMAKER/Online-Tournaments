function GetRunningTournaments(){
	$.ajax({
	  url: 'Admin',
	  method: 'POST',
	  data: { command:'TournamentsRunning' },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		console.log(msg);

		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
			$("#Running").html('<h2>'+'Running Tournaments'+'</h2>');
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';*/
			drawTournaments(JSON.parse(msg) );
			//$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';
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
		console.log(msg);

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
		$("#Running").append('<a onclick="' + func + '">'+running+'</a>');// '<b>'+JSON.stringify(msg)+'</b>';
	}
	/*if (msg!={}){

	}
	else{
		$("#Running").append('<p>'+msg+'</p>');
	}*/
}