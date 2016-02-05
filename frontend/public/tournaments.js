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
	//console.log(login);
	//console.log(tID); //console.log(btn);
	
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
					case 'OK': txt='Вы снялись с турнира. Деньги возвращены'; deleteTournament(tID);drawRegButton(tID); break; //drawRegButton(tID);
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
			//reload(1000);
	  }
	});
}

function drawTournaments(){
	//var tournaments = 
}

const HIDE_DELAY = 3000;
const ANIM_SPEED = 2000;

function hideTournament(id){
	setTimeout(function(){
		//alert("hiding " + id);
		$("#tournamentWrapper"+id).hide(ANIM_SPEED);
	}, HIDE_DELAY);
}

//hideTournament(587);
function getImageUrl(t){
	var ID = t.tournamentID;

	if (t.settings && t.settings.special) {
		return 'img/'+ID+'.jpg';
	}	else {
		return "/img/quiz.png";
	}
}

var REGULARITY_NONE=0;
var REGULARITY_REGULAR=1;
var REGULARITY_STREAM=2;

function isStream(t){
	return t.settings && t.settings.regularity==REGULARITY_STREAM ;
}

function isSpecial(t){
	return t.settings && t.settings.special;
}

function getPrize(t){
	var prize = t.Prizes[0];
	console.log("prize ", prize);
	var ID = t.tournamentID;

	if (isSpecial(t)) {
		return showPrize(prize, t.settings.specPrizeName, ID);
	}	else {
		if (isStream(t)) {
			return 'Приз: Случайный';
		} else {
			return showPrize(prize, "", ID);
		}
	}
}

function showPrize(prize, specPrize, ID){
	if (specPrize && specPrize.length>0) {
		return specPrize;
	} else {
		if (prize){
			if (isNaN(prize)){
				return "Приз: " + prize;
			}	else {
				return "Приз: " + prize +"р";
			}
		}
	}
}


function parseAndDrawTournament(tournament){
  var tournamentID = tournament.tournamentID;
  var status = tournament.status;
  
	var players = tournament.players;
  var maxPlayers = tournament.goNext[0];

  var winnerPlaces = tournament.goNext[1];
  var buyIn = tournament.buyIn;

	var id= tournamentID
	, img= getImageUrl(tournament)
	, prize= getPrize(tournament)
	, winPlaces= winnerPlaces
	, players= players
	, Max= maxPlayers

	setTimeout(function(){
		drawTournament(id, img, prize, winPlaces, players, Max, buyIn);
	}, 2000*0);
}

function drawTournament1(id, img, prize, winPlaces, players, Max, buyIn){
	var text = '<div style="display:none;" id="tournamentWrapper'+id+'" class="col-sm-3 thumbnailMax tournament sm-offset">';
	text += '<center>';
	text += drawName(id);
				text += drawImage(img);
				text += drawPrizes(prize, id);
				text += Info(winPlaces, id, players, Max);

				text += drawReg(buyIn, id, login||null);
				text += drawUnReg(login||null, id);
				text += drawAuth(id);
	text += '</center>';
	text += '</div>';
	//console.log(getLogin());
	//console.log(text);
	//console.log("drawTournament ", id)
	/*console.log("drawTournament ", img)*/

	$("#tournamentBlock").prepend(text);
	hideAllButtons(id);
	redraw_reg_button({tournamentID:id});

	//drawAuthButton(id);
	$("#tournamentWrapper"+id).show(ANIM_SPEED);
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
	}, 2000);
}

function drawName(id){
	return '<h4 id="gname-'+id+'" class="mg-md text-center">Викторина #'+id+'</h4>';
}

function drawPrizes(prize, id){
	return '<h3 id="wnrs-'+id+'" style="height:55px; width:220px">'+prize+'</h3>';
}

function drawReg(buyIn, id, lgn){
	var phrase = "Играть БЕСПЛАТНО";
	if (buyIn>0) phrase = "Играть за "+buyIn+" р";
	return '<a id="reg'+id+'" onclick="reg(\''+lgn+'\','+id+')" style="border-radius:6px; " class="btn btn-lg btn-primary"> '+phrase+'</a>';
}

function drawUnReg(lgn, id){
	return '<div id="unregister'+id+'" style="display:none;">'+
					'<a id="unReg'+id+'" onclick="unReg(\''+lgn+'\','+id+')" style="border-radius:6px;" class="btn btn-lg btn-danger">Сняться с турнира</a>' +
				'</div>';
}

function drawAuth(ID){
	return '<div id="auth'+ID+'">'+
		'<h4> Авторизуйтесь, чтобы сыграть </h4>'+
		'<a id="lgn'+ID+'" href="login" class="btn btn-lg btn-danger" style="border-radius:6px;" > Авторизоваться </a>'+
	'</div>'
}

function drawImage(img){
	return '<img src="'+img+'" width="210" height="150">';
}

function Info(winPlaces, id, players, Max){
	return '<h4 class="mg-md">' +
		'<p>Призовых мест: '+winPlaces+'</p>'+
		'<div id="plrs-' + id + '">Участников : '+players+' из '+ Max+'</div>'+
	'</h4>';
}



//
function drawTournament(id, img, prize, winPlaces, players, Max, buyIn){
	text += drawName(id);
				text += drawImage(img);
				text += drawPrizes(prize, id);
				text += Info(winPlaces, id, players, Max);

				text += drawReg(buyIn, id, login||null);
				text += drawUnReg(login||null, id);
				text += drawAuth(id);
	
	//var text = '<div id="tournamentWrapper'+id+'" class="col-sm-6 col-md-4">';
	text += 
	text += '<center>';
	text += '</center>';
	text += '</div>';
	var text = '<div class="col-sm-6 col-md-4"><div class="ticket-card"><div class="cover">';
	text += drawImage(img);
	text += '<div class="info"><div class="going"><i class="fa fa-group">'
	text += getPlayerCount(); //25 играют
	text += '</i></div><div class="tickets-left"><i class="fa fa-ticket">';
	text += getPrizePlaces(); //5 Мест
	text += '</i></div></div></div><div class="body"><div class="artist"><h6 class="info">Тема</h6><h4 class="name">';
	text += getTopic(); //Музыка
	text += '</h4></div><div class="price"><div class="from">Приз</div><div class="value">';
	text += getMainPrize(); //5000 <b>₽</b>
	text += '</div></div><div class="clearfix"></div><div class="info"><p class="location"><i class="fa fa-map-marker">';
	text += getBuyIn(); //Цена : 100₽
	text += '</i></p><p class="date"><i class="fa fa-calendar">'
	text += getPrizeCount(); //Призовых мест: 1
	text += '</i></p></div><div class="clearfix"></div></div><div class="collapse"><ul class="list-unstyled">'
	text += buttons() 
	<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	</ul></div><div class="footer"><button class="btn toggle-tickets">Регистрация закрыта</button></div></div></div>
	//console.log(getLogin());
	//console.log(text);
	//console.log("drawTournament ", id)
	/*console.log("drawTournament ", img)*/

	$("#tournamentBlock").prepend(text);
	hideAllButtons(id);
	redraw_reg_button({tournamentID:id});

	//drawAuthButton(id);
	$("#tournamentWrapper"+id).show(ANIM_SPEED);
}


mixin showTournament()
	div(class="col-sm-6 col-md-4")
		div(class="ticket-card")
			+cover()
			+cardBody()
			+collapse()

mixin draw_image()
	img(src="http://s28.postimg.org/p916fev0t/week.jpg" alt="")

mixin draw_registered()
	div(class="going")
		i(class="fa fa-group") 5 Участвуют

mixin draw_maxPlayers()
	div(class="tickets-left")
		i(class="fa fa-ticket") 25 Мест

mixin draw_prize_count()
	p(class="date")
		i(class="fa fa-calendar") Призовых мест: 1

mixin draw_main_prize()
	div(class="value") 5000 
		b ₽

mixin draw_buyin()
	p(class="location")
		i(class="fa fa-map-marker") Цена : 100₽
mixin draw_topic()
	h4(class="name") Музыка

mixin cover()
	div(class="cover")
		+draw_image()
		div(class="info")
			+draw_registered()
			+draw_maxPlayers()


mixin cardBody()
	div(class="body")
		div(class="artist")
			h6(class="info") Тема
			+draw_topic()
		div(class="price")
			div(class="from") Приз
			+draw_main_prize()
		div(class="clearfix")
		div(class="info")
			+draw_buyin()
			+draw_prize_count()
		div(class="clearfix")

mixin click_down()
	li
		div(class="ticket")
			h5 Basic Ticket
				br
				small 25 Tickets left
		div(class="price")
			div(class="value")
				b $
				| 599
		a(href="#" class="btn btn-info btn-sm btn-buy") Buy Now!

mixin collapse()
	div(class="collapse")
		ul(class="list-unstyled")
			+click_down()
			+click_down()
			+click_down()

	div(class="footer")
		button(class="btn toggle-tickets")
			| Регистрация закрыта

