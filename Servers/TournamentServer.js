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



function setDateTournaments(list) {
	try {
		requireProp(list, 'length', 'setDateTournaments');
		if (list.length) {
			tournaments = list;
			list.forEach(t => {
				var sd1 = t.startDate;
				if (sd1) {
					// logger('setting tournament', t.tournamentID, startDate);
					var sd = new Date(sd1);
					var year = sd.getFullYear();
					var month = sd.getMonth();
					var day = sd.getDate();
					var hours = sd.getHours();
					var min = sd.getMinutes();
					var sec = sd.getSeconds();
					var date = new Date(year, month, day, hours, min, sec);
					schedule.scheduleJob(date, function () {
						logger('I will start now!', t.tournamentID);
					});
					// schedule.scheduledJobs
				}
			})
		}
	} catch (e) {
		logger(e);
	}
}

function initialize() {
	logger('initialize');
	request
		.get(`${domain}:9000/tournaments/available`)
		.end((err, response) => {
			tournaments = response.body.msg;
			setDateTournaments(tournaments);
		})
}

function watchdog() {
	setInterval(() => {
		// logger('initialize');
		request
			.get(`${domain}:9000/tournaments/available`)
			.end((err, response) => {
				tournaments = response.body.msg;
				setDateTournaments(tournaments);
			})
	}, 1000);
}

initialize();
// watchdog();
// var date = new Date(2016, 5, 10, 21, 21, 0);
//
// schedule.scheduleJob(date, function(){
// 	console.log('The world is going to end today.');
// });

function startTournament() {
	// console.log('Site starts tournament');
	// var data = req.body;
  //
	// sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
  //
	// if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
	// res.end();
}