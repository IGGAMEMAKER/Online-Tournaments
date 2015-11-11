console.log('gameStats.js loaded');
var recievedData =0;
function UserGetsData(tournamentID){
	//console.log(tournamentID);
	statSend('UserGetsData', {tournamentID:tournamentID, login:login} );
}

function GameLoaded(tournamentID, login){
	console.log('GameLoaded : ' + tournamentID + '  ' + login);
	statSend('GameLoaded', {tournamentID:tournamentID, login:login} );
}
GameLoaded(tournamentID, login);



var rcvTimer = setInterval(function(){
	if (recievedData==1) UserGetsData(tournamentID);
	recievedData=0;
}, 3000)


function printer(data){
	console.log(data);
}

function statSend(url, data){
	//var serverHost = 'localhost/';
	var serverHost = gameHost;
	$.ajax({
		url: 'http://' + serverHost + url,
		method: 'POST',
		data: data,
		success: printer
	});
}