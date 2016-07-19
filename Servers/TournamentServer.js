var express = require('express');
var app = express();

var schedule = require('node-schedule');
var request = require('superagent');
var Promise = require('bluebird');

var tournaments = {};
var configs = require('./../configs');

var logger = console.log;

var domain = 'http://localhost';

var server = app.listen(8889, function () {
	var host = server.address().address;
	var port = server.address().port;

	logger('Example app listening at http://%s:%s', host, port);
});

var auth = (req, res, next) => { next(); };
app.use(auth);

var requireProp = (obj, property, name) => {
	// return obj ? (obj[property] || null) : null;
	// return obj ? (obj[property] || null) : null;
	if (!obj) throw 'empty obj...' + name;

	if (!obj.hasOwnProperty(property)) throw 'no property in ' + name + ':' + JSON.stringify(obj);
	return true;
};

var starteds = {};

function setJob(id, date, fnc) {
	/*if (!starteds[id]) {
		logger('set tournament', id, date);
		starteds[id] = 1;
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
						starteds[id] = 2;
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
	}, 1000);
}

// initialize();
watchdog();
var date = new Date(2016, 5, 11, 12, 13, 0);


//var j =
// setInterval(() => {
// 	schedule.scheduleJob(date, function() {
// 		if (!starteds[0]) {
// 			console.log('The world is going to end today.');
// 			starteds[0] = 1;
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
