var validator = require('validator');
var security = require('../DB/security');

var mail = require('../../helpers/mail');

var respond = require('../../middlewares/api-response');

var Users = require('../../models/users');
var TournamentReg = require('../../models/tregs');
var Tournaments = require('../../models/tournaments');
var Actions = require('../../models/actions');
var Errors = require('../../models/errors');

var statistics = require('../../models/statistics');

var middlewares = require('../../middlewares');
var authenticated = middlewares.authenticated;

var logger = require('../../helpers/logger');

var API = require('../../helpers/API');
var c = require('../../constants');

var Fail = {
	result: 'fail'
};
var OK = {
	result: 'OK'
};
var sender = require('../../requestSender');

module.exports = function(app, AsyncRender, aux) {

	function destroy_session(req, res, next){
		var login = req.login;
		req.session.destroy(function (err){
			if (err) { 
				Errors.add(login, 'destroy_session', { err:err });
				// console.error('Session destroying error:' + err); 
			}
		});
		next();
	}

	app.get('/Logout', destroy_session, function (req, res){
		res.redirect('Login');
	});// render('Login',{}) )

	app.get('/Login', render('Login',{}) );
	app.get('/Register', render('Register'));

	
	app.get('/ResetPassword', render('ResetPassword'));
	app.get('/Changepassword', authenticated, render('Changepassword'));
	app.post('/ChangePassword', authenticated, change_password, change_password_fail);

	app.post('/Login', Login);//std_auth('Login')
	app.post('/Register', register);//std_auth('Register') 

	function register(req, res){
		var user = {
			email: req.body.email
			, login: get_login_from_email(req.body.email)
			, password: req.body.password
		};
		if (isValid(user)){
			req.user= user;
		} else {
			return res.redirect('/Tournaments');
		}


		var login = req.user.login;
		var password = req.user.password;
		var email = req.user.email;
		var inviter = req.user.inviter;
		
		// console.log('trying to register', login, email, password, inviter);

		Users.create(login, password, email, inviter)
		.then(function (user){
			//console.log('registered', user);
			saveSession(req, res, 'register');
			mail.sendActivationEmail(user);

			Actions.add(login, 'register');

		})
		.catch(answer_and_save_error(res, 'Register', 'register', login));
/*		.catch(function (err){
			res.render('Register', { msg:err });
			Errors.add(login, 'register', { code:err })
		})*/
	}

	function Login(req, res) {
		// var login = get_login_from_email(req.body.email);
		var login = get_login_from_email(req.body.email);
		var password = req.body.password;
		//console.log('Login', login, password);
		req.user = {
			login: login
		};

		Actions.add(login, 'login');

		Users.auth(login, password)//, req.user.email, req.user.inviter
		.then(function (user){
			// console.log('logged In', user);
			req.user = user;
			saveSession(req, res, 'Login');

			// Actions.add(login, 'login');
		})
		.catch(function (err) {
			res.render('Login', { msg : err });
			Errors.add(login, 'Login', { code: err })
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
				res.redirect('/Tournaments');
			}
		})
	}

	app.get('/api/users/:login/setDefault', middlewares.isAdmin, respond (req => {
		var login = req.params.login;
		return Users.pack.setDefault(login)
	}));

	app.post('/api/users/increase-points/:login/amount', middlewares.isAdmin, respond(req => {
		var login = req.params.login;
		var amount = req.params.amount;

		logger.debug('givePoints', login, amount);

		return Users.givePoints(login, amount);
	}));

	app.post('/buy-points', middlewares.authenticated, respond(req => {
		var points = req.body.points;
		// 6 - 1000000p	3600	278
		// 7 - 10000000p	10000	1000
		// 3 - 1000p	30	33
		// 4 - 10000p	120	80
		// 5 - 100000p	600	150
		// 1 - 10p		5	2
		// 2 - 100p	10	10
		// 0 - 0p		0	0
		var amount;

		switch (points) {
			case 1000:
				amount = 30;
				break;
			case 10000:
				amount = 120;
				break;
			case 100000:
				amount = 600;
				break;
			case 1000000:
				amount = 3600;
				break;
			case 10000000:
				amount = 10000;
				break;
			default:
				amount = 0;
		}

		if (!amount) {
			points = 0;
		}

		return API.money.pay(req.login, amount, c.SOURCE_TYPE_POINTS_BUY)
			.then(result => {
				logger.debug('buy-points', amount, points, req.login, result);

				return Users.givePoints(req.login, points);
			})
	}));

	var register_manager = require('../../chains/registerInTournament');
	
	app.post('/CancelRegister', middlewares.authenticated, function (req, res) {
		var data = req.body;
		logger.debug(data.login, data.tournamentID);

		AsyncRender('DBServer', 'CancelRegister', res, null,  data);
	});

	app.get('/api/tournaments/start/:id/:force', middlewares.isAdmin, function (req, res){
		var force = req.params.force;
		var id = req.params.id;
		if (isNaN(id)) return res.end('fail');

		var tournamentID = parseInt(id);
		Tournaments.getByID(tournamentID)
		.then(function (tournament){
			var players = tournament.players || 1;
			newGonext = [players, 1];
			
			return Tournaments.edit(tournamentID, { goNext: newGonext })
		})
		.then(function (result){
			res.json({ msg: result });
			console.log('START MP Tournaments!', tournamentID, result);
			if (result || force== 'force') register_manager.StartTournament(tournamentID);//, null, res);
		})
		.catch(function (err){
			res.json({err: err});
			logger.error(err);
		})
	});

	app.post('/RegisterInTournament', middlewares.authenticated, function (req, res){
		var tournamentID = parseInt(req.body.tournamentID);
		var login = req.login;

		register_manager.register(tournamentID, login, res);

	  // regManager('RegisterUserInTournament',req, res);
	  // ****
	  //console.log('WRITE Socket emitter!!!')
	});

	app.get('/setInviter/:inviter_type/:inviter', middlewares.authenticated, function (req, res){
		// when new user is redirected to main page I need to know, where he came from.
		// user sends ajax request and i understand, who invited him/her
		// even if this request fails, nothing breaks!

		var login = req.login;
		var inviter = req.params.inviter;
		var inviter_type = req.params.inviter_type;

		if (inviter && inviter_type) {
			Users.setInviter(login, inviter, inviter_type)
				.catch(function (err) {
					console.error(err, 'setInviter Error in setInviter', login, inviter);
				});
			Actions.add(login, 'setInviter', { inviter: inviter, inviter_type:inviter_type });
		}

		res.end('');
	});
	
	app.get('/linker/:login/:link', function (req, res){
		var login = req.params.login;
		var link = req.params.link;


		Actions.add(login, 'linker');
		// Users.auth(login, password)//, req.user.email, req.user.inviter
		Users.auth_by_link(login, link)
		.then(function (user){
			req.user = user;

			saveSession(req, res, 'Login');
			// Actions.add(login, 'login');
		})
		.catch(function (err){
			res.redirect('/Login');//, {msg : err});
			Errors.add(login, 'linker', { code:err })
		})
	});

	app.get('/killUser/:login', middlewares.isAdmin, function (req, res){
		var login = req.params.login;

		Users.kill(login)
		.then(function (result){
			res.json({result:result})
		})
		.catch(function (err){
			res.json({err:err});
		})
	});

	// var test_lgn = get_login_from_email('Andrey_vasilyev1994@mail.ru');
	// console.error(test_lgn);

	app.post('/ResetPassword', function (req, res){
		var email = req.body.email;
		// var login = req.body.login || get_login_from_email(email);

		var link_pass;

		statistics.attempt('resetPassword', { email:email });

		Users.resetPassword(email)
		.then(function (linkAndPass) {
			link_pass = linkAndPass;
			return linkAndPass;
		})
		.then(mail.sendResetPasswordEmail)
		.then(function (result){
			res.render('ResetPassword', {msg:OK});
		})
		.catch(function (err){
			statistics.fail('resetPassword', { email: email, err: err });
			res.render('ResetPassword', { msg: err });

			Errors.add(email||null, 'resetPassword', { email: email, err: err });
		})
	});

	function change_password(req, res, next){
		var password = req.body.password;
		var passwordRepeat = req.body.passwordRepeat;
		var newpassword = req.body.newpassword;
		var login = req.login;

		var isInputValid = password && passwordRepeat && newpassword && password == passwordRepeat && ValidPass(newpassword);
		if (!isInputValid) {
			/*res.render('Changepassword', {msg:{result:'Некорректные данные'}} );
			Errors.add(login||null, 'Changepassword', { email:email, login:login, err:err });
			return;*/
			return next('invalid input');
		}

		Users.changePassword(login, password, newpassword)
		.then(function (result) {
			res.render('Changepassword', { msg: result });
			// res.redirect('Profile');
		})
		.catch(function (err){
			return next(err);
		})
	}

	function change_password_fail(err, req, res, next){
		var login = req.login;
		res.render('Changepassword', { msg: { result:'Проверьте введённые данные' } } );
		Errors.add(login||null, 'Changepassword', { login:login, err:err });
	}

	

/*
function (req, res){
		var password = req.body.password;
		var passwordRepeat = req.body.passwordRepeat;
		var newpassword = req.body.newpassword;
		var login = req.login;

		var isInputValid = password && passwordRepeat && newpassword && password == passwordRepeat && ValidPass(newpassword);
		if (!isInputValid) {
			res.render('Changepassword', {msg:{result:'Некорректные данные'}} );
			Errors.add(login||null, 'Changepassword', { login:login, err:err });
			return;
		}
	}
*/


	app.get('/MoneyTransfers', middlewares.authenticated, function (req, res){
		AsyncRender("DBServer", 'MoneyTransfers', res, {renderPage:'MoneyTransfers'}, {login:req.login});
	});

	app.get('/mailUsers', authenticated, function (req, res, next){
		Users.groupByEmails()
		.then(middlewares.answer(req, next))
		.catch(next);
	}, middlewares.render('Lists/mailUsers'), middlewares.send_error);

	app.post('/Profile', authenticated, get_profile, function (req, res){ 
		sender.Answer(res, req.profile || Fail);
	}, function (err, req, res, next){
			var login = req.login || null;
	  	Errors.add(login, 'get profile', {err:err});

	  	// res.json({msg: null});
	  	sender.Answer(res, Fail);
	});

	app.get('/myprofile', authenticated, get_profile, function (req, res){
		res.json({ profile : req.profile });
	}, function (err, req, res, next){
		res.json({ err });
	});

	app.get('/Profile', authenticated, get_profile, function (req, res){
	  res.render('index', {msg:req.profile});
	}, function (err, req, res, next) {
			var login = req.login || null;
	  	Errors.add(login, 'get profile', {err:err});

	  	res.redirect('Login');
	});

	function get_profile(req, res, next){
		var login = req.login;

		var profile= {
			login: login,
			tournaments: {}
		};

		Users.profile(login)
		.then(function (user){
			profile.money = user.money;
			profile.email = user.email;

			profile.packs = user.info.packs;
			profile.points = user.info.points;
		})
		.then(function (user) {
			return TournamentReg.get(login)
		})
		.then(function (tournaments) {
			profile.tournaments = tournaments;
			req.profile = profile;
			next()
		})
		.catch(function (err){
			aux.fail(login, 'get_profile error', { err: err, profile:profile });
			logger.error('get_profile error', login, err);
			req.profile = null;
			next(err);
		})
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
};
