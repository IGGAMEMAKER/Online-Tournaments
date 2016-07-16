var Gifts = require('../models/gifts');
var Users = require('../models/users');
var Money = require('../models/money');
var Marathon = require('../models/marathon');
var TournamentReg = require('../models/tregs');
var Tournaments = require('../models/tournaments');


var sender = require('../requestSender');


var helper = require('../helpers/helper');

var sort = require('../helpers/sort');

var fs = require('fs');

console.log('chain finishTournament');

function notifyUsersAboutFinish(data) {
	var winners = data.scores; //sort.winners(data.scores);
	var winnerCount = data.places[1] || null;
	var prizes = data.prizes || null;

	var obj = {
		tournamentID: data.tournamentID,
		winners,
		count: winnerCount,
		prizes
	};

	console.log('FinishTournament FinishGame', obj);

	var is_money_tournament = (prizes[0] >= 2);
	console.log('is_money_tournament', is_money_tournament);

	if (is_money_tournament) {
		for (var i = 0; i < winners.length; i++) {
			var login = winners[i].login;

			if (i < winnerCount) {
				//send winning message
				console.log(login, 'WINS TOURNAMENT');
				aux.alert(login, aux.c.NOTIFICATION_WIN_MONEY, obj)
			} else {
				//send lose message
				console.log(login, 'LOSES TOURNAMENT');
				aux.alert(login, aux.c.NOTIFICATION_LOSE_TOURNAMENT, obj)
			}
		}
	}
}

function Log() {
	console.log(arguments)
}

function dataBaseChanges(data) {
	console.log('dataBaseChanges');

	var gameID = data['gameID'];
	var tournamentID = data['tournamentID'];
	var scores = data['scores'];
	var winners = sort.winners(scores);

	// console.log(scores, winners);
	TournamentLog(tournamentID, 'Winners:' + str(winners));

	// EndTournament(scores, gameID, tournamentID);

	var info = {};

	var tournament;
	// var winners;

	Tournaments.finish(tournamentID)
	.then(function (result){
		info.finish = result;
		return TournamentReg.clearParticipants(tournamentID)
	})
	.then(function (result){
		info.clearParticipants = result;
		return Tournaments.find(tournamentID)
	})
	.then(function (t){
		// console.log('get tournament info', t)
		info.tournament = t;
		tournament = t;

		// goes in parallel
		if (needsAutoAdd(tournament)){
			// Log('AutoAddTournament ' + JSON.stringify(tournament), aux.c.STREAM_TOURNAMENTS);
			var youngerizedTournament = YoungerizeTournament(tournament);
			
			Tournaments.addNewTournament(youngerizedTournament)
			.then(function (result) {
				serveTournament(youngerizedTournament)
			})
			.catch(aux.report('autoAdd', { info }))
		}

		// if (isStreamTournament(tournament)){
		// 	var topic = tournament.settings.topic || 'default';
		// 	sender.sendRequest("FinishCategoryTournament/" + topic, tournament, '127.0.0.1', 'site');
		// }

		// return givePrizes(winners, tournament)
		for (i = 0; i < winners.length; i++){
			var player = winners[i];
			var Prize = getPrize(tournament.Prizes, tournament.goNext, i+1);

			givePrizeToPlayer(player, Prize, tournamentID );
		}
	})
	// .then(function (result){
	// 	// console.log('done ALL', result, info)
	// })
	.catch(aux.report('dataBaseChanges', { info:info } ))
	
}

function serveTournament(tournament){
	if (!isSpecialTournament(tournament)) {
		Tournaments.setStatus(tournament.tournamentID, aux.c.TOURN_STATUS_REGISTER)
	}

	sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'site');

	if (isStreamTournament(tournament)){
		var topic = tournament.settings.topic || 'default';
		sender.sendRequest("FinishCategoryTournament/" + topic, tournament, '127.0.0.1', 'site');
	}

	// aux.system('autoAdd', { result: tournament })
}

var str = JSON.stringify;

function TournamentLog(tournamentID, message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) { Log(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}

function getPrize(Prizes, goNext, i){
	Log('Rewrite getPrize function. NOW YOU MUST ALL PRIZES FOR EACH PLAYER!!!');
	var roundIndex=1;
	var next = 2;

	if (i > goNext[1]){
		return 0;
	}	else {
		while(next < goNext.length && goNext[next] >= i){//playerRoundIndex<goNext.length-1 &&
			roundIndex=next;
			next = roundIndex+1;
		}
		return Prizes[roundIndex-1];
	}
}

function YoungerizeTournament(tournament){
	var obj = {
		buyIn:      				tournament.buyIn,
		initFund:     			tournament.initFund,
		gameNameID:   			tournament.gameNameID,

		pricingType:  			tournament.pricingType,

		rounds:     				tournament.rounds,
		goNext:     				tournament.goNext,//
		places:     				tournament.places,
		Prizes:     				tournament.Prizes,
		prizePools:   			tournament.prizePools,

		comment:    				tournament.comment,

		playersCountStatus: tournament.playersCountStatus,///Fixed or float
		startDate:    			null,
		status:       			null,
		players:      			0
   };
	// regular tournaments settings
	if (tournament.settings) { // && data.regularity!="0"
		obj.settings=tournament.settings;
	}

	//console.log(tournament1)
	if (isStreamTournament(tournament)) {
		obj.goNext[0] = 1;
	}

	obj.status = aux.c.TOURN_STATUS_REGISTER;
	obj.players = 0;

	return obj;
}

function needsAutoAdd(tournament){
	return isStreamTournament(tournament) || isRegularTournament(tournament)
}

function isStreamTournament(tournament){
	return tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM;
}

function isRegularTournament(tournament){
	return tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_REGULAR;
}

function isSpecialTournament(tournament){
	return tournament.settings && tournament.settings.special==aux.c.SPECIALITY_SPECIAL;
}


function givePrizeToPlayer(player, Prize, tournamentID){
	Log('givePrizeToPlayer: ' + JSON.stringify(player));
	var login = player.value.login;
	
	if (isNaN(Prize) ){ //gift
		if (Prize.MP && !isNaN(Prize.MP)){
			Marathon.giveNpoints(login, parseInt(Prize.MP) || 10)
		} else {
			Gifts.user.saveGift(login, Prize.giftID, Prize.isCard || null, Prize.colour || 4)
			.then(function (result){
				console.log('saveGift', result)
			})
			.catch(aux.report('Prize is gift:', { Prize:Prize, login:login } ))
		}

	}	else { //money
		if (Prize>0){
			var src = { type: aux.c.SOURCE_TYPE_WIN, tournamentID:tournamentID };
			
			Money.increase(login, Prize, src)
			.then(function (result){
				console.log('money increased, transfer saved', login, Prize, src)
			})
			.catch(aux.report('mmmMoney', { src:src, Prize:Prize, login:login } ))
		}
	}
}

function finishTournament(data){

	dataBaseChanges(data);

	notifyUsersAboutFinish(data)
}


var aux;
module.exports = function(_aux){
	aux = _aux;

	return {
		finish: finishTournament
	}
};
