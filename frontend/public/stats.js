function AttemptToStart(tournamentID){
	console.log(tournamentID);

	$.ajax({
	  url: 'AttemptToStart',
	  method: 'POST',
	  data: { tournamentID: tournamentID },
	  success: function( data ) {
		var msg = data;//JSON.stringify(data);

		console.log(msg);
	  }

	});
}