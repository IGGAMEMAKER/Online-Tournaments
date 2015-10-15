function GetRunningTournaments(){
	$.ajax({
	  url: 'Info',
	  method: 'POST',
	  data: { command:'TournamentsRunning' },
	  success: function( data ) {
		
		var msg = data;//JSON.stringify(data);
		console.log(msg);

		//var text = '<button onclick="startGame("'+host+'",'+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
		//alert('Answer on Running');
			//$('#Running').append('<b>'+JSON.stringify(msg)+'</b>');
			$("#Running").html('<h2>'+'Running Tournaments'+'</h2>');
			//drawTournaments(msg);
			$("#Running").append('<p>'+msg+'</p>');// '<b>'+JSON.stringify(msg)+'</b>';
	  }
	});
}