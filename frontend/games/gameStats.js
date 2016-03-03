console.log('gameStats.js loaded');
var recievedData =0;
var rcvTimer = setInterval(function(){
	if (recievedData==1) UserGetsData(tournamentID);
	recievedData=0;
}, 3000);

function UserGetsData(tournamentID){
	//console.log(tournamentID);
	// statSend('UserGetsData', {tournamentID:tournamentID, login:login} );
	stat2('UserGetsData', {tournamentID:tournamentID, login:login} );
}

function GameLoaded(tournamentID, login){
	console.log('GameLoaded : ' + tournamentID + '  ' + login);
	statSend('GameLoaded', {tournamentID:tournamentID, login:login} );
}

// GameLoaded(tournamentID, login);


function printer(data){ console.log(data); }

function stat2(url, data){
	//var serverHost = 'localhost/';
	var serverHost = gameHost;
	console.log(serverHost);////'http://' + serverHost+'/' + url,
	$.ajax({
		url: url // sends stats to site(clientStats)->Statistics.js
		, method: 'POST'
		, data: data
		, success: printer
	});
}

function statSend(url, data){
	//var serverHost = 'localhost/';
	var serverHost = gameHost;
	console.log(serverHost);////'http://' + serverHost+'/' + url,
	$.ajax({
		url: 'http://' + serverHost+'/' + url // sends stats to site(clientStats)->Statistics.js
		, method: 'POST'
		, data: data
		, success: printer
	});
}