getProfile();

//hideAllButtons();
//drawAuthButton();
//window.onfocus = getProfile;

var myModal = '#myModal';

function getProfile(drawFunction){
	console.log("getProfile");
	clearStorage();
	getAsync('Profile', {}, saveProfile(drawFunction||null) );	
}

var loadedAddrs=0;

function GetTournamentAddress(tID){
	getAsync('GetTournamentAddress', {tournamentID:tID}, saveTournamentAddress(tID) );
}

function sendInviter(){
	var inviter = getCookie('inviter');
	var inviter_type= getCookie('inviter_type') || 0;
	if (inviter){
		// alert(inviter, inviter_type);
		deleteCookie('inviter');
		deleteCookie('inviter_type');

		mark('setInviter/' + inviter_type + '/' + inviter, { }, 'GET');
	}
}

sendInviter();

function exists(element){ return document.getElementById(element); }

function saveProfile(drawFunction){
	return function (data) {
		console.log('saveProfile');

		var profile = JSON.parse(data); prt(profile);
		var tournaments = profile.tournaments||{}; // tregs
		var money = profile.money;

		var marathon = profile.marathon;
		console.log('marathon info', marathon);



		saveInStorage('money', money);
		saveInStorage('tournaments', killID(tournaments, 'tournamentID') );

		saveInStorage('marathon', marathon);

		resetRunningTournaments();

		// Marathon page
		if (exists('accelerator0') && marathon && marathon.accelerator){
			var accelerator = marathon.accelerator;

			console.log('it means, that i am on marathon page');
			var acceleratorIndex = parseInt(accelerator.index);
			console.log('acceleratorIndex', acceleratorIndex)
			// var acceleratorIndex = 0
			for (var i = acceleratorIndex; i >= 0; i--) {
				$("#accelerator"+i).hide();
			};

			$("#todayConditions").html("Вы обладаете ускорителем " + accelerator.value);
			// alert('exists');
		}

		//var tournaments = getTournaments();
		//console.log('tournaments',tournaments);

		loadedAddrs=0;
		for (var i=0; i < tournaments.length; i++){
			var tID1 = tournaments[i];
			GetTournamentAddress(tID1.tournamentID);
		}

		if (drawFunction) drawFunction();

		if(tournaments.length==0) { 
			// console.log('no tournaments'); 
			drawPlayButtons(); 
		}
		var convert = 1;

		if (isNaN(money)){
			money = parseInt(money);
		}
		
		$('#balance').html("  На вашем счету " + getMoneyString(money) + ": ");

		$('#money1').html(money + 'p');


		//$(myModal).modal('show');

	};
}

function get_last(s){ //s = number
	var a = s.toString().substr(s.toString().length-1, 1);
	console.log(s, "last", a);
	return a;
}

function getMoneyString(money){ return money + "p" +"   "; }

function saveTournamentAddress(tID){
	return function (data) {
		var address = JSON.parse(data); // console.log(address); // 
		//console.log(tID);
		
		setInObject('addresses', tID, address.address); // console.log(address.running);
		
		//var obj = getObject('addresses');
		//console.log('saveTournamentAddress', address.address);
		//console.log(obj[tID].address);

		var tournaments = getTournaments();
		loadedAddrs++;
		//console.log('length', tournaments.length);
		if (loadedAddrs==tournaments.length){
			drawPlayButtons();
		}
		if (address.address.running == 1) setRunningTournaments();
	}
}

function resetRunningTournaments(){
	saveInStorage('hasRunningTournaments', 0);
}

function setRunningTournaments(){
	// console.log('hasRunningTournaments');
	saveInStorage('hasRunningTournaments', 1);
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

