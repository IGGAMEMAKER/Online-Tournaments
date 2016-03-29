var Marathon = require('../models/marathon')
var Packs = require('../models/packs')
var Gifts = require('../models/gifts')

var Users = require('../models/users')

var TournamentReg = require('../models/tregs')
var Tournaments = require('../models/tournaments')

var increaseMoney;


var helper = require('../helpers/helper')

var sort = require('../helpers/sort');

var fs = require('fs')

console.log('chain finishTournament')

function notifyUsersAboutFinish(data){
	var winners = data.scores//sort.winners(data.scores);
	var winnerCount = data.places[1] || null;
	var prizes = data.prizes || null;

	var obj = { 
		tournamentID : data.tournamentID,
		winners:winners,
		count:winnerCount,
		prizes:prizes 
	}

	console.log('FinishTournament FinishGame', obj);

	var is_money_tournament = (prizes[0] >= 2);
	console.log('is_money_tournament', is_money_tournament);
	if (is_money_tournament){
		//show win or lose message
		for (var i = 0; i < winners.length; i++) {
			var winner = winners[i];
			var login = winner.login;

			if (i<winnerCount){
				//send winning message
				console.log(login, 'WINS TOURNAMENT')
				aux.alert(login, aux.c.NOTIFICATION_WIN_MONEY, obj)
			} else {
				//send lose message
				console.log(login, 'LOSES TOURNAMENT')
				aux.alert(login, aux.c.NOTIFICATION_LOSE_TOURNAMENT, obj)
			}
		}
	} else {
		//send custom messages
		Marathon.get_current_marathon()
		.then(function (marathon){
			var mainPrize = marathon.prizes[0];

			for (var i = 0; i < winners.length; i++) {
				var user = winners[i];
				var login = user.login

				sendAfterGameNotification(login, mainPrize);
			}
		})
	}
}

function Log(){
	console.log(arguments)
}

function sendAfterGameNotification(login, mainPrize){
  Users.profile(login)
  .then(function (profile){
    if (!profile) return null;
    var profileInfo = profile.info;
    
    var notificationCode='';
    // if (!profileInfo) {
    //   // notificationCode 
    // } else {
      // what we can send?
      // win
      // lose

      // advise (if newbie)
      // rating +

      // check
      // was it money tournament?
      // did he win money?
      // is
      var is_newbie = (!profileInfo || !profileInfo.status || profileInfo.status==aux.c.USER_STATUS_NEWBIE) ;
      if (is_newbie){
        // //show newbie messages
        // //analyze, what he knows about us

        // show hello message
        aux.alert(login, aux.c.NOTIFICATION_FIRST_MESSAGE, { mainPrize: mainPrize })

        console.log('mark, that user received first message','USER_STATUS_READ_FIRST_MESSAGE')

        Users.update_user_status(login, aux.c.USER_STATUS_READ_FIRST_MESSAGE)
        .catch(function (err){
          console.error('update_user_status failed', err);
        })

      } else {
        // send rating
        // console.log('send NOTIFICATION_MARATHON_CURRENT. must be function of getMarathonUser');

        var card = Packs.get_after_game_card()
        var giftID = card.giftID;
        card.isFree = true;
        // console.log('grant card', card)

        Gifts.user.saveGift(login, giftID, true, card.colour)
        .then(function (result){
          return aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card)
        })
        .catch(console.error)

        // var marathonUser = getMarathonUser(login);
        // marathonUser.mainPrize = mainPrize;
        // aux.alert(login, aux.c.NOTIFICATION_MARATHON_CURRENT, marathonUser)

        // send advices
        // send bonuses
      }
  })
  .catch(function (err){
    console.error('sendAfterGameNotification', err);
  })
}

function dataBaseChanges(data){
	console.log('dataBaseChanges')

	var gameID = data['gameID'];
	var tournamentID = data['tournamentID'];
	var scores = data['scores'];
	winners = sort.winners(scores);

	TournamentLog(tournamentID, 'Winners:' + str(winners));

	// EndTournament(scores, gameID, tournamentID);

	// give marathon points to participants
	// 
	var info = {}

	var tournament;
	var winners;

	TournamentReg.participants(tournamentID)
	.then(give_marathon_points) // parallel. returns undefined
	.then(function (result){
		info.marathonPointsGiven = result;
		// console.log('marathonPoints given', result)

		// return Tournaments.running(tournamentID)
		return Tournaments.finish(tournamentID)
	})
	.then(function (result){
		info.finish = result;

		// console.log('status finish is set', result)
		// console.log('Tournaments.finish', result)
		return TournamentReg.clearParticipants(tournamentID)
	})
	.then(function (result){
		info.clearParticipants = result;

		// console.log('TournamentReg.clearParticipants', result)
		return Tournaments.find(tournamentID)
	})
	.then(function (t){
		// console.log('get tournament info', t)
		info.tournament = t;
		tournament = t;

		// goes in parallel
		if (needsAutoAdd(tournament)){
			Log('AutoAddTournament ' + JSON.stringify(tournament), aux.c.STREAM_TOURNAMENTS);
			var youngerizedTournament = YoungerizeTournament(tournament);
			
			Tournaments.addNewTournament(youngerizedTournament)
			.then(function (result) {
				aux.system('autoAdd', { result: youngerizedTournament })
			})
			.catch(aux.report('autoAdd', { info:info } ))

			// return AutoAddTournament()
		}

		return givePrizes(winners, tournament)

		// WinPrize({winners:obj, tournamentID:tournamentID});
		// return obj;
	})
	.then(function (result){
		console.log('done ALL', result, info)
	})
	.catch(aux.report('WinPrize', { info:info } ))
	
}

function givePrizes(winners, tournament){
	var tournamentID = tournament.tournamentID;

	for (i=0; i < winners.length; i++){// && i <Prizes.Prizes.length
		var player = winners[i];
		var Prize = getPrize(tournament.Prizes, tournament.goNext, i+1);

		givePrizeToPlayer(player, Prize, tournamentID );
	}
}

function WinPrize(data){
	Log(str(data));
	var winners = data.winners;
	var tournamentID = data.tournamentID;


	var tournament;
	// LoadPrizes(tournamentID, winners);
	console.log('WinPrize')
	Tournaments.finish(tournamentID) // setTournStatus(tournamentID, TOURN_STATUS_FINISHED);
	.then(function (result){
		console.log('status finish is set', result)
		return Tournaments.find(tournamentID)
	})
	.then(function (t){
		tournament = t;

		for (i=0; i < winners.length; i++){// && i <Prizes.Prizes.length
			var player = winners[i];
			var Prize = getPrize(tournament.Prizes, tournament.goNext, i+1);
			console.log('givePrizeToPlayer', player, Prize, tournamentID)
			givePrizeToPlayer(player, Prize, tournamentID );
		}
	})
	.then(function (result){
		return TournamentReg.clearParticipants(tournamentID)
		// return KillFinishedTournaments()
	})
	.catch(aux.report('WinPrize', { tournament : tournament||null } ))

	//Tournament.remove({tournamentID:})
	// UpdatePromos(tournamentID);

	// Tournament.findOne({tournamentID:tournamentID}, '', function (err, tournament){
	// 	if (err) {Log('Tournament find err: ' + JSON.stringify(err), STREAM_TOURNAMENTS); }
	// 	if (tournament && (isStreamTournament(tournament) || isRegularTournament(tournament)) ){
	// 		// console.log('AutoAddTournament');
	// 		AutoAddTournament(tournament);
	// 	}
	// })

}

var str = JSON.stringify

function give_marathon_points_to_user(login, MarathonID){
	console.error('give_marathon_points_to_user', login, MarathonID);

	Marathon.find_or_create_user(login, MarathonID)
	.then(function (user){
		// console.error('user found or created', user);
		return Marathon.increase_points(login, MarathonID);
	})
	.then(function (result){
		Log('increased marathon points to ' + login + '  ' + str(result), aux.c.STREAM_GAMES);
	})
	.catch(helper.catcher);
}

function give_marathon_points(tregs){
	Marathon.get_current_marathon()
	.then(function (marathon){
		if (marathon){
			var MarathonID = marathon.MarathonID;
			// console.error('got marathon', marathon, tregs.length - 1);
			for (var i = tregs.length - 1; i >= 0; i--) {
				var login = tregs[i].userID;
				// console.error('trying to increase marathon points to ' + login + '  ', tregs[i]);
				Log('trying to increase marathon points to ' + login + '  ', aux.c.STREAM_GAMES);
				give_marathon_points_to_user(login, MarathonID);
			};
		}
	})
	.catch(helper.catcher);

}

function TournamentLog(tournamentID, message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) { Log(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}

function killID(arr, field){
	var list = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		list.push(arr[i][field]);
	};
	Log('killID result: ' + JSON.stringify(list) );
	return list;
}

function KillFinishedTournament(tournamentID){
	return TournamentReg.clearParticipants(tournamentID)
	// return TournamentReg.update({ tournamentID : tournamentID,}, { $set: { status : aux.c.TOURN_STATUS_FINISHED } }, {multi: true})
}

function getPrize(Prizes, goNext, i){
	Log('Rewrite getPrize function. NOW YOU MUST ALL PRIZES FOR EACH PLAYER!!!');
	var roundIndex=1;
	var next = 2;
	if (i>goNext[1]){
		return 0;

	}	else {
		while(next<goNext.length && goNext[next] >= i){//playerRoundIndex<goNext.length-1 && 
			roundIndex=next;
			next = roundIndex+1;
		}
		return Prizes[roundIndex-1];
	}
}

function YoungerizeTournament(tournament){
	var obj = {
		buyIn:      tournament.buyIn,
		initFund:     tournament.initFund,
		gameNameID:   tournament.gameNameID,

		pricingType:  tournament.pricingType,

		rounds:     tournament.rounds,
		goNext:     tournament.goNext,//
		places:     tournament.places,
		Prizes:     tournament.Prizes,
		prizePools:   tournament.prizePools,

		comment:    tournament.comment,

		playersCountStatus: tournament.playersCountStatus,///Fixed or float
		startDate:    null,
		status:       null,
		players:      0
   }
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

function AutoAddTournament (tournament1){
	Log('AutoAddTournament ' + JSON.stringify(tournament1), c.STREAM_TOURNAMENTS);
	var tournament = YoungerizeTournament(tournament1);
	
	Tournament
		.findOne({})
		.sort('-tournamentID')
		.exec(function searchTournamentWithMaxID (err, maxTournament){
		if (!err){
			if (maxTournament) {
				addTournament(maxTournament.tournamentID, tournament);
			} else { 
				addTournament(0,tournament); 
			}
		}	else {
			Log('adding failed: ' + JSON.stringify(err), [c.STREAM_TOURNAMENTS, c.STREAM_ERROR] );	
		}
	});
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
	Log('WinPrize: ' + JSON.stringify(player));
	var login = player.login;
	
	if (isNaN(Prize) ){
		//gift
		Log('Prize is gift: ' + JSON.stringify(Prize));
		Gifts.user.saveGift(login, Prize.giftID, Prize.isCard||null, Prize.colour || 4)
		.then(function (result){
			console.log('saveGift', result)
		})
		.catch(aux.report('Prize is gift:', { Prize:Prize, login:login } ))

		// var userGift = new UserGift( {userID:login, giftID: Prize.giftID} );
		// userGift.save(function (err){
		// 	if (err){Error(err);}
		// 	else{
		// 		Stats('GivePrize', {tournamentID: tournamentID});
		// 	}
		// });
	}	else {
		//money
		Log('mmmMoney!! ' + Prize);
		if (Prize>0){
			var src = { type: aux.c.SOURCE_TYPE_WIN, tournamentID:tournamentID };

			increaseMoney.increase(login, Prize, src)
			.then(function (result){
				console.log('mmmMoney', login, Prize, src)
			})
			.catch(aux.report('mmmMoney', { src:src, login:login } ))

			// User.update( {login:login}, {$inc: { money: Prize }} , function (err,count) {
			// 	if (err){ Error(err); return; }
				
			// 	Log(count); 
			// 	saveTransfer(login, Prize, { type:SOURCE_TYPE_WIN, tournamentID:tournamentID } );
			// 	Stats('GivePrize', {tournamentID: tournamentID});
			// });
		}
	}
}

function LoadPrizes(tournamentID, winners){
	Log('LoadPrizes');
	var prizeArray=[];
	Tournament.findOne( {tournamentID:tournamentID}, 'Prizes goNext', function (err, Prizes){
		if (err){ Error(err); }
		else {
			//var curRound=1;
			Log('Prizes: ' + JSON.stringify(Prizes));
			for (i=0; i< winners.length;i++){// && i <Prizes.Prizes.length
				var player = winners[i];
				var Prize = getPrize(Prizes.Prizes, Prizes.goNext,  i+1);
				givePrizeToPlayer(player, Prize, tournamentID );

				prizeArray.push({prize:Prize, login:player.login})
			}
			//SendWinners(prizeArray, tournamentID);
		}
	});
}

function finishTournament(data){

	dataBaseChanges(data)

	notifyUsersAboutFinish(data)
}


var aux;
module.exports = function(_aux){
	aux = _aux;

	// KillFinishedTournament(1000)
	// .then(function (result){
	// 	console.log('KillFinishedTournament', 1000)
	// })
	increaseMoney = require('./increaseMoney')(aux)

	return {
		finish: finishTournament
	}
}