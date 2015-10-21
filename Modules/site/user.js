module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, Fail){
	
	app.get('/Logout', function (req, res){
		req.session.destroy(function (err){
			if (err){ console.log('Session destroying error:' + err);}
		});
		res.render('Login',{});
	});

	app.get('/Login', function (req, res){
		res.render('Login',{});
	})

	app.post('/Login', function (req, res){
		LoginOrRegister(req, res, 'Login');
	});

	app.post('/Register', function (req, res){
		LoginOrRegister(req, res, 'Register');
	});

	app.get('/Register', function (req, res){
		res.render('Register');
	})

	app.post('/CancelRegister', function (req, res){
	  regManager('CancelRegister',req, res);
	})
	app.post('/RegisterInTournament', function (req, res){
	  regManager('RegisterUserInTournament',req, res);
	  //console.log('WRITE Socket emitter!!!')
	})

	app.get('/Profile', function (req, res){
	  var login = 'Alvaro_Fernandez';
	  if (isAuthenticated(req) ){//req.session && req.session.login
	    login = getLogin(req);
	    AsyncRender("DBServer", 'GetUserProfileInfo', res, {renderPage:'Profile'}, {login:login} );
	    return;
	  }
	  res.json({msg:'Log in first'});
	})

	function LoginOrRegister(req, res, command){
		var data = req.body;
		if (!(data && data.login && data.password)) res.render(command, Fail); return;

		var callback = function(res, body, options, parameters){
			Log(command + ' user ' + data.login, 'Users');
			req.session.login = data.login;
			res.redirect('Tournaments');
		}
		var failCallback = function(res, body, options, parameters){
			Log('Reject user ' + data.login,'Users');
			res.render(command,{err:body.result});
		}

		AsyncRender('DBServer', command, res, { callback:callback, failCallback:failCallback }, data );
	}

	function regManager(command, req, res){
		var data = req.body;
		console.log(data.login);
		console.log(data.tournamentID);

		if (isAuthenticated(req)){
			AsyncRender('TournamentServer', command, res, null,  data);
		}
		else{
			sender.Answer(res, {result:'auth'});
		}
	}
}