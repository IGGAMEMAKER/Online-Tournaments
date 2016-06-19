module.exports = function(app, AsyncRender, Answer, sender, Log, proxy, getLogin, aux){
	var Fail = { result:'fail' };
	var OK = { result:'OK' };
	var Promise = require('bluebird');
	// var Stats = sender.Stats;
	var Stats = require('../../models/statistics');
	var TournamentRegs = require('../../models/tregs')
	var Users = require('../../models/users')
	var Messages = require('../../models/message')
	var time = require('../../helpers/time');

	// var aux = require('../../models/auxillary')

	var strLog = Log;

	var middlewares = require('../../middlewares');

	app.post('/AttemptToStart', function (req, res){
		// console.log('AttemptToStart');
		sender.Answer(res, OK);

		var login = getLogin(req);
		var tournamentID = req.body.tournamentID;
		// Stats('AttemptToStart', {login:login, tournamentID: tournamentID});

		Stats.attempt('startGame')//, { tournamentID: tournamentID })
	})



	app.post('/UserGetsData', function (req, res){
		sender.Answer(res, OK);

		var login =  req.body.login ;//getLogin(req);
		var tournamentID = req.body.tournamentID;
		// Stats('UserGetsData', { login: login , tournamentID:tournamentID});
		Stats.attempt('getsData');
	})

	app.post('/GameLoaded', function (req, res){
		// console.log('GameLoaded');
		sender.Answer(res, OK);

		var login = req.body.login;// getLogin(req);
		var tournamentID = req.body.tournamentID;

		// console.log('GameLoaded : ' + login + ' ' + tournamentID);
		// Stats('GameLoaded', { login:login , tournamentID:tournamentID});

		console.log('Stats CATCHED HERE', 'GameLoaded : ' + login + ' ' + tournamentID);
		Stats.attempt('gameLoaded');

		
	})

	app.post('/NoMoney', function (req, res){
		var tournamentID = req.body.tournamentID;
		var money = req.body.money||0;

		res.end('');
		Stats.attempt('NO-MONEY')
		strLog('No money for ' + tournamentID + ' need: ' + money, 'Money')

		// console.log('No money for ' + tournamentID + ' need: ' + money, 'Money');
	})

	// Stats.attempt('game-drawPopup')
	app.all('/mark/payment/:login/:ammount', function (req, res){
		var login = req.params.login;
		var ammount = req.params.ammount;

		res.end('')

		Stats.attempt('PRESSED-PAYMENT')
		strLog('TRIED TO PAY! ' + login + ' ' + ammount, 'Money');
	})

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


	})

	app.post('/mark/game/:name', middlewares.authenticated, function (req, res){
		res.end('MARK GAME RECEIVED');

		var tournamentID = req.body.tournamentID;
		var name = req.params.name;
		var login = getLogin(req);
		// var login = req.body.login||null;

		// console.log('mark/game/', name)//, tournamentID, login);

		// Stats.attempt('game-'+ name)


		var obj	= { type: 'game-'+ name }
		if (name=='movement') aux.clientside(login, obj)


		// aux.done(login, 'game-'+ name)
		// .then(function (result){
		// 	console.log(result);
		// })
		// .catch(function (err){
		// 	console.log(err);
		// })

		// Stats('/mark/game/'+name, {login:login, tournamentID:tournamentID });
	})

	app.post('/message/shown', middlewares.authenticated, function (req, res){
		res.end('');
		console.log('message/shown');
		
		var login = getLogin(req);
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
	})

	app.post('/mark/clientError', middlewares.authenticated, function (req, res){
		res.end('');

		var login = getLogin(req);
		var err = req.body.err;
		var where = req.body.where;

		aux.clientsideError(login||null, { type: 'clientError', err: err, where:where })
	})
	
	app.get('/mark/clientError', middlewares.authenticated, function (req, res){
		res.end('');

		var login = getLogin(req);
		var err = req.body.err;
		var where = req.body.where;



		aux.clientsideError(login||null, { type: 'clientError', err: err, where:where })
	})
	//statistics Data
	
	app.get('/Stats', function (req, res){
		AsyncRender('Stats', 'GetTournaments', res, {renderPage:'Stats'}, null);
		//res.render('Stats');
	})

	// app.post('/mark/Here/:login', function (req, res){
	// 	var login = req.params.login;//getLogin(req);
	// 	console.log('mark/Here');
	// 	strLog('Online: ' + login, 'Users');
	// 	res.end('');
	// })

// middlewares and helpers

	function json(req, res, next){
		if (req.err) {
			res.json({ err: req.err })
		} else {
			res.json({ data: req.data || null })
		}
	}

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

	function printer(msg){
		console.log(msg);
		return msg;
	}

	var std = [json, send_error];

	var draw_list = [drawList, send_error];

	function drawList(req, res, next){
		var list = req.data || [];
		var txt='';
		console.log(list);
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

	}, render('playedTop'), send_error) //draw_list)


	app.get('/moneyTop', function (req, res, next){
		var moneyMoreThan = parseInt(req.query.money) || 1;
		Users.moneyTop(moneyMoreThan)
		.then(answer(req, next))
		.catch(next);
	}, render('Users'), send_error)

	app.get('/Stats2', function (req, res, next){
		var date = req.query.date || null;

		Stats.get(date)
		// .then(printer)
		.then(answer(req, next))
		.catch(next)

/*		
		.then(function (data){
			// throw new Error('my','bla bla');
			req.data = data;
			next();

			// res.json({ data:data })
		})
*/

	}, render('Statistics'), send_error) //draw_list
}