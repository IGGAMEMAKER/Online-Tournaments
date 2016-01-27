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
		var convert = 1;
		//$('#money').html('You have '+money/100+'$ on account');
		//$('#money').html(login + ' (' + money/convert + 'p)');

		$('#money1').html(money/convert + 'p');

		$('#balance').html("На вашем счету " + getMoneyString(money) + ": ");
		get_last(103);
		get_last(102);
		get_last(93);
		get_last(1025);
		//$(myModal).modal('show');

	};
}

function get_last(s){ //s = number
	var a = s.toString().substr(s.toString().length-1, 1);
	console.log(s, "last", a);
	return a;
}

function getMoneyString(money){
	/*var number = get_last(money);
	var word = "рублей";

	switch(number){
		case '0': word = "рублей"; break;
		case '1': word = "рубль"; break;
		case '2': word = "рубля"; break;
		case '3': word = "рубля"; break;
		case '4': word = "рубля"; break;
		default : word = "рублей"; break;
	}*/

	return money + "p" +"   ";
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

