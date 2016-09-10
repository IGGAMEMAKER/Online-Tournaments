var OK = { result:'OK' };
// var Stats = sender.Stats;
var Users = require('../../models/users');

var Stats = require('../../models/statistics');
var TournamentRegs = require('../../models/tregs');
var Messages = require('../../models/message');
var Actions = require('../../models/actions');

var time = require('../../helpers/time');

var logger = require('../../helpers/logger');

var middlewares = require('../../middlewares');

var sender = require('../../requestSender');

var AsyncRender = require('../../helpers/AsyncRender');

var respond = require('../../middlewares/api-response');

var API = require('../../helpers/API');

var aggregateStats = require('../../helpers/stats-aggregator');

var DAY_MS = 3600 * 24 * 1000;

function yesterday() {
	var todayMilliseconds = new Date().getTime();
	// logger.debug('now:', new Date());
	// logger.debug('nowMillis', todayMilliseconds);
	return new Date(todayMilliseconds - DAY_MS);
}

function dayStartMS(date) {
	var total_milliseconds = date.getTime();
	var min_days = Math.floor(total_milliseconds / DAY_MS);

	return min_days * DAY_MS;
}

function nextDayStartMS(date) {
	// returns MS of NEXT DAY 00:00
	var total_milliseconds = date.getTime();
	var min_days = Math.ceil(total_milliseconds / DAY_MS);

	return min_days * DAY_MS;
	// return new Date(min_days * DAY_MS);
}

function dayStartDate(date) {
	return new Date(dayStartMS(date));
}

function nextDayStartDate() {
	return new Date(nextDayStartMS(date));
}

function compareDates(date1, date2) {
	return date1.getTime() > date2.getTime();
}

function dateLessThan(date1, date2) {
	return date1.getTime() <= date2.getTime();
}
// 21.08.16 03:00

// 28.08.16 17:00
function makePeriodArray(d1, d2) { // array of milliseconds
	var array = [];

	var startOfFirstDay = dayStartMS(d1);
	var endOfLastDay = nextDayStartMS(d2);

	logger.debug('period from: ', new Date(startOfFirstDay), ' to ', new Date(endOfLastDay));

	for (var time = startOfFirstDay; time < endOfLastDay; time += DAY_MS) {
		// console.log()
		array.push({ d1: time, d2: time + DAY_MS });
	}

	return array;
}

logger.debug('yesterday', yesterday());

function countStatsForPeriod(date1, date2) {
	logger.debug('countStatsForPeriod', date1, date2);

	var actions;

	var visits;

	var periods = makePeriodArray(date1, date2);

	return API.actions.getAllByPeriod(date1, date2)
		.then(list => {
			actions = list;
			return API.visits.getAllByPeriod(date1, date2);
		})
		.then(list => {
			visits = list;
			return API.errors.getAllByPeriod(date1, date2);
		})
		.then(errors => {
			return periods.map(obj => {
				var aggregated = aggregateStats(actions, errors, visits, obj.d1, obj.d2);

				return Object.assign(obj, aggregated);
			});
		})
}

// countStatsForPeriod(new Date('2016-08-31T21:00:00.000Z'), new Date('2016-09-02T20:59:59.999Z'))
// 	.then(r => {
// 		// logger.debug('aggregated: ', r.length);
// 	})
// 	.catch(logger.error);

module.exports = function(app, aux){
	app.post('/AttemptToStart', function (req, res){
		res.end();

		Stats.attempt('startGame'); //, { tournamentID: tournamentID })
	});

	app.post('/UserGetsData', function (req, res){
		res.end();

		Stats.attempt('getsData');
	});

	app.post('/GameLoaded', function (req, res){
		// console.log('GameLoaded');
		sender.Answer(res, OK);

		var login = req.body.login;// req.login;
		var tournamentID = req.body.tournamentID;

		// console.log('GameLoaded : ' + login + ' ' + tournamentID);
		// Stats('GameLoaded', { login:login , tournamentID:tournamentID});

		console.log('Stats CATCHED HERE', 'GameLoaded : ' + login + ' ' + tournamentID);
		Stats.attempt('gameLoaded');
	});

	app.post('/NoMoney', function (req, res){
		var tournamentID = req.body.tournamentID;
		var money = req.body.money || 0;

		res.end('');
		Stats.attempt('NO-MONEY');
		logger.log('No money for ' + tournamentID + ' need: ' + money, 'Money');

		// console.log('No money for ' + tournamentID + ' need: ' + money, 'Money');
	});

	// Stats.attempt('game-drawPopup')
	app.get('/metrics/:stat', middlewares.authenticated, (req, res) => {
		res.end();
		var method = req.params.stat;

		var obj = {};

		if (method == 'Cashout') {
			obj.amount = parseInt(req.query.amount);
		}

		Actions.add(req.login, req.params.stat, obj);
	});

	app.post('/metrics/:stat', middlewares.authenticated, (req, res) => {
		logger.debug('/metrics/stat/ post');

		res.end();
		var method = req.params.stat;

		var obj = {};

		if (method == 'Cashout') {
			obj.amount = parseInt(req.body.amount);
		}

		Actions.add(req.login, req.params.stat, obj);
	});

	app.all('/mark/payment/:login/:ammount', function (req, res){
		var login = req.params.login;
		var ammount = req.params.ammount;

		res.end('');

		Stats.attempt('PRESSED-PAYMENT');
		logger.log('TRIED TO PAY! ' + login + ' ' + ammount, 'Money');
	});

	app.post('/gamestats/:name', function (req, res){
		res.end('');

		var name = req.params.name;
		var data = req.body;
		var login = data.login;
		// var tournamentID = req.body.tournamentID;
		// var login = req.body.login;

		if (name && data && login){
			data.type = 'game-'+ name;
			// var obj	= { type: 'game-'+ name }
			aux.clientside(login, data)
		}

		// Stats.attempt('game-'+ name)
	});

	app.post('/mark/game/:name', middlewares.authenticated, function (req, res){
		res.end('MARK GAME RECEIVED');

		var tournamentID = req.body.tournamentID;
		var name = req.params.name;
		var login = req.login;
		// var login = req.body.login||null;

		// console.log('mark/game/', name)//, tournamentID, login);

		// Stats.attempt('game-'+ name)


		var obj	= { type: 'game-'+ name };
		if (name=='movement') aux.clientside(login, obj);

		// Stats('/mark/game/'+name, {login:login, tournamentID:tournamentID });
	});

	app.post('/message/shown', middlewares.authenticated, function (req, res){
		res.end('');
		// console.log('message/shown');

		var login = req.login;
		var id = req.body.id;
		var options = req.body.options;
		// console.log('show', login, id)
		var obj	= { type: 'message/shown', id:id };
		if (options){
			obj.options = options;
		}
		// aux.clientside(login, obj)
		// console.log(id, login,'read')
		Messages.notifications.read(id, login);
	});

	app.post('/mark/clientError', middlewares.authenticated, function (req, res){
		res.end('');

		var login = req.login;
		var err = req.body.err;
		var where = req.body.where;

		aux.clientsideError(login||null, { type: 'clientError', err: err, where:where })
	});

	app.get('/mark/clientError', middlewares.authenticated, function (req, res){
		res.end('');

		var login = req.login;
		var err = req.body.err;
		var where = req.body.where;



		aux.clientsideError(login||null, { type: 'clientError', err: err, where:where })
	});
	//statistics Data

	app.get('/Stats', function (req, res){
		AsyncRender('Stats', 'GetTournaments', res, {renderPage:'Stats'}, null);
	});

	// app.post('/mark/Here/:login', function (req, res){
	// 	var login = req.params.login;//req.login;
	// 	console.log('mark/Here');
	// 	logger.log('Online: ' + login, 'Users');
	// 	res.end('');
	// })

// middlewares and helpers

	function send_error(err, req, res, next){
		console.error(err);
		res.json({ err: err });
	}

	// function get_stats(req, res, next){
	// 	return
	// }

	function answer(req, next){
		return function (data){
			req.data = data;
			next();
		}
	}

	function drawList(req, res, next){
		var list = req.data || [];
		var txt='';

		for (var i=0; i<list.length; i++){
			txt += JSON.stringify(list[i]) + '\n';
		}
		res.end(txt);
	}

	function render(renderPage){
		return function(req,res, next){
			res.render(renderPage, { msg: req.data })
		}
	}

	app.get('/playedTop', function (req, res, next){
		// var num = parseInt(req.query.num||1);
		var playedMoreThan = parseInt(req.query.num) || 1; //req.query.num || 1;
		TournamentRegs.playedTop(playedMoreThan)
		.then(answer(req, next))
		.catch(next);

	}, render('playedTop'), send_error); //draw_list)


	app.get('/moneyTop', function (req, res, next){
		var moneyMoreThan = parseInt(req.query.money) || 1;
		Users.moneyTop(moneyMoreThan)
		.then(answer(req, next))
		.catch(next);
	}, render('Users'), send_error);

	app.get('/Stats2', function (req, res, next){
		var date = req.query.date || null;

		Stats.get(date)
		// .then(printer)
		.then(answer(req, next))
		.catch(next);
	}, render('Statistics'), send_error); //draw_list


	app.post('/full-stats', respond(req => {
		var date1 = new Date(req.body.date1) || yesterday();
		var date2 = new Date(req.body.date2) || new Date();

		// logger.debug('request /full-stats', req.body);

		return countStatsForPeriod(date1, date2);
	}));
};
