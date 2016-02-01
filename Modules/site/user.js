module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, Fail){
	var validator = require('validator');
	var security = require('../DB/security');

	var Users = require('../../models/users');
	var TournamentReg = require('../../models/tregs');
	var mail = require('../../helpers/mail');

	var authenticated = require('../../middlewares').authenticated;


	var Fail = {
		result: 'fail'
	};
	var OK = {
		result: 'OK'
	}

	app.get('/Logout', function (req, res){
		req.session.destroy(function (err){
			if (err){ console.error('Session destroying error:' + err);}
		});
		res.render('Login',{});
	});

	app.get('/Login', function (req, res){ res.render('Login',{}); })
	app.get('/Register', function (req, res){ res.render(REG_TEMPLATE); })

	
	app.get('/ResetPassword', function (req, res){ res.render('ResetPassword'); })
	app.get('/Changepassword', function (req, res){ res.render('Changepassword'); })

	app.post('/Login', checkLoginData, std_auth('Login') );
	app.post('/Register', checkRegisterData, std_auth('Register') );

	var REG_TEMPLATE="Register";

	function checkRegisterData(req, res, next){
		var data = req.body;
		var user = {
			email : data.email
			, inviter : data.inviter
			, login : data.email.split("@")[0]
			, password : security.create_random_password()
		};
		Log('Try to register : ' + JSON.stringify(user), 'Users');
		
		if (!ValidEmail(data)) return res.render('Register', Fail);
		req.user = user;

		/*req.email = data.email;
		req.inviter = data.inviter;
		req.login = data.email.split("@")[0];
		req.password = security.create_random_password();*/
		
		next();
	}

	function checkLoginData(req, res, next){
		if (!ValidLoginData(req.body)){
			Log('Invalid login data')
			res.render('Login', Fail); 
			return;
		}
		req.user = {
			login:req.body.login
			, password: req.body.password
		};
		next();
	}

	

	function std_auth(command){
		return function (req, res, next){
			var data = req.user;
			var page = command; //command REG_TEMPLATE;
		
			var callback = function(res, body, options, parameters){
				Log(command + ' user ' + data.login, 'Users');
				req.session.save(function (err) {
					// session saved
					if (err) {
						//console.error('SESSION SAVING ERROR', 'Err'); 
						res.render(page,{msg:body.result});
					} else {
						req.session.login = data.login;
						res.redirect('Tournaments');
					}
				})
			}

			var failCallback = function(res, body, options, parameters){
				Log('Reject user ' + data.login,'Users');
				res.render(page,{msg:body.result});
			}

			AsyncRender('DBServer', command, res, { callback:callback, failCallback:failCallback }, data );
		}
	}

	app.post('/CancelRegister', function (req, res){
	  regManager('CancelRegister',req, res);
	})
	app.post('/RegisterInTournament', function (req, res){
	  regManager('RegisterUserInTournament',req, res);
	  //console.log('WRITE Socket emitter!!!')
	})

	app.post('/ResetPassword', function (req, res){
		var email = req.body.email;
		var login = req.body.login || email.split("@")[0];

		AsyncRender("DBServer", 'ResetPassword', res, {renderPage:'ResetPassword'}, {login:login, email:email})

		/*Users.resetPassword({login:login, email:email})
		.then(mail.sendResetPasswordEmail)
		.then(function (result){
			res.render('ResetPassword', {msg:OK});
			//Answer(res, OK);
			////Stats('ResetPasswordOK', {login:login});
			//Log("Sended mail and reset pass. Remember pass of User " + JSON.stringify(result), STREAM_USERS);
			//Log('still in then function');
		})
		.catch(function (err){
			res.render('ResetPassword', {msg:err})
			//Log(err, STREAM_ERROR);
			//Answer(res, err);
			//Stats('ResetPasswordFail', {login:login});
		})*/
	})


	app.post('/Changepassword' , function (req, res){
		if (isAuthenticated(req) && req.body.password && req.body.password == req.body.passwordRepeat && ValidPass(req.body.newpassword)) {
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

	function get_profile(req, res, next){
		var login = getLogin(req);
		var profile={
			login:login,
			tournaments:{}
		}
		Users.profile(login)
		.then(function (user){
			profile.money = user.money;
			profile.email = user.email;
			return TournamentReg.get(login)
		})
		.then(function (tournaments){
			profile.tournaments = tournaments;
			req.profile = profile;
			next()
		})
		.catch(function (err){
			console.error('get_profile error', err);
			req.profile = null;
			next();
			//next(err);
		})
	}

	app.post('/Profile', authenticated, get_profile, function (req, res){
		/*if (isAuthenticated(req)){
			var login = getLogin(req);
			AsyncRender("DBServer", "GetUserProfileInfo", res, {}, {login:login});
			return;
		}
		sender.Answer(res, Fail);*/

		/*.then(function (sss){
			sender.Answer(res, profile);
		})
		.catch(function (err){
			sender.Answer(res, Fail);
		})*/
		if (req.profile){
			sender.Answer(res, req.profile);
		} else {
			sender.Answer(res, Fail);
		}
	})

	app.get('/Profile', authenticated, get_profile, function (req, res){
	  //var login = 'Alvaro_Fernandez';
	  /*if (isAuthenticated(req) ){//req.session && req.session.login
	    var login = getLogin(req);
	    AsyncRender("DBServer", 'GetUserProfileInfo', res, {renderPage:'Profile'}, {login:login} );
	    return;
	  }
	  res.redirect('Login');*/
	  if (req.profile){
	  	res.render('Profile', {msg:req.profile});
	  } else {
	  	res.redirect('Login');
	  }
	})

	var INVALID_LOGIN_OR_PASS = '';
	var FIELD_MAX_LENGTH = 40;
	var MIN_PASS_LENGTH = 6;

	function ValidRegData(data)  { return ValidLogin(data||null) && ValidPass(data.password||null) && ValidEmail(data); }
	function ValidLoginData(data){ return ValidLogin(data||null) && ValidPass(data.password||null);	}
	function ValidEmail(data){ return (data.email && data.email.length<FIELD_MAX_LENGTH && validator.isEmail(data.email) ) }
	function ValidPass(password){ return (password && password.length<FIELD_MAX_LENGTH && password.length>=MIN_PASS_LENGTH && validator.isAlphanumeric(password) ) }
	function ValidLogin(data){ return (data.login && data.login.length<FIELD_MAX_LENGTH && validator.isAlphanumeric(data.login) ) }

	function regManager(command, req, res){
		var data = req.body;
		console.log(data.login, data.tournamentID);

		if (isAuthenticated(req)){
			AsyncRender('DBServer', command, res, null,  data);
		}
		else{
			sender.Answer(res, {result:'auth'});
		}
	}

}