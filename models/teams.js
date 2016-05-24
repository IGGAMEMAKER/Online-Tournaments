var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);

var time = require('../helpers/time');

var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var db = require('../db')
var Team = db.wrap('Team')

var c = require('../constants');

function get(name) {
	return Team.findOne({ name: name });
}

function all() {
	return Team.list({});
}

function removeById(id){
	return remove({ _id: id })
}

function removeByName(name){
	return remove({ name: name });
}

function add(name, captain) {
	if (!name || !captain) throw 'invalidData';

	var team = {
		name: name,
    players: [{ name: captain }],
    captain: captain,
    money: 0,
    settings: {}
	};

	return Team.find({ name: name })
	.then(function (t){
		if (t) throw 'team_exists';

		return Team.save(team);
	})
}

function join(name, login){
	return Team.findOne({ name: name })
	.then(function (team){
		var players = team.players;
		var alreadyJoined = false;

		for (var i = players.length - 1; i >= 0; i--) {
			if (players[i].name == login) alreadyJoined = true;
		}
		if (alreadyJoined) throw 'joined';

		players.push({ name: login });

		var requests = [];
		team.requests.forEach(function (player) {
			if (player !== login) {
				requests.push(player);
			}
		});

		return Team.update({ name: name }, {$set: { players: players, requests: requests } })
	})
}

function removePlayer(name, login){
	return Team.findOne({ name: name })
	.then(function (team){
		var players = team.players;
		var index = -1;

		for (var i = players.length - 1; i >= 0; i--) {
			if (players[i].name == login) { index = i; }
		};
		if (index < 0) throw 'no_such_player';

		players.splice(index, 1);
		return Team.update({ name: name }, {$set: { players: players } });
	})
}

function clearPlayers(name){
	return Team.update({ name:name }, {$set: { players: [] } });
}

function resetCaptain(name, login){
	return Team.update({ name:name }, {$set: {captain: login} });
}

function setMoney(name, money) {
	return Team.update({ name: name }, {$set: {money: money} });
}

function changeMoney(name, ammount) {
	return Team.update({ name: name }, {$inc: {money: ammount} });
}

function sendRequest(name, player) {
	return Team.findOne({ name: name })
		.then(function (team) {
			console.log('sendRequest Team was found', team, name, player);
			var createRequest;
			var alreadyRequested = false;
			team.requests.forEach(function (r) {
				if (r === player) alreadyRequested = true;
			});

			if (alreadyRequested) {
				return null;
			}
			team.requests.push(player);
			createRequest = team.requests;

			return Team.update({ name: name }, {$set: { requests: createRequest } })
		})
}

function remove(query){
	var players;
	return Team.findOne(query)
	.then(function (team){
		players = team.players || null;
		return Team.remove(query)
		.then(function (result){
			return {
				result: result,
				players: players
			};
		})
	})
}

module.exports = {
	get : get,
	add : add,
	all : all,
	join : join,
	clearPlayers : clearPlayers,
	removePlayer : removePlayer,
	resetCaptain : resetCaptain,
	removeByName : removeByName,
	removeById: removeById,
	setMoney: setMoney,
	changeMoney: changeMoney,

	sendRequest: sendRequest
};
