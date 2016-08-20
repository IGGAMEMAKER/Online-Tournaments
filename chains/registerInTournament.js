var sender = require('../requestSender');
var API = require('../helpers/API');
var logger = require('../helpers/logger');

var c = require('../constants');
var getPortAndHostOfGame = require('../helpers/GameHostAndPort').getPortAndHostOfGame;


var fs = require('fs');

function getRegistrableTournament(tournamentID){
	var is_stream = { 'settings.regularity': c.REGULARITY_STREAM };
	var is_running = { status: c.TOURN_STATUS_RUNNING };
	var is_available_stream = { $and : [is_stream, is_running] };

	var is_registrable = { status: c.TOURN_STATUS_REGISTER };

	var is_available = { $or: [ is_registrable, is_available_stream ] };

	var query = { $and : [{ tournamentID }, is_available] };

	return API.tournaments.findByQuery(query)
}

var Fail = {
	result: 'fail'
};
var OK = {
	result: 'OK'
};

var tournaments;

var queue = {};

var Answer = sender.Answer;

function TournamentLog(tournamentID, message){
	var time = new Date();
	//logger.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) { logger.error(err); throw err; }
		//logger.log('The "data to append" was appended to file!');
	});
}

var str = JSON.stringify;

function StartTournament(tournamentID, force, res) {
	var gameNameID;
	logger.log("Tournament " + tournamentID + " starts", c.STREAM_TOURNAMENTS);

	API.tournaments.find(tournamentID)
		.then(function (tournament){
			gameNameID = tournament.gameNameID;
			return API.tregs.participants(tournamentID)
		})
		.then(function (regs){
			// var players = [];

			// for (var a in regs){
			// 	players.push(regs[a].userID);
			// }
			var players = regs.map(reg => reg.userID);

			var obj = getPortAndHostOfGame(gameNameID);
			obj.tournamentID = tournamentID;
			obj.logins = players;

			if (force) {
				obj.force = true;
			}

			TournamentLog(tournamentID, 'start Object:' + str(obj));

			sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer');
			if (res) Answer(res, OK);
		})
		.then(function (result){
			return API.tournaments.start(tournamentID); // setTournStatus(tournamentID, TOURN_STATUS_RUNNING);
		})
		.catch(logger.report('RegisterUserInTournament.StartTournament', { tournamentID }))
}

function add_participant(tournamentID, login) {
	var promoter = 'g.iosebashvili';
	return API.users.profile(login)
		.then(profile => {
			if (profile.inviter) {
				promoter = profile.inviter;
				logger.log('PROMOTER for ', login,' IS', promoter);
			}

			return API.tregs.registerUser(login, tournamentID, promoter)
		})
		.then(function (result) {
			return API.tregs.participants(tournamentID)
		})
		.then(function (participants){
			return API.tournaments.updateByID(tournamentID, { players: participants.length || 0 })
		})
}

function reg(tournamentID, login, force) {
	var buyIn;
	var playerCount;
	var maxPlayers;
	var TT;

	return new Promise(function (resolve, reject) {
		if (!queue[tournamentID]) {
			logger.log(tournamentID, 'is empty');
			queue[tournamentID] = { };
		} else {
			logger.log(tournamentID, login, queue[tournamentID])
		}

		if (queue[tournamentID][login]) return reject('many requests ' + login);

		// queue[tournamentID][login] = 1;
		setQueue(tournamentID, login);

		logger.log('register', login, 'to', tournamentID);

		return resolve(1)
	})
		.then(function (result) {
			return getRegistrableTournament(tournamentID)
		})
		.then(function (tournament) {
			var is_stream = false;

			TT = tournament;
			buyIn = tournament.buyIn;
			playerCount = tournament.players;
			maxPlayers = tournament.goNext[0];

			if (tournament.settings && tournament.settings.regularity == c.REGULARITY_STREAM) {
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
					if (force) {
						return 1;
					}

					return API.money.pay(login, buyIn, { type: c.SOURCE_TYPE_BUY_IN, tournamentID })
				}

				return 1;
			}

			throw c.TREG_FULL
		})
		.then(function (result) {
			return add_participant(tournamentID, login)
		})
		.then(function (saved) {
			// queue[tournamentID][login] = null;
			clearQueue(tournamentID, login);

			// aux.done(login, 'tournament.join', {tournamentID:tournamentID});
			API.actions.add(login, 'tournament.join', { tournamentID });
			return TT;
		})
}

function forceRegister(tournamentID, login) {
	return reg(tournamentID, login, true)
}

function register(tournamentID, login, res) {
	return reg(tournamentID, login, false)
		.then(function (tournament){
			// if (res) Answer(res, OK);
			if (res) res.json(OK);

			join_if_stream(tournament, login);

			needsStart(tournament);
		})
		.catch(function (err) {
			// queue[tournamentID][login]=null;
			clearQueue(tournamentID, login);
			logger.log('CATCHED error while player registering!', err);
			// if (res) Answer(res, OK);
			// res.json({ result: tournamentID });
			// Answer(res, OK);

			if (res) {
				switch (err) {
					case c.TREG_FULL: res.json({ result: c.TREG_FULL }); break;
					case c.TREG_ALREADY: res.json({ result: c.TREG_ALREADY }); break;
					case c.TREG_NO_MONEY: res.json({ result: c.TREG_NO_MONEY }); break;
					default:
						res.json({ result: c.TREG_NO_MONEY });
						// Answer(res, Fail);
						break;
				}
			}
			// Error(err);
			// aux.fail(login, 'RegisterUserInTournament', { tournamentID, code:err })
			API.errors.add(login, 'RegisterUserInTournament', { tournamentID, code:err })
		})
}

function join(tournament, login) {
	var tournamentID = tournament.tournamentID;
	sender.sendRequest("Join", { login:login, gameID:tournamentID } ,'127.0.0.1', tournament.gameNameID);
}

function join_if_stream(tournament, login) {
	var tournamentID = tournament.tournamentID;
	if (tournament.settings && tournament.settings.regularity == c.REGULARITY_STREAM){

		join(tournament, login)
	}
}

function needsStart(tournament) {
	var playerCount = tournament.players;
	var maxPlayers = tournament.goNext[0];
	var tournamentID = tournament.tournamentID;

	if (playerCount == maxPlayers - 1) {
		var start_imediately = !tournament.settings || !tournament.settings.hold;
		if (start_imediately) StartTournament(tournamentID);
	}
}

function clearQueue(tournamentID, login) {
	queue[tournamentID][login] = null;
}

function setQueue(tournamentID, login) {
	queue[tournamentID][login] = 1;
}

module.exports = {
	// register: register,
	// forceRegister,
	// reg: reg,
	// join: join,
	// StartTournament: StartTournament
	register,
	forceRegister,
	reg,
	join,
	StartTournament

	// setQueue: function(tournamentID, login){
	// 	setQueue(tournamentID, login);
	// },
	// clearQueue: function(tournamentID, login){
	// 	clearQueue(tournamentID, login);
	// }
};
