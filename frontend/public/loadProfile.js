/*function loadTournaments (argument) {
	$.ajax({
		url: 'UserTournaments',
		method: 'POST',
		data: {  },
		success: function( data ) {
			saveInStorage('tournaments', data);
		}
	});
}
function loadMoney (){
	$.ajax({
		url: 'UserMoney',
		method: 'POST',
		data: {  },
		success: function( data ) {
			saveInStorage('money', data);
		}
	});
}*/
function loadProfile(drawFunction){
	$.ajax({
		url: 'Profile',
		method: 'POST',
		data: { },
		success: function( data ) {
			//saveInStorage('profile', data);
			var profile = JSON.parse(data);

			var tournaments = profile.tournaments;
			var money = profile.money;

			saveInStorage('tournaments', killID(tournaments, 'tournamentID') );
			saveInStorage('money', money);

			if(drawFunction) {drawFunction(profile);}
			else{
				$('#money').html('You have '+money/100+'$ on account');
				//alert(data);
				//console.log(data);
			}

		}
	});

	var tournaments = killID(getTournaments(), 'tournamentID') ;
	console.log(tournaments);
	for (var i=0; i < tournaments.length; i++ ){
		var tID = tournaments[i];

		$.ajax({
			url: 'GetTournamentAddress',
			method: 'POST',
			data: { tournamentID: tID },
			success: function( data ) {

				var address = JSON.parse(data);
				console.log(address);
				setInObject('addresses', tID, address);
				/*saveInStorage('tournaments', killID(tournaments, 'tournamentID') );
				saveInStorage('money', money);*/
			}
		});
	}
}
loadProfile();
var tmr0 = setInterval(function(){ loadProfile() }, 4000);

function killID(arr, field){
	var list = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		list.push(arr[i][field]);
	};
	//console.log('killID result: ' + JSON.stringify(list) );
	return list;
}

function saveInStorage(field, data){
	var item = data;
	if (typeof(data)=='object') {
		//console.log('object');
		item = JSON.stringify(data);
	}
	localStorage.setItem(field, item);
}
function getFromStorage(field){
	return localStorage.getItem(field);
}