module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, Fail){
	var validator = require('validator');
	var security = require('../DB/security');

	var mail = require('../../helpers/mail');
	
	var Users = require('../../models/users');
	var TournamentReg = require('../../models/tregs');
	var Tournaments = require('../../models/tournaments');
	var Actions = require('../../models/actions');
	var Errors = require('../../models/errors');

	var Marathon = require('../../models/marathon');

	var authenticated = require('../../middlewares').authenticated;

	var Stats = sender.Stats;

	var Fail = {
		result: 'fail'
	};
	var OK = {
		result: 'OK'
	}

	function destroy_session(req, res, next){
		var login = getLogin(req);
		req.session.destroy(function (err){
			if (err) { 
				Errors.add(login, 'destroy_session', { err:err })
				// console.error('Session destroying error:' + err); 
			}
		});
		next();
	}

	app.get('/Logout', destroy_session, render('Login',{}) )

	// app.get('/Login', function (req, res){ res.render('Login',{}); })
	// app.get('/Register', function (req, res){ res.render(REG_TEMPLATE); })

	app.get('/Login', render('Login',{}) )
	app.get('/Register', render('Register'))

	
	app.get('/ResetPassword', render('ResetPassword') )
	app.get('/Changepassword', authenticated, render('Changepassword') )
	app.post('/ChangePassword', authenticated, change_password, change_password_fail)

	app.post('/Login', Login);//std_auth('Login')
	app.post('/Register', register);//std_auth('Register') 

	var REG_TEMPLATE="Register";

	function register(req, res){
		var user = {
			email: req.body.email
			, login: get_login_from_email(req.body.email)
			, password: req.body.password
		}
		if (isValid(user)){
			req.user= user;
		} else {
			return res.redirect('/');
		}


		var login = req.user.login;
		var password = req.user.password;
		var email = req.user.email;
		var inviter = req.user.inviter;
		
		// console.log('trying to register', login, email, password, inviter);

		Users.create(login, password, email, inviter)
		.then(function(user){
			//console.log('registered', user);
			saveSession(req, res, 'register');
			mail.sendActivationEmail(user);

			Actions.add(login, 'register');

		})
		.catch(answer_and_save_error(res, 'Register', 'register', login))
/*		.catch(function (err){
			res.render('Register', { msg:err });
			Errors.add(login, 'register', { code:err })
		})*/
	}

	function Login(req, res){
		var login = get_login_from_email(req.body.email);
		var password = req.body.password;
		//console.log('Login', login, password);
		req.user = {
			login : login
		}

		Actions.add(login, 'login');

		Users.auth(login, password)//, req.user.email, req.user.inviter
		.then(function (user){
			// console.log('logged In', user);
			req.user= user;
			saveSession(req, res, 'Login');

			// Actions.add(login, 'login');
		})
		.catch(function (err){
			res.render('Login', {msg : err});
			Errors.add(login, 'Login', { code:err })
		})
	}

	function saveSession(req, res, page){
		var login = req.user.login;

		req.session.save(function (err) {
			// session saved
			if (err) {
				//console.error('SESSION SAVING ERROR', 'Err');
				res.render(page, { msg : err });
				Errors.add(login, 'saveSession', { page:page, code:err })
			} else {
				req.session.login = req.user.login;
				res.redirect('Tournaments');
			}
		})
	}

	app.post('/CancelRegister', function (req, res){
	  regManager('CancelRegister',req, res);
	})
	app.post('/RegisterInTournament', function (req, res){
	  regManager('RegisterUserInTournament',req, res);
	  //console.log('WRITE Socket emitter!!!')
	})

	app.post('/autoreg', function (req, res){
		Tournaments.getStreamID()
		.then(function (streamID){
			if (isAuthenticated(req) && streamID){
				var data = {
					login: getLogin(req),
					tournamentID:streamID
				}
				// console.log('autoreg', data);
				AsyncRender('DBServer', 'autoreg', res, null,  data);
			}
			else{
				sender.Answer(res, Fail);
				//res.redirect('Login');
			}
		})
	})

	app.post('/ResetPassword', function (req, res){
		var email = req.body.email;
		var login = req.body.login || get_login_from_email(email);

		Actions.add(login, 'resetPassword');
		// AsyncRender("DBServer", 'ResetPassword', res, {renderPage:'ResetPassword'}, {login:login, email:email})

		Users.resetPassword({login:login, email:email})
		.then(mail.sendResetPasswordEmail)
		.then(function (result){
			res.render('ResetPassword', {msg:OK});
		})
		.catch(function (err){
			res.render('ResetPassword', {msg:err})
			Errors.add(login||null, 'resetPassword', { email:email, login:login, err:err });
		})
	})

	function change_password(req, res, next){
		var password = req.body.password;
		var passwordRepeat = req.body.passwordRepeat;
		var newpassword = req.body.newpassword;
		var login = getLogin(req);

		var isInputValid = password && passwordRepeat && newpassword && password == passwordRepeat && ValidPass(newpassword);
		if (!isInputValid) {
			/*res.render('Changepassword', {msg:{result:'Некорректные данные'}} );
			Errors.add(login||null, 'Changepassword', { email:email, login:login, err:err });
			return;*/
			return next('invalid input');
		}

		Users.changePassword(login, password, newpassword)
		.then(function (result){
			// res.render('Changepassword', { msg:result })
			res.redirect('Profile');
		})
		.catch(function (err){
			return next(err);
		})
	}

	function change_password_fail(err, req, res, next){
		var login = getLogin(req);
		res.render('Changepassword', { msg: { result:'Ошибка' } } );
		Errors.add(login||null, 'Changepassword', { login:login, err:err });
	}

	

/*
function (req, res){
		var password = req.body.password;
		var passwordRepeat = req.body.passwordRepeat;
		var newpassword = req.body.newpassword;
		var login = getLogin(req);

		var isInputValid = password && passwordRepeat && newpassword && password == passwordRepeat && ValidPass(newpassword);
		if (!isInputValid) {
			res.render('Changepassword', {msg:{result:'Некорректные данные'}} );
			Errors.add(login||null, 'Changepassword', { login:login, err:err });
			return;
		}
	}
*/


	app.get('/MoneyTransfers', function (req, res){
		if (isAuthenticated(req)){

			AsyncRender("DBServer", 'MoneyTransfers', res, {renderPage:'MoneyTransfers'}, {login:getLogin(req)})
			return;
		}

		sender.Answer(res, Fail);
	})



	app.post('/Profile', authenticated, get_profile, function (req, res){
		sender.Answer(res, req.profile || Fail);
		/*if (req.profile){
			sender.Answer(res, req.profile);
		} else {
			sender.Answer(res, Fail);
		}*/
	})

	app.get('/Profile', authenticated, get_profile, function (req, res){
	  if (req.profile){
	  	res.render('Profile', {msg:req.profile});
	  } else {
	  	res.redirect('Login');
	  }
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

	var INVALID_LOGIN_OR_PASS = '';
	var FIELD_MAX_LENGTH = 40;
	var MIN_PASS_LENGTH = 6;
	
	function get_login_from_email(email){ return email.split("@")[0]; }
	function ValidRegData(data)  { return ValidPass(data.password||null) && ValidEmail(data); }

	function ValidLoginData(data){ return ValidEmail(data||null) && ValidPass(data.password||null);	}
	function ValidEmail(data){ return (data.email && data.email.length<FIELD_MAX_LENGTH && validator.isEmail(data.email) ) }
	function ValidPass(password){ return (password && password.length<FIELD_MAX_LENGTH && password.length>=MIN_PASS_LENGTH && validator.isAlphanumeric(password) ) }
	function ValidLogin(data){ return (data.login && data.login.length<FIELD_MAX_LENGTH && validator.isAlphanumeric(data.login) ) }

	function isValid(user){ return ValidEmail(user) && ValidPass(user.password || null); }

	function render(page, data){
		return function (req, res){
			res.render(page, data);
		}
	}

	function answer_and_save_error(res, renderPage, ErrorName, login){
		return function (err){
			res.render(renderPage, { msg: err });
			Errors.add(login||null, ErrorName, { code: err });
		}
	}
}