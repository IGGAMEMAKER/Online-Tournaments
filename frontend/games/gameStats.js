console.log('gameStats.js loaded');

function UserGetsData(tournamentID){
	//console.log(tournamentID);
	statSend('UserGetsData', {tournamentID:tournamentID} );
}

function GameLoaded(tournamentID, login){
	console.log('GameLoaded : ' + tournamentID + '  ' + login);
	statSend('GameLoaded', {tournamentID:tournamentID, login:login} );
}
GameLoaded(tournamentID, login);



function printer(data){
	console.log(data);
}

function statSend(url, data){
	$.ajax({
		url: 'http://localhost/'+url,
		method: 'POST',
		data: data,
		success: printer
	});
}