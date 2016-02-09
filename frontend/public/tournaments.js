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

const UN_REG_FIELD= '#unregister';// '#UN_REG_FIELD';
const REG_FIELD = '#reg';
const AUTH_FIELD = '#auth';

function hideAllButtons(tID){
  //console.log('hideAllButtons');
  
  $(UN_REG_FIELD + tID).hide();
  $(REG_FIELD + tID).hide();
  $(AUTH_FIELD + tID).hide();

  $('#bgd'+tID).removeClass('participating');
}

function drawUnRegButton(tID){
  //console.log('drawUnRegButton');

  $(UN_REG_FIELD + tID).show();
  $(REG_FIELD + tID).hide();
  $(AUTH_FIELD + tID).hide();

  $('#bgd'+tID).addClass('participating');
}

function drawRegButton(tID){
  //console.log('drawRegButton');

  $(UN_REG_FIELD + tID).hide();
  $(REG_FIELD + tID).show();
  $(AUTH_FIELD + tID).hide();

  $('#bgd'+ tID).removeClass('participating');
}

function drawAuthButton(tID){
  //console.log('drawAuthButton');

  $(UN_REG_FIELD + tID).hide();
  $(REG_FIELD + tID).hide();
  $(AUTH_FIELD + tID).show();
}

function redraw_reg_button(tournament){
  var tID = tournament.tournamentID;
  //console.log('look at ', tID);
  if (login){
    if (userIsRegisteredIn(tID)){
      drawUnRegButton(tID); //console.log('userIsRegisteredIn');
    } else {
      drawRegButton(tID); //console.log('no register');
    }
  } else {
    drawAuthButton(tID); //console.log('no auth');

  }

}

function redrawRegButtons(tournaments){
  for (var i = tournaments.length - 1; i >= 0; i--) {
    redraw_reg_button(tournaments[i])
  };
}

socket.on('update', function (msg){
  var tournaments = msg.tournaments;
  var frontendVersion = msg.frontendVersion.value;
  //console.log('msg.frontendVersion', frontendVersion);
  //console.log("---------------");
  for (var i = tournaments.length - 1; i >= 0; i--) {
    var tournament = tournaments[i];
    var ID = tournament.tournamentID;

    if ( !tournament_exists(ID) ) {
      //var tLikeObject = JSON.parse(JSON.stringify(tournament));
      //console.log("new tournament", tournament.tournamentID, JSON.stringify(tournament) );
      drawNewTournament(tournament);
      //parseAndDrawTournament(tournament);
    } else {
      redrawTournament(tournament);
    }

    //console.log("update-"+i, tournaments[i]);
  };

  if (frontendVersion) {
    updateFrontend(frontendVersion);
  }
});


const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

function redraw_tournament_actions(tID){
	//redrawRegButtons(tournaments);
	return function(profile){
		//console.log('redraw_tournament_actions', profile, tID);
		redraw_reg_button({ tournamentID:tID });
		/*if (profile && profile.tournaments && profile.tournaments.length>0){
			var t = profile.tournaments[tID];
			
			
		}*/
	}
}

function redrawTournament(tournament){
  var players = tournament.players;
  var maxPlayers = tournament.goNext[0];

  var tournamentID = tournament.tournamentID;
  var status = tournament.status;

  //console.log("redrawTournament", tournamentID, players, maxPlayers, status);
  var plrs = '<i class="fa fa-group fa-lg"></i>'+getPlayerCount(players, maxPlayers);
  $("#plrs-"+tournamentID).html(plrs);

  //updateTournamentButtonsByID(tournamentID);
  redraw_reg_button({tournamentID: tournamentID});
  //drawTournamentStatus(tournamentID, status);
}

//function check_buttons()

function reg(login, tID){
	ManageReg(login, tID, 'RegisterInTournament', 1);
}
function unReg(login, tID){
	ManageReg(login, tID, 'CancelRegister', 0);
}

function addTournament_to_storage(tournamentID){
  var tournaments = getTournaments();
  tournaments.push(tournamentID);
  saveInStorage('tournaments', tournaments);
}

function deleteTournament_from_storage(tournamentID){
  var tournaments = getTournaments();
  for (var i = tournaments.length - 1; i >= 0; i--) {
    if (tournaments[i]== tournamentID){
      var a = tournaments.splice(i,1);
      return saveInStorage('tournaments', a);
    }
  };
}

function updateTournamentButtonsByID(id){
	//var tournament = 
	redraw_reg_button({tournamentID: id})
}

var TREG_NO_MONEY='TREG_NO_MONEY';
var TREG_FULL='TREG_FULL';
var TREG_ALREADY = 'Registered';

function ManageReg(login, tID, url, regID){
	//console.log('ManageReg', url, login, regID);
	//console.log(login);
	//console.log(tID); //console.log(btn);
	
	$.ajax({
		url: url,
		method: 'POST',
		data: { login: login, tournamentID:tID },
		success: function( data ) {
			var msg = JSON.parse(data);//JSON.stringify(data);
			var txt='';
			if (regID==1) {
				// no money
				if (!isNaN(msg.result)){
					console.log('TREG_NO_MONEY');
					return drawPayingModal(msg.result);
				}
				console.log('ManageReg', msg.result);
				switch(msg.result){
					case 'OK': txt='Вы зарегистрировались в турнире!'; register_success(tID); break;
					case 'fail': txt='Ошибка регистрации'; break;
					case TREG_ALREADY: txt='Вы уже зарегистрировались в турнире. Обновите страницу'; break;
					case TREG_FULL: txt='Регистрация участников завершена'; break;

					default : txt='Авторизуйтесь, чтобы сыграть'; break;
				}
			}	else {
				switch(msg.result){
					case 'OK': txt='Вы снялись с турнира. Деньги возвращены'; deleteTournament_from_storage(tID); drawRegButton(tID); break; //drawRegButton(tID);
					case 'fail': txt='Вы не участвуете в этом турнире'; break;
					default : txt='Ошибка'; break;
				}
			}

			//clearStorage();
			

			getProfile(redraw_tournament_actions);

			/*if (!(msg.result=='fail' && regID==1)) {
				alert(txt);//msg.result
			}*/

			alert(txt);
			//console.log(msg);
			//reload(1000);
	  }
	});
}

function register_success(tID){
  //$('#bgd'+tID).addClass('participating');
  addTournament_to_storage(tID);

  //drawRegButton(tID);
  //alert('Вы зарегистрировались в турнире!');
	//participating

	//getProfile();
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
		return "/img/713228168_131408_5354824504548356806.jpg";//quiz.png
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
			return 'Случайный';//Приз: 
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
				return "" + prize;//Приз: 
			}	else {
				return "" + prize +" ₽";//Приз: 
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
	return '<img src="'+img+'" width="280" height="220">';//width="210" height="150"
}

function Info(winPlaces, id, players, Max){
	return '<h4 class="mg-md">' +
		'<p>Призовых мест: '+winPlaces+'</p>'+
		'<div id="plrs-' + id + '">Участников : '+players+' из '+ Max+'</div>'+
	'</h4>';
}



//
function getPlayerCount(players, Max){
	return 'Игроки : '+ players + '/'+Max;
}

function pasteID(id){
	return '№' + id;
}
function getMaxPlayers(winPlaces){
	return winPlaces + ' Мест';
}

function getTopic(){
	return 'Музыка';
}

function getMainPrize(prize){
	return prize + ' ';
}

function getBuyIn(buyIn){
	return 'Цена : '+buyIn+' ₽';
}

function getPrizeCount(winPlaces){
	return 'Призовых мест: '+winPlaces;
}

function drawReg(id, lgn, buyIn){
	var phrase = "Играть БЕСПЛАТНО";
	if (buyIn>0) phrase = "Играть за "+buyIn+" р";
	//return '<a id="reg'+id+'" onclick="reg(\''+lgn+'\','+id+')" style="border-radius:6px; " class="btn btn-lg btn-primary"> '+phrase+'</a>';
	return draw_tournament_action('reg'+id, 'Участвовать в турнире', '', 'reg(\''+lgn+'\','+id+')', null, 'Участвовать', '-'+buyIn)
}

function drawUnReg(id, lgn, buyIn){
	/*return '<div id="unregister'+id+'" style="display:none;">'+
					'<a id="unReg'+id+'" onclick="unReg(\''+lgn+'\','+id+')" style="border-radius:6px;" class="btn btn-lg btn-danger">Сняться с турнира</a>' +
				'</div>';*/
	return draw_tournament_action('unReg'+id, 'Отказаться от турнира', 'деньги будут возвращены', 'unReg(\''+lgn+'\','+id+')', null, 'Отказаться', '+'+buyIn)
}

function drawAuth(id){
	/*return '<div id="auth'+ID+'">'+
		'<h4> Авторизуйтесь, чтобы сыграть </h4>'+
		'<a id="lgn'+ID+'" href="login" class="btn btn-lg btn-danger" style="border-radius:6px;" > Авторизоваться </a>'+
	'</div>'*/
	return draw_tournament_action('lgn'+id, 'Авторизуйтесь, чтобы сыграть', 'это быстро!', null, 'Login', 'Авторизоваться')
}

function draw_playButton(){

}

function draw_tournament_action(id_field, button_name, secondary_name, onclick, href, CTA, price_field){
	var text = '<li>'+
	'<div class="ticket"><h5>' + button_name + '<br><small>'+secondary_name+'</small></h5></div>'+
	'<div class="price"><div class="value">';
	if (price_field ) { text += '<b>$</b>' + price_field; }
	text+= '</div></div>'+
	'<a class="btn btn-info btn-sm btn-buy" ';//'>Участвовать</a>'+

	if (id_field) text += ' id="'+id_field+ '"';
	if (onclick) text += ' onclick="'+ onclick + '"';//reg(\''+lgn+'\','+id+')

	if (href) text += ' href="' + href + '"';
	text += '>'+ CTA +'</a>'+
	'</li>';//"reg'+id+'"

	return text;
}

//function drawButton(id, lgn){
	/*return '<li>'+
		'<div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div>'+
		'<div class="price"><div class="value"><b>$</b>599</div></div>'+
		'<a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a>'+
		'</li>';*/

		/*var text = '<li>';
		var */

	/*return '<li>'+
		'<div class="ticket"><h5>Basic Ticket<br><small>1 Tickets left</small></h5></div>'+
		'<div class="price"><div class="value"><b>$</b>599</div></div>'+
		'<a id="reg'+id+'" onclick="reg(\''+lgn+'\','+id+')" class="btn btn-info btn-sm btn-buy">Участвовать</a>'+
		'</li>';*/
/*	
	return draw_tournament_action('reg'+id, 'Basic Ticket', '1 Tickets left', 'reg(\''+lgn+'\','+id+')', null, 'Участвовать', '607')
}*/



function buttons(id, lgn, buyIn){
	return 	'<ul class="list-unstyled">'+
	drawReg(id, lgn, buyIn) +
	drawUnReg(id, lgn, buyIn) +
	drawAuth(id) +
	//drawButton(id, lgn) +

	/*'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" id="unregister'+id+'" class="btn btn-info btn-sm btn-buy">Сняться</a></li>' + 
	'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>' +
	'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>' +*/
	'</ul>';
}

function drawTournament(id, img, prize, winPlaces, players, Max, buyIn){
	//var text = '<div id="tournamentWrapper'+id+'" class="col-sm-6 col-md-4">';

	var text = '<div class="col-sm-6 col-md-4" id="tournamentWrapper'+id+'"><div class="ticket-card" id="bgd'+id+'" ><div class="cover">';
	text += drawImage(img);
	text += '<div class="info"><div class="going" id="plrs-' + id + '"'+' ><i class="fa fa-group fa-lg"></i>'
	text += getPlayerCount(players, Max); //25 играют
	text += '</div><div class="tickets-left">';//<i class="fa fa-ticket"></i>
	text += pasteID(id); //5 Мест
	text += '</div></div></div><div class="body"><div class="artist"><h6 class="info">Тема викторины</h6><h4 class="name">';
	text += getTopic(); //Музыка
	text += '</h4></div><div class="price"><div class="from">Приз</div><div class="value">';
	text += getMainPrize(prize); //5000 <b>₽</b>
	text += '</div></div><div class="clearfix"></div><div class="info"><p class="location"><i class="fa fa-money"></i>';
	text += getBuyIn(buyIn); //Цена : 100₽
	text += '</p><p class="date"><i class="fa fa-gift fa-lg"></i>';//fa-calendar
	text += getPrizeCount(winPlaces); //Призовых мест: 1
	text += '</p></div><div class="clearfix"></div></div><div class="collapse">'
	text += buttons(id, login, buyIn) 
	/*'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>
	</ul>'*/
	text += '</div><div class="footer"><button class="btn toggle-tickets">Участвовать</button></div></div></div>'
	//console.log(getLogin());
	//console.log(text);
	//console.log("drawTournament ", id)
	/*console.log("drawTournament ", img)*/

	$("#tournamentBlock").prepend(text);
	hideAllButtons(id);
	redraw_reg_button({tournamentID:id});

	$("#tournamentWrapper"+id).show(ANIM_SPEED);

	/*$("#tournamentBlock").prepend(text);
	hideAllButtons(id);
	redraw_reg_button({tournamentID:id});

	//drawAuthButton(id);
	$("#tournamentWrapper"+id).show(ANIM_SPEED);*/
}
setTimeout(function(){
	$('.toggle-tickets').click(function() {
	  $tickets = $(this).parent().siblings('.collapse');
	 
	  if ($tickets.hasClass('in')) {
	    $tickets.collapse('hide');
	    $(this).html('Подробнее');
	    $(this).closest('.ticket-card').removeClass('active');
	  } else {
	    $tickets.collapse('show');
	    $(this).html('Свернуть');
	    $(this).closest('.ticket-card').addClass('active');
	  }
	});
}, 1500);
/*
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

*/