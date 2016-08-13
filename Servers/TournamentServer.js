var express = require('express');
var app = express();

var API = require('../helpers/API');
var isTournamentValid = require('../helpers/tournament-validator');

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

function isTournamentInfoValid(tournament) {

}

app.post('/add-tournament/', (req, res) => {
	var data = req.body;

	if (!data) {
		res.json({});
		return;
	}

	// strLog('Incoming tournament : ' +JSON.stringify(data));
	var buyIn = parseInt(data.buyIn);
	var rounds = parseInt(data.rounds);
	var gameNameID = parseInt(data.gameNameID);
	var GoNext = data.goNext?data.goNext.split(" ") : [];
	var Prizes = data.Prizes.split(" ");
	var prizes = [];
	var goNext = [];
	strLog(JSON.stringify(Prizes));
	//convert array of strings to array of objects
	for (var i = 0; i < Prizes.length - 1; i++) {
		if (isNaN(Prizes[i]) ){
			if (Prizes[i].length>0){
				prizes.push({giftID:Prizes[i]})
			} else {
				strLog('Prize[i] is null. Current prize is: ' + Prizes[i]);
				Answer(res, Fail);
				return;
			}
		} else {
			prizes.push( parseInt(Prizes[i]) );
		}
	}

	for (var i = 0; i< GoNext.length - 1; ++i){
		var num = parseInt(GoNext[i]);
		if (isNaN(num)){
			strLog('goNext num parseInt error! ');
			strLog(GoNext);
			Answer(res, Fail);
			return;
		}
		else{
			goNext.push(num);
		}
	}

	strLog('splitted prizes: ' + JSON.stringify(prizes) );
	strLog('goNext.length:' + goNext.length);
	strLog(JSON.stringify(goNext));
	if (buyIn>=0 && rounds && gameNameID){
		var obj = {
			buyIn:      buyIn,
			initFund:     0,
			gameNameID:   gameNameID,

			pricingType:  PRICE_NO_EXTRA_FUND,

			rounds:     rounds,
			goNext:     goNext.length>0 ? goNext : [2,1],//
			places:     [1],
			Prizes:     prizes.length>0 ? prizes: [{giftID:'5609b7988b659cb7194c78c6'}],
			prizePools:   [1],

			comment:    'Yo',

			playersCountStatus: COUNT_FIXED,///Fixed or float
			startDate:    null,
			status:       null,
			players:      0
		};

		if (data.special || data.regularity || data.specName){
			obj.settings={};
		}
		// regular tournaments settings  // // && data.regularity!="0"
		if (data.regularity) { obj.settings.regularity = parseInt(data.regularity); }
		if (data.special) { obj.settings.special = parseInt(data.special); }
		if (data.specName) { obj.settings.specName = data.specName; }
		if (data.specPrizeName) { obj.settings.specPrizeName = data.specPrizeName; }

		if (data.hidden!=0) {obj.settings.hidden = true; obj.settings.topic = getTopic(data.hidden); }

		AsyncRender('DBServer', 'AddTournament', res, {renderPage:'AddTournament'}, obj);
	} else {
		strLog('Invalid data comming while adding tournament: buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID, 'WARN');
		sender.Answer(res, Fail);
	}

	API.tournaments.add(tournament);
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
