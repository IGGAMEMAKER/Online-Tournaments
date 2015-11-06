module.exports = function(app, AsyncRender, Answer, sender, Log, proxy, getLogin){
	var Fail = { result:'fail' };
	var OK = { result:'OK' };

	var Stats = sender.Stats;
	//var strLog = Log;

	app.post('/AttemptToStart', function (req, res){
		sender.Answer(res, OK);

		var login = getLogin(req);
		var tournamentID = req.body.tournamentID;
		Stats('AttemptToStart', {login:login, tournamentID: tournamentID});
	})



	app.post('/UserGetsData', function (req, res){
		sender.Answer(res, OK);

		var login =  req.body.login ;//getLogin(req);
		var tournamentID = req.body.tournamentID;
		Stats('UserGetsData', { login: login , tournamentID:tournamentID});
	})

	app.post('/GameLoaded', function (req, res){
		//console.error('GameLoaded');
		sender.Answer(res, OK);

		var login = req.body.login;// getLogin(req);
		var tournamentID = req.body.tournamentID;
		console.error('GameLoaded : ' + login + ' ' + tournamentID);
		Stats('GameLoaded', { login:login , tournamentID:tournamentID});
	})

	
	//statistics Data
	app.get('/Stats', function (req, res){
		AsyncRender('Stats', 'GetTournaments', res, {renderPage:'Stats'}, null);
		//res.render('Stats');
	})

}