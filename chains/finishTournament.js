var API = require('../helpers/API');

var logger = require('../helpers/logger');

var registerManager = require('./registerInTournament');

var c = require('../constants');

var sender = require('../requestSender');

var helper = require('../helpers/helper');

var sort = require('../helpers/sort');

var fs = require('fs');

var Users = require('../models/users');

var prizeTypes = {
	PRIZE_TYPE_MONEY: 1,
	PRIZE_TYPE_GIFT: 2,
	PRIZE_TYPE_POINTS: 3,
	PRIZE_TYPE_TICKETS: 4
};

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

	if (is_money_tournament) {
		for (var i = 0; i < winners.length; i++) {
			var login = winners[i].login;

			if (i < winnerCount) {
				//send winning message
				// console.log(login, 'WINS TOURNAMENT');
				aux.alert(login, c.NOTIFICATION_WIN_MONEY, obj)
			} else {
				//send lose message
				// console.log(login, 'LOSES TOURNAMENT');
				aux.alert(login, c.NOTIFICATION_LOSE_TOURNAMENT, obj)
			}
		}
	}
}

function Log() {
	console.log(arguments)
}

function dataBaseChanges(data) {
	console.log('dataBaseChanges');

	var gameID = data.gameID;
	var tournamentID = data.tournamentID;
	var scores = data.scores;
	var winners = sort.winners(scores);

	var winnerLogins = winners.map((p, i) => p.value.login);
	var winnerRegs = [];

	var getWinnerTRegs = (result) => {
		return API.tregs.winners(tournamentID, winnerLogins)
			.then(list => {
				winnerRegs = list;
				info.getWinnerTregs = list;
				return list;
			})
	};

	// console.log(scores, winners);
	TournamentLog(tournamentID, 'Winners:' + str(winners));

	// EndTournament(scores, gameID, tournamentID);

	var info = {};

	var tournament;

	API.tournaments.finish(tournamentID)
	.then(function (result) {
		info.finish = result;
		return API.tregs.clearParticipants(tournamentID)
	})
	.then(function (result) {
		info.clearParticipants = result;
		return result;
	})
	.then(getWinnerTRegs)
	.then(result => {
		return API.tournaments.find(tournamentID)
	})
	.then(function (t) {
		info.tournament = t;
		tournament = t;

		// goes in parallel
		if (needsAutoAdd(tournament)) {
			// Log('AutoAddTournament ' + JSON.stringify(tournament), c.STREAM_TOURNAMENTS);
			var youngerizedTournament = YoungerizeTournament(tournament);
			
			API.tournaments.addNewTournament(youngerizedTournament)
			.then(function (result) {
				serveTournament(youngerizedTournament)
			})
			.catch(logger.report('autoAdd', { info }))
		}

		var loginToPromo = {};
		winnerRegs.forEach(reg => {
			loginToPromo[reg.userID] = reg.promo || null;
		});

		for (i = 0; i < winners.length; i++) {
			var Prize = getPrize(tournament.Prizes, tournament.goNext, i + 1);
			var player = winners[i];
			var login = player.value.login;

			var promoter = loginToPromo[login];

			// givePrizeToPlayer(player, Prize, tournamentID, tournament, promoter);
			logger.log('givePrizeToPlayer: ' + JSON.stringify(player));
			var prizeType = Prize.type;

			switch (prizeType) {
				case prizeTypes.PRIZE_TYPE_MONEY:
					sendPrizeMoney(login, Prize, tournamentID, promoter, tournament);
					break;
				case prizeTypes.PRIZE_TYPE_GIFT:
					sendPrizeGift(login, Prize);
					break;
				case prizeTypes.PRIZE_TYPE_POINTS:
					sendPrizePoints(login, Prize);
					break;
				case prizeTypes.PRIZE_TYPE_TICKETS:
					sendPrizeTicket(login, Prize);
					break;
			}
		}
	})
	.catch(logger.report('dataBaseChanges', { info }))
	
}

function singlePromo(player, promoter, amount, tournament) {
	var isPromotable = tournament.buyIn <= 0; // tournament.settings.tag === 'regularFreeroll'

	if (!isPromotable) {
		return;
	}

	var sum = Math.floor(parseInt(amount) / 2);
	console.log(promoter + ' invited ', player, ' and deserves ', sum, '$');
	API.money.increase(promoter, sum, c.SOURCE_TYPE_PROMO);
}

function updatePromos(tournRegs) {
	if (tournRegs.length){
		var promoterIDs = {};
		var promoterIDsArray= [];

		for (var i = tournRegs.length - 1; i >= 0; i--) {
			var ID = tournRegs[i].promo;// PROMOTER ID (login)
			if (promoterIDs[ID]) {
				promoterIDs[ID]++;
			} else {
				promoterIDs[ID] = 1;
				promoterIDsArray.push(ID);
			}
		}

		for (var i = promoterIDsArray.length - 1; i >= 0; i--) {
			var promoter = promoterIDsArray[i];//parseInt
			var promoUsersCount = parseInt(promoterIDs[promoter]);

			var payment = buyIn * promoUsersCount * PROMO_COMISSION / 100;

			// Log('Promoter ' + promoter + ' invited ' + promoUsersCount + ' players and deserves to get ' + payment + ' $');
			// incrMoney(null, promoter, payment, {type:SOURCE_TYPE_PROMO, tournamentID} );
		}
	}
}

function serveTournament(tournament){
	if (!isSpecialTournament(tournament)) {
		API.tournaments.setStatus(tournament.tournamentID, c.TOURN_STATUS_REGISTER)
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

	var path = 'Logs/Tournaments/' + tournamentID + '.txt';
	var text = '\r\n' + time + ' TS: ' + message + '\r\n';

	fs.appendFile(path, text, function (err) {
		if (err) {
			Log(err); throw err;
		}
		//console.log('The "data to append" was appended to file!');
	});
}

function getPrize(Prizes, goNext, i) {
	// Log('Rewrite getPrize function. NOW YOU MUST ALL PRIZES FOR EACH PLAYER!!!');
	var roundIndex = 1;
	var next = 2;

	if (i > goNext[1]) {
		return 0;
	}

	while(next < goNext.length && goNext[next] >= i) {//playerRoundIndex<goNext.length-1 &&
		roundIndex = next;
		next = roundIndex + 1;
	}

	return Prizes[roundIndex - 1];
}

function YoungerizeTournament(tournament){
	var obj = {
		buyIn:      				tournament.buyIn,
		initFund:     			tournament.initFund,
		gameNameID:   			tournament.gameNameID,

		pricingType:  			tournament.pricingType,

		rounds:     				tournament.rounds,
		goNext:     				tournament.goNext,
		places:     				tournament.places,
		Prizes:     				tournament.Prizes,
		prizePools:   			tournament.prizePools,

		comment:    				tournament.comment,

		playersCountStatus: tournament.playersCountStatus,///Fixed or float

		startDate:    			null,
		status:       			null,
		players:      			0
	};

	if (tournament.settings) {
		obj.settings = tournament.settings;
	}

	if (isStreamTournament(tournament)) {
		obj.goNext[0] = 1;
	}

	obj.status = c.TOURN_STATUS_REGISTER;
	obj.players = 0;

	return obj;
}

function needsAutoAdd(tournament){
	return isStreamTournament(tournament) || isRegularTournament(tournament)
}

function isStreamTournament(tournament){
	return tournament.settings && tournament.settings.regularity == c.REGULARITY_STREAM;
}

function isRegularTournament(tournament){
	return tournament.settings && tournament.settings.regularity == c.REGULARITY_REGULAR;
}

function isSpecialTournament(tournament){
	return tournament.settings && tournament.settings.special == c.SPECIALITY_SPECIAL;
}

function sendPrizeMoney(login, Prize, tournamentID, promoter, tournament) {
	var src = {
		type: c.SOURCE_TYPE_WIN,
		tournamentID: tournamentID
	};

	var money = parseInt(Prize.info);

	API.money.increase(login, money, src)
		.then(function (result) {
			console.log('money increased, transfer saved', login, money, src);

			singlePromo(login, promoter, money, tournament);
		})
		.catch(logger.report('sendPrizeMoney', { src, money, login } ))
}

function sendPrizeGift(login, Prize) {
	API.usergifts.saveGift(login, Prize.info, null, Prize.colour || 4)
		.catch(logger.report('sendPrizeGift', { Prize, login }))
}

function sendPrizeTicket(login, Prize) {
	registerManager.forceRegister(Prize.info, login)
		.catch(logger.report('sendPrizeTicket', { Prize, login }))
}

function sendPrizePoints(login, Prize) {
	// console.log(API);
	// API.users.givePoints(login, parseInt(Prize.info) || 0)
	Users.givePoints(login, parseInt(Prize.info) || 0)
		.then(r => {
			logger.log('givePoints, sendPrizePoints', r, Prize);
		})
		.catch(logger.report('sendPrizePoints', { Prize, login }))
}

// sendPrizePoints('g.iosebashvili', { info: 100 });
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
