module.exports = function(app, AsyncRender, Answer, sender, Log, proxy, getLogin){
	var Fail = { result:'fail' };
	var OK = { result:'OK' };
	var Promise = require('bluebird');
	// var Stats = sender.Stats;
	var Stats = require('../../models/statistics');
	//var strLog = Log;

	app.post('/AttemptToStart', function (req, res){
		console.log('AttemptToStart');
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

		Stats.attempt('gameLoaded')
	})

	app.post('/NoMoney', function (req, res){
		var tournamentID = req.body.tournamentID;
		var money = req.body.money||0;

		res.end('');
		// console.log('No money for '+tournamentID + ' need: ' + money, 'Money');
	})

	app.post('/mark/game/:name', function (req, res){
		res.end('');
		var tournamentID = req.body.tournamentID;
		var name = req.params.name;
		var login = req.body.login||null;

		console.log('mark/game/', name, tournamentID, login);

		// Stats('/mark/game/'+name, {login:login, tournamentID:tournamentID });
		// Stats.attempt('')
	})
	
	//statistics Data
	
	app.get('/Stats', function (req, res){
		
		AsyncRender('Stats', 'GetTournaments', res, {renderPage:'Stats'}, null);
		//res.render('Stats');
	})
	app.get('/Stat2', function (req, res){
		Stats.get()
		.then(function (data){
			res.json({data:data})
		})
		.catch(function (err){
			res.json({err:err})
		})
	})
}