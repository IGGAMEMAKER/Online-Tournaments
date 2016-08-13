var express = require('express');
var app = express();

var API = require('../helpers/API');
var tournamentValidator = require('../helpers/tournament-validator');

var schedule = require('node-schedule');
var request = require('superagent');
var Promise = require('bluebird');

var tournaments = {};
var configs = require('./../configs');

var logger = console.log;
var debug = console.warn;

var domain = 'http://localhost';

var server = app.listen(8889, function () {
	var host = server.address().address;
	var port = server.address().port;

	logger('Example app listening at http://%s:%s', host, port);
});

var auth = (req, res, next) => {
	debug(req.url);
	next();
};
app.use(auth);

function isTournamentInfoValid(tournament) {
	return tournamentValidator(tournament);
}

app.post('/add-tournament/', (req, res) => {
	var data = req.body;

	debug(data);

	if (data && isTournamentInfoValid(data)) {
		API.tournaments.add(tournament)
			.then(msg => { res.json({ msg }) })
			.catch(err => { res.json({ err }) })
	} else {
		res.json({});
	}
});

var requireProp = (obj, property, name) => {
	// return obj ? (obj[property] || null) : null;
	// return obj ? (obj[property] || null) : null;
	if (!obj) throw 'empty obj...' + name;

	if (!obj.hasOwnProperty(property)) throw 'no property in ' + name + ':' + JSON.stringify(obj);
	return true;
};



var startedTournaments = {};

function setJob(id, date, fnc) {
	/*if (!startedTournaments[id]) {
		logger('set tournament', id, date);
	 startedTournaments[id] = 1;
		schedule.scheduleJob(date, fnc);
	}*/
}

function setDateTournaments(list) {
	try {
		requireProp(list, 'length', 'setDateTournaments');
		if (list.length) {
			tournaments = list;
			list.forEach(t => {
				var sd1 = t.startDate;
				if (sd1) {
					// logger('setting tournament', t.tournamentID, startDate);
					const ms = Date.parse(sd1);
					var sd = new Date(ms); //sd1

					var date = sd;
					// logger('date', sd1, date, date.toLocaleString());
					var id = t.tournamentID;
					setJob(id, date, function () {
						startedTournaments[id] = 2;
						logger('I will start now!', id);
						logger('I will start now!', id);
						logger('I will start now!', id);
						logger('I will start now!', id);
						logger('I will start now!', id);
					});
				}
			})
		}
	} catch (e) {
		logger(e);
	}
}
function getAvailableTournaments() {
	request
		.get(`${domain}:9000/tournaments/available`)
		.end((err, response) => {
			tournaments = response.body.msg;
			setDateTournaments(tournaments);
		})
}
function initialize() {
	logger('initialize');

}



function watchdog() {
	setInterval(() => {
		// logger('initialize');
		getAvailableTournaments();
	}, 4000);
}

// initialize();
watchdog();
var date = new Date(2016, 5, 11, 12, 13, 0);


//var j =
// setInterval(() => {
// 	schedule.scheduleJob(date, function() {
// 		if (!startedTournaments[0]) {
// 			console.log('The world is going to end today.');
// 			startedTournaments[0] = 1;
// 		}
// 	});
// }, 1000);

function startTournament() {
	// console.log('Site starts tournament');
	// var data = req.body;
  //
	// sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
  //
	// if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
	// res.end();
}
