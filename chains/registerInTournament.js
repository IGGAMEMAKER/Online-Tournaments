var Packs = require('../models/packs')
var Gifts = require('../models/gifts')
var Users = require('../models/users')
var Money = require('../models/money')
var Marathon = require('../models/marathon')
var TournamentReg = require('../models/tregs')
var Tournaments = require('../models/tournaments')


var sender = require('../requestSender');


var helper = require('../helpers/helper')
var sort = require('../helpers/sort');

var fs = require('fs')

function getRegistrableTournament(tournamentID){
	var is_stream = { 'settings.regularity': aux.c.REGULARITY_STREAM }
	var is_running = { status: aux.c.TOURN_STATUS_RUNNING }
	var is_available_stream = { $and : [is_stream, is_running] }

	var is_registrable = { status: aux.c.TOURN_STATUS_REGISTER }

	var is_available = { $or: [ is_registrable, is_available_stream ] }
	
	var query = { $and : [{tournamentID:tournamentID}, is_available] };

	return Tournaments.findByQuery(query)
}

var Fail = {
	result: 'fail'
};
var OK = {
	result: 'OK'
}

var configs = require('../configs');
var gameHost = configs.gameHost;

var requestsOfPlayer;

var playerRequests = []

var tournaments;

var queue = {
}

var Log = function(){
	console.log(arguments);
}

var Answer = sender.Answer;

function TournamentLog(tournamentID, message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) { Log(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}

function getPortAndHostOfGame(gameNameID){
	Log('getPortAndHostOfGame. REWRITE IT!!!!');

	switch (gameNameID)
	{
		case 1: return { port:5009, host: gameHost }; break; // PPServer
		case 2: return { port:5010, host: gameHost }; break; // QuestionServer
		case 3: return { port:5011, host: gameHost };	break; // BattleServer
		default:
			//Log('Some strange gameNameID !!' + gameNameID,'WARN');
			return { port:5010, host: gameHost };//QuestionServer
		break;
	}
}

var str = JSON.stringify;

function StartTournament(tournamentID, force, res){
	var gameNameID;
	// var players;
	Log("Tournament " + tournamentID + " starts", aux.c.STREAM_TOURNAMENTS);

	Tournaments.find(tournamentID)
	.then(function (tournament){
		gameNameID = tournament.gameNameID;
		// return gameNameID;
		return TournamentReg.participants(tournamentID)
	})
	.then(function (regs){
		var players = [];
		//var obj = [];
		for (var a in regs){ players.push( regs[a].userID);	}

		var obj = getPortAndHostOfGame(gameNameID);
		obj.tournamentID = tournamentID;
		obj.logins = players;
		if (force) obj.force = true;

		//Log('StartTournament: ' + str(obj), STREAM_TOURNAMENTS);
		TournamentLog(tournamentID, 'Tournament starts... ' + str(players));
		TournamentLog(tournamentID, 'start Object:' + str(obj));


		sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer');
		if (res) Answer(res, OK);
	})
	.then(function (result){
		return Tournaments.start(tournamentID)
		// setTournStatus(tournamentID, TOURN_STATUS_RUNNING);
	})
	.then(function (result){
		aux.system('RegisterUserInTournament.StartTournament', {result:result, tournamentID:tournamentID})
		// console.log('tournament', tournamentID, 'start', result)
	})
	.catch(aux.report('RegisterUserInTournament.StartTournament', {tournamentID:tournamentID}))
}

function register(tournamentID, login, res){
	// console.log('register', tournamentID, login, queue)

	if (!queue[tournamentID]) queue[tournamentID] = { };
	// console.log(queue)
	if (queue[tournamentID][login]) return Answer(res, Fail);

	queue[tournamentID][login] = 1;

	console.log('register', login, 'to', tournamentID)

	var buyIn;
	var playerCount;
	var maxPlayers;
	var TT;

	var info = {}


	return getRegistrableTournament(tournamentID)
	.then(function (tournament) {
		// console.log('getRegistrableTournament')
		// info.tournament = tournament;

		// console.log(tournament);

		var TOURNAMENT_TYPE_STREAM = 2;
		var TOURNAMENT_TYPE_PAID = 3;


		TT = tournament;
		buyIn = tournament.buyIn;
		playerCount = tournament.players;
		maxPlayers = tournament.goNext[0];

		// var typeOfTournament=TOURNAMENT_TYPE_PAID;

		// if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM){
		// 	typeOfTournament = TOURNAMENT_TYPE_STREAM;
		// }

		// queue[tournamentID].places = maxPlayers;
		var is_stream = false;
		if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM) is_stream = true;

		var has_player_count_limitation = is_stream;

		// console.log('has_player_count_limitation', has_player_count_limitation)
		// console.log('playerCount', playerCount, 'maxPlayers', maxPlayers, buyIn)

		if (is_stream) return 1; 		// no check, go to next step

		// check max players count
		if (playerCount < maxPlayers) { // pay money
			if (buyIn>0) { 
				return Money.pay(login, buyIn, { type:aux.c.SOURCE_TYPE_BUY_IN, tournamentID:tournamentID })
			}
			return 1;
		}
		
		throw aux.c.TREG_FULL

		// if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM){
		// 	sender.sendRequest("Join", {login:login, gameID:tournamentID} ,'127.0.0.1', tournament.gameNameID);
		// } 
		// return findTournamentReg(tournamentID, login);
	})
	.then(function (result){
		// console.log('passed payment')
		info['waitsForReg'] = result;
		return TournamentReg.registerUser(login, tournamentID, 'gaginho')
	})
	.then(function (result){
		info['TournamentReg.registerUser'] = result;

		return TournamentReg.participants(tournamentID)
		.then(function (participants){
			return Tournaments.updateByID(tournamentID, { players:participants.length || 0 })
		})
		// return changePlayersCount(tournamentID); 
	})
	.then(function (saved){
		info['changePlayersCount'] = saved;
		queue[tournamentID][login] = null;

		if (res) Answer(res, OK);

		aux.done(login, 'tournament.join', {tournamentID:tournamentID});
		
		if (TT.settings && TT.settings.regularity==aux.c.REGULARITY_STREAM){
			sender.sendRequest("Join", {login:login, gameID:tournamentID} ,'127.0.0.1', TT.gameNameID);
		} 
		
		if (playerCount==maxPlayers-1) {
			StartTournament(tournamentID);
		} else {
			// if (playerCount>maxPlayers-1){
			// 	// stream tournaments addition
			// 	var newGoNext = TT.goNext;

			// 	// newGoNext[0]++;
			// 	// Log('goNext now ' + JSON.stringify(newGoNext), STREAM_TOURNAMENTS);

			// 	// Tournament.update({tournamentID:tournamentID}, {$set :{goNext: newGoNext} }, function (err, count){
			// 	// 	if (err) return 0;

			// 	// 	if (updated(count)) { 
			// 	// 		Log('goNext updated', STREAM_TOURNAMENTS);

			// 	// 	} else {
			// 	// 		Log('goNext update FAILED', STREAM_TOURNAMENTS);
			// 	// 	}
			// 	// });
			// }
		}
	})
	.catch(function (err){
		queue[tournamentID][login]=null;
		console.log('CATCHED error while player registering!', err);

		if (res) { 
			switch (err){
				case aux.c.TREG_FULL: Answer(res, { result: aux.c.TREG_FULL } ); break;
				case aux.c.TREG_ALREADY: Answer(res, { result: aux.c.TREG_ALREADY }); break;
				case aux.c.TREG_NO_MONEY: Answer(res, { result: buyIn }); break;
				default:
					Answer(res, { result: buyIn });
					// Answer(res, Fail);
				break;
			}
		}
		// Error(err);
		aux.fail(login, 'RegisterUserInTournament', { tournamentID:tournamentID, info:info, code:err })
	})
}



var aux;
// , realtime
module.exports = function(_aux, _realtime){
	aux = _aux;
	// realtime = _realtime;

	return {
		register: register
	}
}