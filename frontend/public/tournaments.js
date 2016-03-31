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
const REG_FIELD = '#register';
const AUTH_FIELD = '#auth';

function hideAllButtons(tID, don_t_removeClass){
  //console.log('hideAllButtons');
  
  $(UN_REG_FIELD + tID).hide();
  $(REG_FIELD + tID).hide();
  $(AUTH_FIELD + tID).hide();

  if (!don_t_removeClass) $('#bgd'+tID).removeClass('participating');
}

function drawUnRegButton(tID){

  $(UN_REG_FIELD + tID).show();
  $(REG_FIELD + tID).hide();
  $(AUTH_FIELD + tID).hide();

  $('#bgd'+tID).addClass('participating');
  //setToggle(tID, 'Вы участвуете в турнире. Дождитесь начала')
}

function drawRegButton(tID){
  //console.log('drawRegButton');

  $(UN_REG_FIELD + tID).hide();
  $(REG_FIELD + tID).show();
  $(AUTH_FIELD + tID).hide();

  $('#bgd'+ tID).removeClass('participating');
  //setToggle(tID, 'Вы можете принять участие')
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
      // drawTournamentStatus(tID, TOURN_STATUS_REGISTER)
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

// function getTournamentsFromServer(){
// 	setAsync('/Tournaments', {}, function (tournaments){
// 		if (tournaments) drawTournaments(tournaments);
// 	})
// }

function drawTournaments(tournaments){
  // for (var i = tournaments.length - 1; i >= 0; i--) {
  for (var i = 0; i < tournaments.length; i++) {
    var tournament = tournaments[i];
    var ID = tournament.tournamentID;

    if (!tournament_exists(ID) ) {
      parseAndDrawTournament(tournament);
    } else {
      redrawTournament(tournament);
    }
  };
}

/* $('.element').fadeTo(1000, 0.5, function() { $('.element').fadeTo(800, 1); }); */

socket.on('update', function (msg){
  var tournaments = msg.tournaments;
  //console.log("---------------");
  if (tournaments) drawTournaments(tournaments);

  // for (var i = tournaments.length - 1; i >= 0; i--) {
  //   var tournament = tournaments[i];
  //   var ID = tournament.tournamentID;

  //   if (!tournament_exists(ID) ) {
  //     //var tLikeObject = JSON.parse(JSON.stringify(tournament));
  //     //console.log("new tournament", tournament.tournamentID, JSON.stringify(tournament) );
  //     //drawNewTournament(tournament);

  //     parseAndDrawTournament(tournament);
  //   } else {
  //     redrawTournament(tournament);
  //   }
  //   //console.log("update-"+i, tournaments[i]);
  // };

  //var frontendVersion; = msg.frontendVersion.value;
  
  //console.log('msg.frontendVersion', frontendVersion);
  if (msg.frontendVersion && msg.frontendVersion.value) {
    updateFrontend(msg.frontendVersion.value);
  }
});

	// if ($(window).width() < 400) {
	// 	//alert('Less than 400');
	// }
	// else {
	// 	//alert('More than 400');
	// }

socket.on('leaderboard', function (msg){
	drawRating(msg);
})


const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

function redraw_tournament_actions(tID){
	//redrawRegButtons(tournaments);
	return function(profile){
		redraw_reg_button({ tournamentID:tID });
	}
}

function redrawTournament(tournament){
  var players = tournament.players;
  var maxPlayers = tournament.goNext[0];

  var tournamentID = tournament.tournamentID;
  var status = tournament.status;

  //console.log("redrawTournament", tournamentID, players, maxPlayers, status);
  var plrs = '<i class="fa fa-group fa-lg"></i>' + getPlayerCount(players, maxPlayers);
  $("#plrs-"+tournamentID).html(plrs);// + '<br>'+status

  //updateTournamentButtonsByID(tournamentID);
  redraw_reg_button({tournamentID: tournamentID});
  drawTournamentStatus(tournamentID, status);
}

function drawTournamentStatus(tournamentID, status){
	var text;
	if (userIsRegisteredIn(tournamentID)){
		switch(status){
			case TOURN_STATUS_RUNNING:
				text = 'Турнир начался, играйте!'
				var element = '#bgd'+ tournamentID;
				miniBlink(element, 1000);

				draw_playButton(tournamentID);
				hideAllButtons(tournamentID, true);
				//$(element).fadeTo(blink_period/4, 0.5).fadeTo(blink_period/4, 1.0);
			break;
			case TOURN_STATUS_FINISHED: text = 'Турнир завершён <br>ждём вас в других турнирах'; break;
			case TOURN_STATUS_REGISTER: text = 'Вы участвуете. <br>Дождитесь заполнения турнира'; break;
			default: text = 'Подробнее'; break;
		}	
	} else {
		switch(status){
			case TOURN_STATUS_RUNNING : text = 'Турнир запущен'; break;
			case TOURN_STATUS_FINISHED: text = 'Турнир завершён'; break;
			case TOURN_STATUS_REGISTER: text = 'Участвовать'; break;
			default: text = 'Подробнее'; break;
		}	
	}

	//text = 'Я водитель НЛО'
	setToggle(tournamentID, text);
}

function reg(login, tID) { ManageReg(login, tID, 'RegisterInTournament', 1); }
function unReg(lgn, tID) { ManageReg(login, tID, 'CancelRegister', 0); }

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
	redraw_reg_button({tournamentID: id})
}

var TREG_NO_MONEY='TREG_NO_MONEY';
var TREG_FULL='TREG_FULL';
var TREG_ALREADY = 'Registered';

function ManageReg(login, tID, url, regID){
	//console.log('ManageReg', url, login, regID);
	
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
					case 'OK': txt='Вы зарегистрировались в турнире!'; addTournament_to_storage(tID); /*register_success(tID);*/ break;
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

			if (msg.result=='fail' && regID==1) {
				alert(txt);//msg.result
			}

			//alert(txt);
			//console.log(msg);
			//reload(1000);
	  }
	});
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
		return "/img/std_cover.jpg";//quiz.png
	}
}

function setToggle(tID, text){
	$("#toggle"+tID).html(text);
}

var REGULARITY_NONE=0;
var REGULARITY_REGULAR=1;
var REGULARITY_STREAM=2;


var TOURNAMENT_TYPE_NORMAL = 0;

var TOURNAMENT_TYPE_REGULAR = 1;
var TOURNAMENT_TYPE_SPECIAL = 2;
var TOURNAMENT_TYPE_STREAM = 3;
var TOURNAMENT_TYPE_TOPIC = 4;
var TOURNAMENT_TYPE_TOPIC_STREAM = 5;


function isStream(t) { return t.settings && t.settings.regularity==REGULARITY_STREAM ; }
function isSpecial(t) { return t.settings && t.settings.special; }

function isTopic(t) { return t.settings && t.settings.topic }

function tournamentType(t){
	if (isStream(t)) {
		if (isTopic(t)) return TOURNAMENT_TYPE_TOPIC_STREAM;

		return TOURNAMENT_TYPE_STREAM;
	}
	
	if (isSpecial(t)) return TOURNAMENT_TYPE_SPECIAL;

	if (isTopic(t)) return TOURNAMENT_TYPE_TOPIC;

	return TOURNAMENT_TYPE_NORMAL;
}

function getPrize(t){
	var prize = t.Prizes[0];
	//console.log("prize ", prize);
	var ID = t.tournamentID;

	if (isSpecial(t)) {
		return showPrize(prize, t.settings.specPrizeName, ID);
	}	else {
		if (isStream(t)) {
			return '+<a href="#ratingField">Марафон</a>';//Приз:  aria-expanded="true"  data-toggle="tab"
		} else {
			return showPrize(prize, "", ID);
		}
	}
}

function ruble(){ return 'P'; }

function showPrize(prize, specPrize, ID){
	if (specPrize && specPrize.length>0) {
		return specPrize;
	} else {
		if (prize){
			if (isNaN(prize)){
				return "" + prize;//Приз: 
			}	else {
				return "" + prize +" "+ruble();//Приз: 
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

	drawTournament(id, img, prize, winPlaces, players, Max, buyIn, tournament);
	// setTimeout(function(){
	// }, 2000*0);
}


function drawImage(img, tournament){
	console.log('drawImage', tournament.settings)
	if (tournamentType(tournament) == TOURNAMENT_TYPE_TOPIC){
		return '<img src="/img/topics/' + tournament.settings.topic + '.jpg" >';
	}
	return '<img src="'+img+'" >';//width="210" height="150" // width="280" height="220"
}

//
function pasteID(id){	return '№' + id; }
function getPlayerCount(players, Max){ return 'Игроки : '+ players + '/'+Max; }
function getMaxPlayers(winPlaces){ return winPlaces + ' Мест'; }
function getTopic(){ return 'Произвольная'; }
function getMainPrize(prize){ return prize + ' '; }

function getBuyIn(buyIn){
	if (buyIn == 0){
		return 'Цена : БЕСПЛАТНО';
	}
	return 'Цена : '+buyIn+' ' + ruble(); 
}
function getPrizeCount(winPlaces){ return 'Призовых мест: '+winPlaces; }

/*function drawReg(id, lgn, buyIn){
	var phrase = "Играть БЕСПЛАТНО";
	if (buyIn>0) phrase = "Играть за "+buyIn+" р";
	//return '<a id="reg'+id+'" onclick="reg(\''+lgn+'\','+id+')" style="border-radius:6px; " class="btn btn-lg btn-primary"> '+phrase+'</a>';

	return draw_tournament_action('register'+id , 'reg'+id, 'Участвовать в турнире', 'и выиграть приз!', 'reg(\''+lgn+'\','+id+')', null, 'Участвовать', '-'+buyIn)
}

function drawUnReg(id, lgn, buyIn){
	// return '<div id="unregister'+id+'" style="display:none;">'+
	// 				'<a id="unReg'+id+'" onclick="unReg(\''+lgn+'\','+id+')" style="border-radius:6px;" class="btn btn-lg btn-danger">Сняться с турнира</a>' +
	// 			'</div>';

	return draw_tournament_action('unregister'+id , 'unReg'+id, 'Отказаться от турнира', 'деньги будут возвращены', 'unReg(\''+lgn+'\','+id+')', null, 'Отказаться', '+'+buyIn)
}

function drawAuth(id){
	// return '<div id="auth'+ID+'">'+
	// 	'<h4> Авторизуйтесь, чтобы сыграть </h4>'+
	// 	'<a id="lgn'+ID+'" href="login" class="btn btn-lg btn-danger" style="border-radius:6px;" > Авторизоваться </a>'+
	// '</div>'
	return draw_tournament_action('auth'+id , 'lgn'+id, 'Авторизуйтесь, чтобы сыграть', 'это быстро!', null, 'Login', 'Авторизоваться')
}*/

// 

function drawReg(id, lgn, buyIn){
	var phrase = 'Участвовать';// 'Участвовать'
	if (buyIn>0) phrase = "Играть за "+buyIn+" р";

	return draw_tournament_action('register'+id , 'reg'+id, 'Участвовать в турнире', 'и выиграть приз!', 'reg(\''+lgn+'\','+id+')', null, phrase, '-'+buyIn)
}

function drawUnReg(id, lgn, buyIn){

	// return draw_tournament_action('unregister'+id , 'unReg'+id, 'Отказаться от турнира', 'деньги будут возвращены', 'unReg(\''+lgn+'\','+id+')', null, 'Отказаться', '+'+buyIn)
	return draw_tournament_action('unregister'+id , 'unReg'+id, 'Вы участвуете в турнире', 'деньги будут возвращены', null, null, 'Вы участвуете в турнире <br>Дождитесь начала', '+'+buyIn)
}

function drawAuth(id){
	return draw_tournament_action('auth'+id , 'lgn'+id, 'Авторизуйтесь, чтобы сыграть', 'это быстро!', null, 'Login', 'Авторизоваться')
}


// function draw_playButton(tournamentID){
// 	if (!play_button_exists(tournamentID)){
// 		//var host
// 		var addresses   = getObject('addresses');
// 		//console.log(addresses, tournamentID);
// 		var address = getAddressFromAddrList(addresses, tournamentID);
// 		console.log(address, tournamentID);
// 		var host = address.host;
// 		var port = address.port;

// 		var addr = 'http://'+host+':'+port+'/Game?tournamentID='+tournamentID;

// 		var onclick = "mark('mark/game/push')";

// 		var txt = '<li id="play-btn'+tournamentID + '">'+
// 		'<form id="play-btn'+tournamentID+'" method="post" onclick="'+onclick + '" action="'+addr+'"  target="_blank"> '

// 		+ '<input type="hidden" name="login" value="'+login+'" />'
// 		+ '<input type="submit" class="btn btn-default" value="ИГРАТЬ!" />'
// 		+ '</form>'
// 		+ '</li>';

// 		$('#btn-list'+tournamentID).append(txt);
// 		// hide all buttons
// 	}
// }

function draw_playButton(tournamentID){
	if (!play_button_exists(tournamentID)){
		//var host
		var addresses   = getObject('addresses');
		//console.log(addresses, tournamentID);
		var address = getAddressFromAddrList(addresses, tournamentID);
		console.log(address, tournamentID);
		var host = address.host;
		var port = address.port;

		var addr = 'http://'+host+':'+port+'/Game?tournamentID='+tournamentID;

		var onclick = "mark('mark/game/push')";

		// var text = '<a class="btn toggle-tickets wrap-text"';
		// if (href) text += ' href="' + href + '"';
		// if (onclick) text += ' onclick="'+ onclick + '"';//reg(\''+lgn+'\','+id+')
		
		// text += 'id="'+ block_id +'">' + CTA + '</a>';
	

		var txt = '<li id="play-btn'+tournamentID + '">'+
		'<form id="play-btn'+tournamentID+'" method="post" onclick="'+onclick + '" action="'+addr+'"  target="_blank"> '

		+ '<input type="hidden" name="login" value="'+login+'" />'
		+ '<input type="submit" class="btn btn-default" value="ИГРАТЬ!" />'
		+ '</form>'
		+ '</li>';

		// function draw_tournament_action(block_id, id_field, button_name, secondary_name, onclick, href, CTA, price_field){
	/*var text = '<a class="btn toggle-tickets wrap-text"';
	if (href) text += ' href="' + href + '"';
	if (onclick) text += ' onclick="'+ onclick + '"';//reg(\''+lgn+'\','+id+')
	
	text += 'id="'+ block_id +'">' + CTA + '</a>';*/

		$("#footer"+tournamentID).append(txt);
		// hide all buttons
	}
}

// function draw_tournament_action(block_id, id_field, button_name, secondary_name, onclick, href, CTA, price_field){
// 	var text = '<li id="'+ block_id + '">'+
// 	'<div class="ticket"><h5>' + button_name + '<br><small>'+secondary_name+'</small></h5></div>'+
// 	'<div class="price"><div class="value">';
// 	if (price_field ) { text += '<b>$</b>' + price_field; }
// 	text+= '</div></div>'+
// 	'<a class="btn btn-info btn-sm btn-buy" ';//'>Участвовать</a>'+

// 	if (id_field) text += ' id="'+id_field+ '"';
// 	if (onclick) text += ' onclick="'+ onclick + '"';//reg(\''+lgn+'\','+id+')

// 	if (href) text += ' href="' + href + '"';
// 	text += '>'+ CTA +'</a>'+
// 	'</li>';//"reg'+id+'"

// 	return text;
// }

function draw_tournament_action(block_id, id_field, button_name, secondary_name, onclick, href, CTA, price_field){
	var text = '<a class="btn toggle-tickets wrap-text"';
	if (href) text += ' href="' + href + '"';
	if (onclick) text += ' onclick="'+ onclick + '"';//reg(\''+lgn+'\','+id+')
	
	text += 'id="'+ block_id +'">' + CTA + '</a>';
	
	// var text = '<li id="'+ block_id + '">'+
	// '<div class="ticket"><h5>' + button_name + '<br><small>'+secondary_name+'</small></h5></div>'+
	// '<div class="price"><div class="value">';
	// if (price_field ) { text += '<b>$</b>' + price_field; }
	// text+= '</div></div>'+
	// '<a class="btn btn-info btn-sm btn-buy" ';//'>Участвовать</a>'+

	// if (id_field) text += ' id="'+id_field+ '"';

	// text += '>'+ CTA +'</a>'+
	// '</li>';//"reg'+id+'"

	return text;
}

function buttons(id, lgn, buyIn){
	// return '<ul class="list-unstyled" id="btn-list'+id+'">'+
	return '' + drawReg(id, lgn, buyIn) +
	drawUnReg(id, lgn, buyIn) +
	drawAuth(id);

	/*'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" id="unregister'+id+'" class="btn btn-info btn-sm btn-buy">Сняться</a></li>' + 
	'<li><div class="ticket"><h5>Basic Ticket<br><small>25 Tickets left</small></h5></div><div class="price"><div class="value"><b>$</b>599</div></div><a href="#" class="btn btn-info btn-sm btn-buy">Buy Now!</a></li>' +*/
	
	// '</ul>';
}

function draw_cover(id, img){
	return '<div class="cover">' +
	drawImage(img) + 
	'</div>' ;
}

function draw_players_and_id(id, players, Max){
	return '<div class="info">' + 
		'<div class="going" id="plrs-' + id + '"'+' ><i class="fa fa-group fa-lg"></i>' + getPlayerCount(players, Max) + '</div>' +
		'<div class="tickets-left">' + pasteID(id) + '</div>' +
	'</div>'
}

var blink_period = 2000;

function blink(tID){
	var element = '.ticket-card';
	
	setTimeout(function(){
		//light(element);
		//$(element).fadeTo(blink_period/2, 0.5).fadeTo(blink_period/2, 1.0);
		miniBlink(element, blink_period);
		blink();
	}, blink_period);
}

function miniBlink(element, period){
	$(element).fadeTo(period/2, 0.5).fadeTo(period/2, 1.0);
}

//setTimeout(blink, 3000);

function drawTournament(id, img, prize, winPlaces, players, Max, buyIn, t){
	//var text = '<div id="tournamentWrapper'+id+'" class="col-sm-6 col-md-4">';

	var text = '<div class="col-sm-6 col-md-4" id="tournamentWrapper'+id+'"><div class="ticket-card" id="bgd'+id+'" >';
	text += '<div class="cover">' + drawImage(img, t) + '</div>';
	
	/*text += '<div class="info">'
		text += '<div class="going" id="plrs-' + id + '"'+' ><i class="fa fa-group fa-lg"></i>' + getPlayerCount(players, Max) + '</div>';//<i class="fa fa-ticket"></i>
		text += '<div class="tickets-left">' + pasteID(id) + '</div>';
	text += '</div>';*/

	// text += '<div class="body">';
	// text += draw_players_and_id(id, players, Max);
	// text += '<br><br>'
	// text += '<div class="artist"><h6 class="info">Тема викторины</h6><h4 class="name">';
	// text += getTopic(); //Музыка
	// text += '</h4></div><div class="price"><div class="from">Приз</div><div class="value">';
	// text += getMainPrize(prize); //5000 <b>₽</b>
	// text += '</div></div><div class="clearfix"></div><div class="info"><p class="location"><i class="fa fa-money"></i>';
	// text += getBuyIn(buyIn); //Цена : 100₽
	// text += '</p><p class="date"><i class="fa fa-gift fa-lg"></i>';//fa-calendar
	// text += getPrizeCount(winPlaces); //Призовых мест: 1
	// text += '</p></div>';
	// text += '<div class="clearfix"></div></div><div class="collapse">'
	// // text += buttons(id, login, buyIn) 
	// text += '</div>';
	// text += '<div class="footer" id="footer'+id+'">'
	// // text += '<button class="btn toggle-tickets wrap-text" id="toggle'+ id +'">Участвовать</button>'
	// text += buttons(id, login, buyIn) 
	// text += '</div></div></div>'



	text += '<div class="body">';
	text += draw_players_and_id(id, players, Max);
	text += '<br>'
	// text += '<div class="artist">';
	// text += getTopic(); //Музыка
	text += '<div class="price text-center"><div class="from">Призы</div>';


	// if (winPlaces == 1){
	// 	text += '<div class="value">';
	// 	text += getMainPrize(prize); //5000 <b>₽</b>
	// 	text += '</div>';
	// } else {
	if (isStream(t)) {
		text += '<div class="value">';
		text += getMainPrize(prize); //5000 <b>₽</b>
		text += '</div>';
	} else {
		
		for (var i = 0; i < winPlaces; i++){
			var ii = i+1;
			text += '<div class="value">';
			text += ii + "-е место : " + getMainPrize(prize); //5000 <b>₽</b>
			text += '</div>';
		}
	}
	// }
	// text += '<br>'
	text += '</div><div class="clearfix"></div>';

	// text += '<div class="info">';
	// text += '<p class=""><i class="fa fa-money"></i>' + getBuyIn(buyIn) + '</p>'; //Цена : 100₽

	// // text += '<p class="date"><i class="fa fa-gift fa-lg"></i>';//fa-calendar
	// // text += getPrizeCount(winPlaces); //Призовых мест: 1
	// // text += '</p>'
	
	// text += '</div>';
	
	text += '<div class="clearfix"></div></div><div class="collapse">'
	// text += buttons(id, login, buyIn) 
	text += '</div>';
	text += '<div class="footer" id="footer'+id+'">'
	// text += '<button class="btn toggle-tickets wrap-text" id="toggle'+ id +'">Участвовать</button>'
	text += buttons(id, login, buyIn) 
	text += '</div></div></div>'

	$("#tournamentBlock").prepend(text);
	// hideAllButtons(id);
	redraw_reg_button({tournamentID:id});

	$("#tournamentWrapper"+id).show(ANIM_SPEED);
	// set_toggle_collapse_listener(id);
}

function set_toggle_collapse_listener(tournamentID){
	$('#toggle'+tournamentID).click(function() {
	  $tickets = $(this).parent().siblings('.collapse');
	 
	  if ($tickets.hasClass('in')) {
	    $tickets.collapse('hide');
	    //$(this).html('Подробнее');
	    $(this).closest('.ticket-card').removeClass('active');
	  } else {
	    $tickets.collapse('show');
	    $(this).html('Свернуть');
	    $(this).closest('.ticket-card').addClass('active');
	  }
	});
}