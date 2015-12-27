getProfile();
//hideAllButtons();
drawAuthButton();
//window.onfocus = getProfile;

var myModal = '#myModal';

function getProfile(drawFunction){
	clearStorage();
	getAsync('Profile', {}, saveProfile() );	
}

var loadedAddrs=0;

function GetTournamentAddress(tID){
	getAsync('GetTournamentAddress', {tournamentID:tID}, saveTournamentAddress(tID) );
}

function saveProfile(){
	return function (data) {
		var profile = JSON.parse(data); // prt(profile);
		var tournaments = profile.tournaments;
		var money = profile.money;

		saveInStorage('tournaments', killID(tournaments, 'tournamentID') );
		saveInStorage('money', money);

		resetRunningTournaments();
		//var tournaments = getTournaments();
		//console.log('tournaments',tournaments);
		loadedAddrs=0;
		for (var i=0; i < tournaments.length; i++){
			var tID1 = tournaments[i];
			GetTournamentAddress(tID1.tournamentID);
		}

		redrawRegButtons(tournaments);

		if(tournaments.length==0) { 
			console.log('no tournaments'); 
			drawPlayButtons(); 
		}

		//$('#money').html('You have '+money/100+'$ on account');
		$('#money').html(login + ' (' + money/100 + '$)');
		$('#money1').html(money/100 + '$');

		//$(myModal).modal('show');

	};
}

function hideAllButtons(tID){
	$('#unregister' + tID).hide();
	$('#reg' + tID).hide();
	$('#auth' + tID).hide();
}

function drawUnRegButton(tID){
	$('#unregister' + tID).show();
	$('#reg' + tID).hide();
	$('#auth' + tID).hide();
}

function drawRegButton(tID){
	$('#unregister' + tID).hide();
	$('#reg' + tID).show();
	$('#auth' + tID).hide();
}

function drawAuthButton(tID){
	$('#unregister' + tID).hide();
	$('#reg' + tID).hide();
	$('#auth' + tID).show();
}

function saveTournamentAddress(tID){
	return function (data) {
		var address = JSON.parse(data); // console.log(address); // 
		console.log(tID);
		
		setInObject('addresses', tID, address.address); // console.log(address.running);
		//var obj = getObject('addresses');
		//console.log('saveTournamentAddress', address.address);
		//console.log(obj[tID].address);
		var tournaments = getTournaments();
		loadedAddrs++;
		console.log('length', tournaments.length);
		if (loadedAddrs==tournaments.length){
			drawPlayButtons();
		}
		if (address.address.running == 1) setRunningTournaments();
	}
}

function resetRunningTournaments(){
	saveInStorage('hasRunningTournaments',0);
}

function setRunningTournaments(){
	console.log('hasRunningTournaments');
	saveInStorage('hasRunningTournaments',1);
}


function getAsync(url, data, success){
	$.ajax({
		url: url,
		method: 'POST',
		data:data,
		success: success
	});
}


function killID(arr, field){
	var list = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		list.push(arr[i][field]);
	};
	//console.log('killID result: ' + JSON.stringify(list) );
	return list;
}

