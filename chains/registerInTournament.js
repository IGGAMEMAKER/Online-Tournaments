var Money = require('../models/money');
var TournamentReg = require('../models/tregs');
var Tournaments = require('../models/tournaments');
var Users = require('../models/users');

var c = require('../constants');
var getPortAndHostOfGame = require('../helpers/GameHostAndPort').getPortAndHostOfGame;

var sender = require('../requestSender');


var helper = require('../helpers/helper');
var sort = require('../helpers/sort');

var fs = require('fs');

function getRegistrableTournament(tournamentID){
	var is_stream = { 'settings.regularity': aux.c.REGULARITY_STREAM };
	var is_running = { status: aux.c.TOURN_STATUS_RUNNING };
	var is_available_stream = { $and : [is_stream, is_running] };

	var is_registrable = { status: aux.c.TOURN_STATUS_REGISTER };

	var is_available = { $or: [ is_registrable, is_available_stream ] };
	
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

var tournaments;

var queue = {};

var Log = function(){
	console.log(arguments);
};

var Answer = sender.Answer;

function TournamentLog(tournamentID, message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) { Log(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}

var str = JSON.stringify;

function StartTournament(tournamentID, force, res){
	var gameNameID;
	Log("Tournament " + tournamentID + " starts", aux.c.STREAM_TOURNAMENTS);

	Tournaments.find(tournamentID)
	.then(function (tournament){
		gameNameID = tournament.gameNameID;
		return TournamentReg.participants(tournamentID)
	})
	.then(function (regs){
		var players = [];
		for (var a in regs){ 
			players.push(regs[a].userID);
		}

		var obj = getPortAndHostOfGame(gameNameID);
		obj.tournamentID = tournamentID;
		obj.logins = players;
		if (force) obj.force = true;

		TournamentLog(tournamentID, 'start Object:' + str(obj));

		sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer');
		if (res) Answer(res, OK);
	})
	.then(function (result){
		return Tournaments.start(tournamentID) // setTournStatus(tournamentID, TOURN_STATUS_RUNNING);
	})
	.catch(aux.report('RegisterUserInTournament.StartTournament', {tournamentID:tournamentID}))
}

function add_participant(tournamentID, login) {
	var promoter = 'g.iosebashvili';
	return Users.profile(login)
		.then(profile => {
			if (profile.inviter) {
				promoter = profile.inviter;
				console.log('PROMOTER for ', login,' IS', promoter);
			}

			return TournamentReg.registerUser(login, tournamentID, promoter)
		})
		.then(function (result) {
			return TournamentReg.participants(tournamentID)
		})
		.then(function (participants){
			return Tournaments.updateByID(tournamentID, { players: participants.length || 0 })
		})
}

function reg(tournamentID, login){
	var buyIn;
	var playerCount;
	var maxPlayers;
	var TT;

	return new Promise(function (resolve, reject){

		if (!queue[tournamentID]) {
			console.log(tournamentID, 'is empty')
			queue[tournamentID] = { };
		} else {
			console.log(tournamentID, login, queue[tournamentID])
			
		}

		if (queue[tournamentID][login]) return reject('many requests ' + login);

		// queue[tournamentID][login] = 1;
		setQueue(tournamentID, login);

		console.log('register', login, 'to', tournamentID)

		return resolve(1)
	})
	.then(function (result){
		return getRegistrableTournament(tournamentID)
	})
	.then(function (tournament) {
		var is_stream = false;

		TT = tournament;
		buyIn = tournament.buyIn;
		playerCount = tournament.players;
		maxPlayers = tournament.goNext[0];

		if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM) {
			is_stream = true;
		}

		var has_player_count_limitation = is_stream;

		if (is_stream) {
			// no check, go to next step
			return 1;
		}

		// check max players count
		if (playerCount < maxPlayers) { // pay money
			if (buyIn > 0) {
				return Money.pay(login, buyIn, { type: aux.c.SOURCE_TYPE_BUY_IN, tournamentID })
			}

			return 1;
		}
		
		throw aux.c.TREG_FULL
	})
	.then(function (result){
		// return TournamentReg.registerUser(login, tournamentID, 'gaginho')
		return add_participant(tournamentID, login)
	})
	.then(function (saved){
		// queue[tournamentID][login] = null;
		clearQueue(tournamentID, login)

		aux.done(login, 'tournament.join', {tournamentID:tournamentID});
		return TT;
	})
}

function register(tournamentID, login, res){
	// // console.log('register', tournamentID, login, queue)

	// if (!queue[tournamentID]) queue[tournamentID] = { };
	// // console.log(queue)
	// if (queue[tournamentID][login]) return Answer(res, Fail);

	// queue[tournamentID][login] = 1;

	// console.log('register', login, 'to', tournamentID)

	// var buyIn;
	// var playerCount;
	// var maxPlayers;
	// var TT;

	// var info = {}


	// return getRegistrableTournament(tournamentID)
	// .then(function (tournament) {
	// 	// console.log('getRegistrableTournament')
	// 	// info.tournament = tournament;

	// 	// console.log(tournament);

	// 	var TOURNAMENT_TYPE_STREAM = 2;
	// 	var TOURNAMENT_TYPE_PAID = 3;


	// 	TT = tournament;
	// 	buyIn = tournament.buyIn;
	// 	playerCount = tournament.players;
	// 	maxPlayers = tournament.goNext[0];

	// 	// var typeOfTournament=TOURNAMENT_TYPE_PAID;

	// 	// if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM){
	// 	// 	typeOfTournament = TOURNAMENT_TYPE_STREAM;
	// 	// }

	// 	// queue[tournamentID].places = maxPlayers;
	// 	var is_stream = false;
	// 	if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM) is_stream = true;

	// 	var has_player_count_limitation = is_stream;

	// 	// console.log('has_player_count_limitation', has_player_count_limitation)
	// 	// console.log('playerCount', playerCount, 'maxPlayers', maxPlayers, buyIn)

	// 	if (is_stream) return 1; 		// no check, go to next step

	// 	// check max players count
	// 	if (playerCount < maxPlayers) { // pay money
	// 		if (buyIn>0) { 
	// 			return Money.pay(login, buyIn, { type:aux.c.SOURCE_TYPE_BUY_IN, tournamentID:tournamentID })
	// 		}
	// 		return 1;
	// 	}
		
	// 	throw aux.c.TREG_FULL

	// 	// if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM){
	// 	// 	sender.sendRequest("Join", {login:login, gameID:tournamentID} ,'127.0.0.1', tournament.gameNameID);
	// 	// } 
	// 	// return findTournamentReg(tournamentID, login);
	// })
	// .then(function (result){
	// 	// console.log('passed payment')
	// 	info['waitsForReg'] = result;
	// 	return TournamentReg.registerUser(login, tournamentID, 'gaginho')
	// })
	// .then(function (result){
	// 	info['TournamentReg.registerUser'] = result;

	// 	return TournamentReg.participants(tournamentID)
	// 	.then(function (participants){
	// 		return Tournaments.updateByID(tournamentID, { players:participants.length || 0 })
	// 	})
	// 	// return changePlayersCount(tournamentID); 
	// })

	return reg(tournamentID, login)
	.then(function (tournament){
		// if (res) Answer(res, OK);
		if (res) res.json(OK);

		join_if_stream(tournament, login);
		
		needsStart(tournament);
	})
	.catch(function (err) {
		// queue[tournamentID][login]=null;
		clearQueue(tournamentID, login);
		console.log('CATCHED error while player registering!', err);
		// if (res) Answer(res, OK);
		// res.json({ result: tournamentID });
		// Answer(res, OK);

		if (res) {
			switch (err){
				case aux.c.TREG_FULL: res.json({ result: aux.c.TREG_FULL }); break;
				case aux.c.TREG_ALREADY: res.json({ result: aux.c.TREG_ALREADY }); break;
				case aux.c.TREG_NO_MONEY: res.json({ result: aux.c.TREG_NO_MONEY }); break;
				default:
					res.json({ result: aux.c.TREG_NO_MONEY });
					// Answer(res, Fail);
					break;
			}
		}
		// Error(err);
		aux.fail(login, 'RegisterUserInTournament', { tournamentID:tournamentID, code:err })
	})
}

function join(tournament, login){
	var tournamentID = tournament.tournamentID;
	sender.sendRequest("Join", { login:login, gameID:tournamentID } ,'127.0.0.1', tournament.gameNameID);
}

function join_if_stream(tournament, login){
	var tournamentID = tournament.tournamentID;
	if (tournament.settings && tournament.settings.regularity==aux.c.REGULARITY_STREAM){

		join(tournament, login)
	}
}

function needsStart(tournament){
	var playerCount = tournament.players;
	var maxPlayers = tournament.goNext[0];
	var tournamentID = tournament.tournamentID;

	if (playerCount == maxPlayers - 1) {
		var start_imediately = !tournament.settings || !tournament.settings.hold;
		if (start_imediately) StartTournament(tournamentID);
	}
}

function clearQueue(tournamentID, login){ queue[tournamentID][login] = null; }
function setQueue(tournamentID, login){ queue[tournamentID][login] = 1; }

var aux;
// , realtime
module.exports = function(_aux, _realtime){
	aux = _aux;
	// realtime = _realtime;

	return {
		register: register,
		reg: reg,
		join: join,
		StartTournament: StartTournament,
		setQueue: function(tournamentID, login){
			setQueue(tournamentID, login);
		},
		clearQueue: function(tournamentID, login){
			clearQueue(tournamentID, login);
		}
	}
}