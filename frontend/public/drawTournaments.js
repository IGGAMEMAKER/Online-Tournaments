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

function drawTournament(id, img, prize, winPlaces, players, Max, buyIn){
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