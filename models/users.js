var Promise = require('bluebird');

var db = require('../db');
var User2 = db.wrap('User');

var configs = require('../configs');
var models = require('../models')(configs.db);
var User = models.User;

var c = require('../constants');


var helper = require('../helpers/helper');

var validator = require('validator');

var security = require('../Modules/DB/security');
const CURRENT_CRYPT_VERSION = 2;

var USER_EXISTS = 11000;
var UNKNOWN_ERROR=500;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var money_koef = 100;

var logger = require('../helpers/logger');

//-----------------------EXTERNAL FUNCTIONS--------------------------------

function all() {
	return User2.list({});
}

function profileByMail(email){
	return User2.findOne({ email })
		.then(p => {
			return {
				login: p.login,
				money: p.money,
				email: p.email,
				social: p.social
			}
		});
}

function update_user(find, update, parameters){
	return User2.update(find, update, parameters);
}

///////////////////////////////

function update_user_status(login, status){
	return getByLogin(login)
	.then(function (profile){
		var upd = {
			$set : {
				'info.status' : status
			}
		};

		return update_user({login:login}, upd, {})
	})
}

function getByLogin(login){
	return User2.find({login: login})
	.then(function (user){
		logger.debug(user);

		if (!user.info) {
			return noInfoFix(login);
		}

		if (!user.info.points) {
			return noPointsFix(login);
		}

		if (!user.info.packs) {
			return noPacksFix(login)
		}
	})
	.then(function (result){
		return User2.find({login: login})
	});
}

// joinTeam('g.iosebashvili', 'Adidas Team Pro');

function joinTeam(login, team){ // teamname
	return User2.update({ login: login }, {$set: { team: team } })
}

function quitTeam(login){
	return User2.update({ login: login }, {$set: { team: null } })
}

function noInfoFix(login){
	console.log('noInfoFix', login);

	var upd = {
		$set : {
			info : {
				// status: c.USER_STATUS_NEWBIE,
				status: c.USER_STATUS_READ_FIRST_MESSAGE,
				packs: pack.newbiePackSet,
				points: 0
			}
		}
	};

	return update_user({login:login}, upd, {})
}

function noPointsFix(login) {
	var upd = {
		$set : {
			info : {
				points: 0
			}
		}
	};

	return update_user({login:login}, upd, {})
}

function noPacksFix(login){
	console.log('noPacksFix', login);

	var upd = {
		$set : {
			info : {
				packs: pack.newbiePackSet
			}
		}
	};

	return update_user({login:login}, upd, {})
}

var pack = {
	initialize: function(login){
		// return User2.find({login:})
		return User2.update({login:login}, {$set: {'info.packs': pack.newbiePackSet }})
	}
	,getUser: function (login){
		return getByLogin(login)
	}
	,pickFrom: function (from){
		return {
			1: from[1],
			2: from[2],
			3: from[3],
			4: from[4]
		}
	}
	,newbiePackSet: {
		0: 0,
		1: 20,
		2: 0,
		3: 0,
		4: 0
	}
	,setDefault: function (login){
		// console.log('setDefault', login)
		return noPacksFix(login)
	}
	,add: function(login, colour, count){
		// return User2.update({login:login})
		return pack.getUser(login)
		.then(function (user){
			// console.log('second user', user)
			var packs = pack.pickFrom(user.info.packs);
			// console.log('second user', packs);
			var now = parseInt(packs[colour]) + parseInt(count);
			packs[colour] = now;

			// console.log('modified packs', packs);

			return User2.update({login:login}, {$set: {'info.packs': packs} })
		})
	}
	,decrease: function (login, colour, count){
		return pack.getUser(login)
		.then(function (user){
			// console.log(user);

			var packs = pack.pickFrom(user.info.packs);
			// console.log(packs, login, colour, count);

			if (packs[colour] >= count){
				// packs[colour] -= count;
				var now = parseInt(packs[colour]) - parseInt(count);
				packs[colour] = now;
				return User2.update({login:login}, {$set: {'info.packs': packs} })
			} else {
				throw 'no necessary pack ' + login + colour
			}
		})
	}
};

function update_password_by_email (email, password) {
	var cryptVersion = CURRENT_CRYPT_VERSION;

	var newPass = security.Hash(password, cryptVersion);

	return User2.update({ email }, {$set : {password:newPass, cryptVersion:cryptVersion} });
}

function kill(login){
	return User2.remove({ login });
}

function create_login_link(email){
	var login;
	
	var newPass = security.create_random_password();
	var link = createLink(newPass);
	
	// console.log('create_login_link', login)
	return profileByMail(email)
	.then(function (user){
		login = user.login;
		return set_login_link(email, link)
	})
	.then(function (result) {
		return update_password_by_email(email, newPass)
	})
	.then(function (result) {
		return {
			password: newPass,
			link: link,
			login: login,
			email: email
		};
	})
}

function update_auth_links(users){
	for (var i = users.length - 1; i >= 0; i--) {
		var email = users[i].email;

		var login;

		var newPass = security.create_random_password();
		var link = createLink(newPass);

		// console.log('create_login_link', login)
		return profileByMail(email)
			.then(function (user){
				login = user.login;
				return set_login_link(email, link)
			})
			.then(function (result){
			})
			.catch(console.error)
	}
}

function set_login_link(email, link){
	return User2.update({email:email}, {$set: { link:link } });

	// return new Promise(function (resolve, reject){
	// 	User.update({email:email}, {$set: { link:link } }, function (err, count){
	// 		if (err) return reject(err);
  //
	// 		if (!updated(count)) return reject(null);
  //
	// 		return resolve(1);
	// 	})
	// })
}

function createLink(newPass){
	return security.sha(newPass);
}

function auth_by_link(login, link){
	return User2.findOne({login:login, link:link})
}

function create(login, password, email, inviter){
	return new Promise(function (resolve, reject){
		if ( invalid_email(email) || invalid_pass(password) ) return reject(INVALID_DATA);//|| invalid_login(login)

		var USER = get_new_user(login, password, email);

		if (inviter && validator.isAlphanumeric(inviter)) USER.inviter= inviter;

		var user = new User(USER);
		user.save(function (err) {
			if (err) {
				if (err.code==USER_EXISTS) {
					log('USER_EXISTS : ' + login);
					return reject(USER_EXISTS);
				}
				return reject(UNKNOWN_ERROR);
			}

			log('added User ' + login + '/' + email);
			return resolve(USER);
		})

	});
}

function givePoints(login, points) {
	logger.debug('debug givePoints', login, points);
	return getByLogin(login)
		.then(user => {
			var now = user.info.points || 0;
			return User2.update({ login }, { $set: { 'info.points': now + points }})
		})
}

function richUsers(min, max){
	return new Promise(function (resolve, reject){
		User.find({ money : {$gt: min, $lt: max } })
		.sort('-money')
		.exec(function (err, users){
			if (err) return reject(err);

			return resolve(users||[]);
		})

	})
}

function poorUsers(max){
	return new Promise(function (resolve, reject){
		User.find({ money : { $lt: max } })
		.sort('-money')
		.exec(function (err, users){
			if (err) return reject(err);

			return resolve(users||[]);
		})

	})
}

function auth(login, password){
	return new Promise(function (resolve, reject){
		User.findOne({login:login}, 'login password cryptVersion salt' , function (err, user) {
			if (err) return reject(err);
			//console.log('auth', user);
			//console.log('--------------');
			if (user && passwordCorrect(user, password) ){
				resolve({login:user.login});//resolve(OK);
				//console.log('passwordCorrect');
				if (password_needs_update(user.cryptVersion)) update_password(login, password, CURRENT_CRYPT_VERSION);
			}	else {
				return reject('invalid_login or invalid_pass');
			}
		});
	})
}

function changePassword(login, oldPass, newPass){
	return auth(login, oldPass)
	.then(function (result){
		return update_password(login, newPass, CURRENT_CRYPT_VERSION);
	})
}

// function changePassword(login, oldPass, newPass){
// 	return auth(login, oldPass)
// 	.then(auth_printer)
// 	.then(function(authenticated){
// 		if (authenticated) {
// 			return update_password(login, newPass, CURRENT_CRYPT_VERSION);
// 		}
// 		return null;
// 	})
// 	.then(function(changed){
// 		log('changed: ' + changed);
// 	})
// 	/*return new Promise(function(resolve, reject){
// 		User.findOne({login:login}, '', function (err, user){
// 			if (err) return reject(err);

// 			if (!user || !passwordCorrect(user, oldPass)) return resolve(Fail);

// 			return update_password(login, newPass, CURRENT_CRYPT_VERSION);
// 		})
// 	})*/
// }

function setInviter(login, inviter, inviter_type){
	return User2.findOne({ login })
	.then(function (user) {
		if (user.inviter) throw 'isSet';

		var updObject = {
			inviter,
			inviter_type: inviter_type||null
		};

		return User2.update({ login }, updObject);
	})
}

function groupByEmails(){
	return new Promise(function (resolve, reject){
		User.aggregate([
		// { $match: { date:time.happened_this_week(), status :TOURN_STATUS_FINISHED } },
		{
			$group: {
				_id: "$email",
				count: { $sum: 1 }
			}
		},
		{
			$sort: {count:-1}
		}
		], function (err, users){
			if (err) return reject(err);
			//	console.log(users);
			return resolve(users||[]);
		})
	})
}

function mailers(){
	return new Promise(function (resolve, reject){
		User.find({ email: {$exists: true} }, function (err, users){
			if (err) return reject(err);

			return resolve(users||[]);
		})
	})
}

function moneyTop(moneyMoreThan){
	return User2.aggregate([
		{
			$match: { money : {$gt: moneyMoreThan } }
		}, {
			$sort: { money: -1 }
		}
	]);
}

// function resetPassword(user){
// 	return new Promise(function (resolve, reject){
// 		// var login = user.login;
// 		var email = user.email;
// 		var newPass = security.create_random_password();//HASH();
// 		//Log('Filter passwords, when you change them!!', STREAM_SHIT);
//
// 		// login:login,
// 		User.update({email:email}, {$set : { password:HASH(newPass), cryptVersion:CURRENT_CRYPT_VERSION } }, function (err, count){
// 			//if (err) { Log(err, STREAM_ERROR); reject(err); }
// 			if (err) return reject(err);
//
// 			if (updated(count)) {
// 				user.password = newPass;
// 				resolve(user); // Answer(res, OK);
// 				//Log('resetPassword OK '+ login + '  ' + newPass, STREAM_USERS);
// 			} else {
// 				reject(Fail);	// Answer(res, Fail);
// 				//Log('resetPassword Fail '+login + ' ', STREAM_USERS);
// 			}
//
// 		})
//
// 	})
// }



function moneyIncrease(login, money){
	return User2.update({ login }, {$inc: { money }})
		.catch(err => {
			logger.log(err);
			return Fail
		});
	// return new Promise(function(resolve, reject){
	// 	User.update({login:login}, {$inc: { money: ammount }} , function (err, count) {
	// 		if (err) return reject(err);
  //
	// 		if (updated(count)) return resolve(OK);
  //
	// 		return resolve(Fail);
	// 	})
	// })
}

// -----------------------AUXILARY FUNCTIONS--------------------------

function update_password (login, password, cryptVersion) {
	return new Promise(function (resolve, reject){
		var newPass = security.Hash(password, cryptVersion);

		User.update({login:login}, {$set : {password:newPass, cryptVersion:cryptVersion} }, function (err, count){
			if (err) { 
				logger.log(err, 'CANNOT UPDATE PASSWORD TO NEWER ALGORITHM ' + cryptVersion);
				return reject(err);
			}
			
			if (!updated(count)) return resolve(Fail);
			logger.log('update_password OK');
			return resolve(OK);
		});
	})
}


function now(){ return new Date(); }

function HASH(password){
	//return password;
	return security.Hash(password, CURRENT_CRYPT_VERSION);
}

function password_needs_update(cryptVersion){ return cryptVersion!=CURRENT_CRYPT_VERSION; }




function passwordCorrect(user, enteredPassword) { return security.passwordCorrect(user, enteredPassword); }

function updated(count){
	//console.log('Updated : ' + JSON.stringify(count), STREAM_USERS );
	return count.n > 0;
}

function invalid_email(email){ return !validator.isEmail(email); }
function invalid_login(login){ return !validator.isAlphanumeric(login); }
function invalid_pass(pass)  { return !validator.isAlphanumeric(pass);}


function get_new_user(login, password, email){
	return {
		login:login, 
		password: HASH(password, CURRENT_CRYPT_VERSION), 
		money:0, 
		email:email, 
		date: now(), 
		activate:0, 
		bonus:{},

		info:{
			status: c.USER_STATUS_NEWBIE,
			packs: pack.newbiePackSet,
			points: 0
		},

		cryptVersion:CURRENT_CRYPT_VERSION,
		salt:''
		//link:createActivationLink(login) 
	};
}



function log(msg){ logger.log(msg); }


module.exports = {
	all,
	profile: getByLogin,
	auth,
	setInviter,
	changePassword,
	create,
	moneyTop,
	groupByEmails,
	auth_by_link,
	kill,
	mailers,
	update_auth_links,
	update_user_status,
	pack,
	moneyIncrease,
	quitTeam,
	joinTeam,

	resetPassword: create_login_link,
	rich: richUsers,
	givePoints
};
