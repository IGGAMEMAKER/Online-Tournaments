module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, Fail){
	var validator = require('validator');

	app.get('/Logout', function (req, res){
		req.session.destroy(function (err){
			if (err){ console.error('Session destroying error:' + err);}
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

	app.get('/ResetPassword', function (req, res){
		res.render('ResetPassword');
	})

	app.post('/ResetPassword', function (req, res){
		//var login = req.body.login;
		AsyncRender("DBServer", 'ResetPassword', res, {renderPage:'ResetPassword'}, 
			{login:req.body.login, email:req.body.email})
	})

	app.get('/Changepassword', function (req, res){
		res.render('Changepassword');
	})

	app.post('/Changepassword' , function (req, res){
		if (isAuthenticated(req) && req.body.password && req.body.password == req.body.password1 && req.body.newpassword){
			AsyncRender("DBServer", 'Changepassword', res, {renderPage:'Changepassword'} , 
				{oldPass:req.body.password, newPass: req.body.newpassword, login:getLogin(req) });
		}
		else{
			res.render('Changepassword', {msg:{result:'Invalid data'}} );
		}
	})

	app.get('/MoneyTransfers', function (req, res){
		if (isAuthenticated(req)){

			AsyncRender("DBServer", 'MoneyTransfers', res, {renderPage:'MoneyTransfers'}, {login:getLogin(req)})
			return;
		}

		sender.Answer(res, Fail);
	})

	/*app.post('/Get')
	app.post('/GetMoney', function (req, res){
		var callback = function()
	})*/
	app.post('/Profile', function (req, res){
		if (isAuthenticated(req)){
			var login = getLogin(req);
			AsyncRender("DBServer", "GetUserProfileInfo", res, {}, {login:login});
			return;
		}
		
		sender.Answer(res, Fail);
	})
	
	app.get('/Activate/:link', function (req, res){
		var activationSuccessCallback = function(res, body, options, parameters){
			res.redirect('Profile');
		}

		var activationFailCallback = function(res, body, options, parameters){
			res.render('Activate', {msg:body} );
		}
		AsyncRender("DBServer", "Activate", res, 
			{callback:activationSuccessCallback, failCallback:activationFailCallback}, 
			{link:req.params.link});
	})

	app.get('/Profile', function (req, res){
	  //var login = 'Alvaro_Fernandez';
	  if (isAuthenticated(req) ){//req.session && req.session.login
	    var login = getLogin(req);
	    AsyncRender("DBServer", 'GetUserProfileInfo', res, {renderPage:'Profile'}, {login:login} );
	    return;
	  }
	  res.json({msg:'Log in first'});
	})

	function LoginOrRegister(req, res, command){
		var data = req.body;

		if (!(data && data.login && data.password)) { res.render(command, Fail); return; }

		if (command=='Register' && !ValidEmail(data)){
			res.render(command, Fail); return;
		}

		var callback = function(res, body, options, parameters){
			Log(command + ' user ' + data.login, 'Users');
			req.session.save(function (err) {
				// session saved
				if (err) {
					console.error('SESSION SAVING ERROR', 'Err'); 
					res.render(command,{err:body.result});
				}else{
					req.session.login = data.login;
					res.redirect('Tournaments');
				}
			})
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

	function ValidEmail(data){
		return (data.email && data.email.length<20 && validator.isEmail(data.email) )
	}

}