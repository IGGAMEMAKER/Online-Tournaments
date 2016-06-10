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

function initialize() {
	logger('initialize');
	request
		.get(`${domain}:9000/tournaments/available`)
		.end((err, response) => {
			logger(err, response.body);
		})
}

initialize();
app.get('/LeagueTournaments', function (req, res) {
	logger('LeagueTournament');
	res.end();
});

app.get('/registerUser', function (req, res) {
	
});

var date = new Date(2016, 5, 10, 21, 21, 0);

var j = schedule.scheduleJob(date, function(){
	console.log('The world is going to end today.');
});

function startTournament() {
	// console.log('Site starts tournament');
	// var data = req.body;
  //
	// sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
  //
	// if (socket_enabled) io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
	// res.end();
}