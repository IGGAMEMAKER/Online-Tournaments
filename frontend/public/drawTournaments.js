/*var text = '<div style="" class="col-sm-3 thumbnailMax tournament sm-offset">';
text += '<center>';


			<h4 id="gname-668" class="mg-md text-center">Викторина #668</h4><!-- image-->
			<img src="/img/quiz.png" width="210" height="150">
			<h3 id="wnrs-undefined" style="height:55px; width:220px">Приз: Случайный</h3>
			<h4 class="mg-md">
				<p>Призовых мест: 1</p>
				<div id="plrs-668">Участников : 0 из 1</div>
			</h4>
			<a id="reg668" onclick="reg('g.iosebashvili',668)" style="border-radius:6px; " class="btn btn-lg btn-primary"> Играть БЕСПЛАТНО</a>
			<div id="unregister668" style="display:none;">
				<a id="unReg668" onclick="unReg('g.iosebashvili',668)" style="border-radius:6px;" class="btn btn-lg btn-danger">Сняться с турнира</a>
			</div>
		</center>
	</div>*/

function drawTournaments(){
	//var tournaments = 
}

function drawTournament(id, img, prize, winPlaces, players, Max){
	var text = '<div style="" class="col-sm-3 thumbnailMax tournament sm-offset">';
	text += '<center>';
	text += drawName(id);
				text += drawImage(img);
				text += drawPrizes(prize, id);
				text += Info(winPlaces, id, players, Max);

				text += drawReg(login, id);
				text += drawUnReg(login, id);
	text += '</center>';
	text += '</div>';
	//console.log(getLogin());
	//console.log(text);

	$("#tournamentBlock").append(text);
}

function drawStdTournament(){
	var id=668
		, img= "/img/quiz.png"
		, prize= "Случайный"
		, winPlaces= 1
		, players= 0
		, Max= 1

	setTimeout(function(){
		drawTournament(id, img, prize, winPlaces, players, Max);
	}, 400);
}

function drawName(id){
	return '<h4 id="gname-'+id+'" class="mg-md text-center">Викторина #'+id+'</h4>';
}

function drawPrizes(prize, id){
	return '<h3 id="wnrs-'+id+'" style="height:55px; width:220px">Приз: '+prize+'</h3>';
}

function drawReg(lgn, id){
	return '<a id="'+lgn+'" onclick="reg(\''+lgn+'\','+id+')" style="border-radius:6px; " class="btn btn-lg btn-primary"> Играть БЕСПЛАТНО</a>';
}

function drawUnReg(lgn, id){
	return '<div id="unregister'+id+'" style="display:none;">'+
					'<a id="unReg'+id+'" onclick="unReg(\''+lgn+'\','+id+')" style="border-radius:6px;" class="btn btn-lg btn-danger">Сняться с турнира</a>' +
				'</div>';
}

function drawImage(img){
	return '<img src="'+img+'" width="210" height="150">';
}

function Info(winPlaces, id, players, Max){
	return '<h4 class="mg-md">' +
		'<p>Призовых мест: '+winPlaces+'</p>'+
		'<div id="plrs-668">Участников : '+players+' из '+ Max+'</div>'+
	'</h4>';
}