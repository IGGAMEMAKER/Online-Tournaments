function UserGetsData(tournamentID){
	//console.log(tournamentID);
	statSend('UserGetsData', {tournamentID:tournamentID} );
	/*$.ajax({
		url: 'UserGetsData',
		method: 'POST',
		data: { tournamentID: tournamentID },
		success: printer
	});*/
}

function GameLoaded(tournamentID){
	statSend('GameLoaded', {tournamentID:tournamentID} );
	/*$.ajax({
		url: 'GameLoaded',
		method: 'POST',
		data: { tournamentID: tournamentID },
		success: printer
	});*/
}

function printer(data){
	console.log(data);
}

function statSend(url, data){
	$.ajax({
		url: url,
		method: 'POST',
		data: data,
		success: printer
	});
}