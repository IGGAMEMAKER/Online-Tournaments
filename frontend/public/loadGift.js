function loadGift(giftID){
	console.log(giftID);

	$.ajax({
	  url: 'GetGift',
	  method: 'POST',
	  data: { giftID: giftID },
	  success: function( data ) {
		var msg = data;//JSON.stringify(data);
		var txt='';
		switch(data){
			//document.getElementById("reg").addEventListener("click", function() { func("#{session.login}", "#{message[0].tournamentID}");});
			case 'OK': 
				txt='You registered successfully!!'; 
				document.getElementById("reg")
				$('#gift').innerHTML = 'TRRRRRRRRRRATATA!';
			break;
			case 'fail': 
				txt='Register failed :(('; 
			break;
			
			default : 
				txt='Sorry, you need to login first :(('; 
			break;
		}
		txt = JSON.stringify(msg);

		//+showGift('')
		$('#gift').append(txt);
		alert(txt);
		console.log(msg);
		var wind = window.open('ShowGifts');//, 'TheWindow');
		wind.focus();
	  }
	});
}