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
			saveInStorage('profile', data);
			var profile = JSON.parse(data);
			var tournaments = profile.tournaments;
			var money = profile.money;
			saveInStorage('tournaments', tournaments);
			saveInStorage('money', money);
			if(drawFunction) {drawFunction(profile);}
			else{
				$('#money').html('You have '+money/100+'$ on account');
				//alert(data);
				//console.log(data);
			}
		}
	});
}

var tmr0 = setInterval(function(){ loadProfile() }, 4000);


function saveInStorage(field, data){
	//var item = data;
	//if (typeof(data)=='object') item = JSON.stringi
	localStorage.setItem(field, data);
}
function getFromStorage(field){
	return localStorage.getItem(field);
}