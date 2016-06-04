var express = require('express');
var app = express();

// var cron = require('cron');

var tournaments = {};
var configs = require('./../configs');

var logger = console.log;

// var Tournaments = require('./models/tournament')

var server = app.listen(8889, function () {
	var host = server.address().address;
	var port = server.address().port;

	logger('Example app listening at http://%s:%s', host, port);
});

app.get('/LeagueTournaments', function (req, res) {
	logger('LeagueTournament');
	res.end();
});

app.get('/registerUser', function (req, res) {
	
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