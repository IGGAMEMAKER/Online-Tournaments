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

function add(name, captain) {
	if (!name || !captain) throw 'invalidData';
	var team = {
		name: name,
    players: [{ name: captain }],
    captain: captain,
    money: 0,
    settings: {}
	}
	return Team.find({ name: name })
	.then(function (team){
		if (team) throw 'team_exists';

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
		};
		if (alreadyJoined) throw 'joined';

		players.push({ name: login });
		return Team.update({ name: name }, {$set: { players: players } })
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

function remove(name){
	var players;
	return Team.findOne({ name: name })
	.then(function (team){
		players = team.players || null;
		return returnTeam.remove({ name: name })
		.then(function (result){
			return {
				result: result,
				players: players
			};
		})
	})
}

this.get = get;
this.add = add;
this.join = join;
this.clearPlayers = clearPlayers;
this.removePlayer = removePlayer;
this.resetCaptain = resetCaptain;
this.remove = remove;