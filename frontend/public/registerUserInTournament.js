function func(login, tID){
	ManageReg(login, tID, 'RegisterInTournament', 1);
}
function unReg(login, tID){
	ManageReg(login, tID, 'CancelRegister', 0);
}
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
		}
		else{
			switch(msg.result){
				case 'OK': txt='Register canceled. Check your money ammount'; break;
				case 'fail': txt='unRegister failed :(('; break;
				default : txt='Sorry, you need to login first :(('; break;
			}
		}*/
		if (regID==1){
			switch(msg.result){
				case 'OK': txt='You registered successfully!!'; addTournament(tID); break;
				case 'fail': txt='Register failed :(('; break;
				default : txt='Sorry, you need to login first :(('; break;
			}
		}
		else{
			switch(msg.result){
				case 'OK': txt='Register canceled. Check your money ammount'; break;
				case 'fail': txt='unRegister failed :(('; break;
				default : txt='Sorry, you need to login first :(('; break;
			}
		}
		alert(txt);//msg.result
		console.log(msg);
	  }
	});
}