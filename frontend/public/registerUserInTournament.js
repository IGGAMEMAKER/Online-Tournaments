function reg(login, tID){
	ManageReg(login, tID, 'RegisterInTournament', 1);
}
function unReg(login, tID){
	ManageReg(login, tID, 'CancelRegister', 0);
}

var TREG_NO_MONEY='TREG_NO_MONEY';
var TREG_FULL='TREG_FULL';
var TREG_ALREADY = 'Registered';

function ManageReg(login, tID, url, regID){
	console.log(login);
	console.log(tID); //console.log(btn);
	
	$.ajax({
		url: url,
		method: 'POST',
		data: { login: login, tournamentID:tID },
		success: function( data ) {
			var msg = JSON.parse(data);//JSON.stringify(data);
			var txt='';

			/*if (regID==1){
				switch(msg.result){
					case 'OK': txt='You registered successfully!!'; addTournament(tID); break;
					case 'fail': txt='Register failed :(('; break;
					default : txt='Sorry, you need to login first :(('; break;
				}
			} else {
				switch(msg.result){
					case 'OK': txt='Register canceled. Check your money ammount'; break;
					case 'fail': txt='unRegister failed :(('; break;
					default : txt='Sorry, you need to login first :(('; break;
				}
			}*/

			if (regID==1) {
				// no money
				if (!isNaN(msg.result)){
					return drawPayingModal(msg.result);
				}
				console.log('ManageReg', msg.result);
				switch(msg.result){
					case 'OK': txt='Вы зарегистрировались в турнире!'; addTournament(tID); break;
					case 'fail': txt='Ошибка регистрации'; break;
					case TREG_ALREADY: txt='Вы уже зарегистрировались в турнире. Обновите страницу'; break;
					case TREG_FULL: txt='Регистрация участников завершена'; break;

					default : txt='Авторизуйтесь, чтобы сыграть'; break;
				}
			}	else {
				switch(msg.result){
					case 'OK': txt='Вы снялись с турнира. Деньги возвращены'; break;
					case 'fail': txt='Вы не участвуете в этом турнире'; break;
					default : txt='Ошибка'; break;
				}
			}

			//clearStorage();
			getProfile();
			if (!(msg.result=='fail' && regID==1)) {
				alert(txt);//msg.result
			}
			//console.log(msg);
			reload(1000);
	  }
	});
}