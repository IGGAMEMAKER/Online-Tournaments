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

//-----------------------EXTERNAL FUNCTIONS--------------------------------

function all(){
	return new Promise(function(resolve, reject){
		User.find({}, 'login money email social' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
			if (err) return reject(err);
			//console.log(users)
			return resolve(users||null);
		});

	})
}

function profile(login){
	return getByLogin(login)
	// return User2.find({login:login}, 'login money email social info')
	// return new Promise(function(resolve, reject){
	// 	User.findOne({login:login}, 'login money email social info', function (err, user) {
	// 		if (err) return reject(err);
			
	// 		if (!user) return resolve(null);
	// 		return resolve(user);
	// 	});
	// })
}

// function unsetInviter(login) {
//
// }


function profileByMail(email){
	return new Promise(function(resolve,reject){
		User.findOne({email:email}, 'login money email social', function (err, user) {
			if (err) return reject(err);
			
			if (!user) return resolve(null);
			return resolve(user);
		});
	})
}

function find_or_reject(login, parameters){
	return new Promise(function (resolve, reject){
		User.findOne({login:login}, parameters||'', function (err, user){
			if (err) return reject(err);
			if (!user) return reject(null);

			return resolve(user);
		})
	})
}

function update_user(find, update, parameters){
	return new Promise(function (resolve, reject){
		User.update(find, update, parameters, function(err, count){
			if (err) return reject(err)

			if (!updated(count)) return reject(null)
			resolve(1);
		})
	})
}

///////////////////////////////
function initializeInfo(login){
	var upd = {
		$set : { 
			info: { status: c.USER_STATUS_NEWBIE } 
		} 
	};
	return update_user({login:login}, upd, {})
	.then(function (result){
		return pack.initialize(login)
	})
	.then(function (result){
		return getByLogin(login)
	})
}

function update_user_status(login, status){
	return getByLogin(login)
	.then(function (profile){
		var upd = {
			$set : {
				'info.status' : status
			}
		}
		return update_user({login:login}, upd, {})
	})
}

function getByLogin(login){
	return User2.find({login: login})
	.then(function (user){
		if (!user.info) return noInfoFix(login)
		if (!user.info.packs) return noPacksFix(login)
	})
	.then(function (result){
		return User2.find({login: login})
	})
	// return fixUser(login)
	// var profile;
	// return User2.find({login:login})
	// .then(function (user){
	// 	profile = user;

	// 	console.log('getByLogin', user)
	// 	if (!user.info){
	// 		return initializeInfo(login)
	// 	} else {
	// 		if (!user.info.packs){
	// 			return pack.initialize(login)
	// 		} else {
	// 			return user
	// 		}
	// 	}
	// })
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
				packs: pack.newbiePackSet
			}
		}
	};
	return update_user({login:login}, upd, {})
}

function noPacksFix(login){
	console.log('noPacksFix', login)
	var upd = {
		$set : {
			info : {
				packs: pack.newbiePackSet
			}
		}
	};
	return update_user({login:login}, upd, {})
}

function fixUser(login){
	return User2.find({login: login})
	.then(function (user){
		if (!user.info) return noInfoFix(login)
		if (!user.info.packs) return noPacksFix(login)
	})
	.then(function (result){
		return User2.find({login: login})
	})
}

// profile('MorganFreeman223')

	// ,CARD_COLOUR_RED:1
	// ,CARD_COLOUR_BLUE:2
	// ,CARD_COLOUR_GREEN:3
	// ,CARD_COLOUR_GRAY:4


var pack = {
	initialize: function(login){
		// return User2.find({login:})
		return User2.update({login:login}, {$set: {'info.packs': pack.newbiePackSet }})
	}
	,getUser: function (login){
		// return fixUser(login)
		return getByLogin(login)
		// .then(function (user){
		// 	if (!user.info.packs) {
		// 		return pack.initialize(login)
		// 		.then(function (result){
		// 			return getByLogin(login)
		// 		})
		// 	}
		// 	return user
		// })
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
}

function update_password_by_email (email, password) {
	return new Promise(function (resolve, reject){
		var cryptVersion = CURRENT_CRYPT_VERSION;

		var newPass = security.Hash(password, cryptVersion);

		User.update({email:email}, {$set : {password:newPass, cryptVersion:cryptVersion} }, function (err, count){
			if (err) return reject(err);
			
			if (!updated(count)) return reject(null);

			return resolve(1);
		});
	})
}

function kill(login){
	return new Promise(function (resolve, reject){
		User.remove({login:login}, function (err, count){
			if (err) return reject(err);

			if (helper.removed(count)) return resolve(1);

			return reject(null);
		})
	})
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
	.then(function (result){
		return update_password_by_email(email, newPass)
	})
	.then(function (result){
		return {
			password:newPass,
			link:link,
			login:login,
			email:email
		};
	})
}

function update_auth_links(users){
	for (var i = users.length - 1; i >= 0; i--) {
		update_auth_link(users[i].email)
	};
}

function update_auth_link(email){
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

function set_login_link(email, link){
	return new Promise(function (resolve, reject){
		User.update({email:email}, {$set: { link:link } }, function (err, count){
			if (err) return reject(err);

			if (!updated(count)) return reject(null);

			return resolve(1);
		})
	})
}

function createLink(newPass){
	return security.sha(newPass);
}

function get(find){
	return new Promise(function (resolve, reject){
		User.findOne(find, function (err, user){
			if (err) return reject(err);

			if (!user) return reject(null);

			resolve(user)
		})
	})
}

function auth_by_link(login, link){
	return get({login:login, link:link})
}

function create(login, password, email, inviter){
	return new Promise(function (resolve, reject){
		if ( invalid_email(email) || invalid_pass(password) ) return reject(INVALID_DATA);//|| invalid_login(login)

		var USER = get_new_user(login, password, email);

		if (inviter && validator.isAlphanumeric(inviter)) USER.inviter= inviter;

		var user = new User(USER);
		user.save(function (err) {
			if (err){
				if (err.code==USER_EXISTS) {
					log('USER_EXISTS : ' + login);
					return reject(USER_EXISTS);
				}
				return reject(UNKNOWN_ERROR);
			}

			log('added User ' + login+'/' + email);
			return resolve(USER);
		})

	});
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
	return find_or_reject(login)
	.then(function (user){
		return new Promise(function (resolve, reject){
			if (user.inviter) return reject('isSet');

			var updObject = { 
				inviter:inviter, 
				inviter_type:inviter_type||null 
			}
			
			User.update({login:login}, {$set : updObject }, function (err, count){
				if (err) return reject(err);

				if (updated(count)) return resolve(1);
				return reject('update failed');
			})
			
		})
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
	return new Promise(function (resolve, reject){
		User.find({ money : {$gt: moneyMoreThan } })
		.sort('-money')
		.exec(function (err, users){
			if (err) return reject(err);

			return resolve(users||[]);
		})

	})
}

/*function setInviter(login, inviter){
	return new Promise(function (resolve, reject){
		User.findOne({login:login}, function (err, user){
			if (err) { return reject(err); }

			if (!user || user.inviter) { return reject(null); }

			User.update({login:login}, function (err, count){
				if (err) { return reject(err); }

				if (updated(count)) {
					resolve(null);
				} else {

					reject(null);
				}

			})

		})
	})
}
*/

function resetPassword(user){
	return new Promise(function (resolve, reject){
		// var login = user.login;
		var email = user.email;
		var newPass = security.create_random_password();//HASH();
		//Log('Filter passwords, when you change them!!', STREAM_SHIT);

		// login:login, 
		User.update({email:email}, {$set : { password:HASH(newPass), cryptVersion:CURRENT_CRYPT_VERSION } }, function (err, count){
			//if (err) { Log(err, STREAM_ERROR); reject(err); }
			if (err) return reject(err);
			
			if (updated(count)) {
				user.password = newPass;
				resolve(user); // Answer(res, OK);
				//Log('resetPassword OK '+ login + '  ' + newPass, STREAM_USERS);	
			} else {
				reject(Fail);	// Answer(res, Fail);
				//Log('resetPassword Fail '+login + ' ', STREAM_USERS);
			}

		})

	})
}



function moneyIncrease(login, ammount){
	return new Promise(function(resolve, reject){
		User.update({login:login}, {$inc: { money: ammount }} , function (err, count) {
			if (err) return reject(err);

			if (updated(count)) return resolve(OK);

			return resolve(Fail);
		})
	})
}

function tryMoneyDecrease(login, ammount, force){
	return hasEnoughMoney(login, ammount)
	.then(function(hasMoney){
		if (hasMoney==OK || force) return moneyDecrease(login, ammount);
		return Fail;
	})
	.then(function(result){
		log('result: ' + JSON.stringify(result));
	})
	.catch(catcher);
}

function moneyDecrease(login, ammount){
	return new Promise(function(resolve, reject){
		User.update({login:login}, {$inc: { money: -ammount }} , function (err, count) {
			if (err) return reject(err);

			if (updated(count)) return resolve(OK);

			return resolve(Fail);
		});
	});
}

function grantMoney(login){
	return new Promise(function (resolve, reject){
		console.log('grantMoney', login)
		User.findOne({login:login}, function (err, user){
			if (err) return reject(err);
			// console.log(err, user);

			if (user && user.money < 100){
				// User.update({login:login}, {})
				return moneyIncrease(login, 100)
				// .then(console.log)

				// .catch(console.error)
				// return resolve(1);
			}

			return reject(null);
		})

	})
}

// grantMoney('Raja')

function hasEnoughMoney(login, ammount){
	return new Promise(function(resolve, reject){
		User.findOne({login:login}, 'money', function(err, user){
			if (err) return reject(err);

			if (user && user.money>=ammount) return resolve(OK);

			return resolve(Fail);
		})
	})
}

//----------------------Tests-----------------------------

/*changePassword('AlvaroFernandez', 'pppppppp', 'asdasd')
.then(function(asd){
	log('chain added!');
})*/

/*create('AlvaroFernandez11', 'ghjghj', '789hj@mail.ru')
.catch(function(err){
	switch(err){
		case USER_EXISTS:
			log('USER_EXISTS: ((' + err);
		break;
		default:
			log('UNKNOWN_ERROR' + err);
		break;
	}
})*/


//tryMoneyDecrease('AlvaroFernandez', 100*money_koef);
//moneyIncrease('AlvaroFernandez', 200*money_koef);

/*auth('AlvaroFernandez', 'cojonesAAA')
.then(function(auth){
	if (!auth) { 
		log('auth failed'); 
	} else {
		log('authenticated');
	}
})*/



//update_password('AlvaroFernandez', 'asdasd', CURRENT_CRYPT_VERSION);

/*profile('AlvaroFernandez')
.then(p_printer)
.catch(catcher);*/

/*all()
.then(function(users){
	log('Users: ');
	log(users);
})
.catch(catcher);*/


// -----------------------AUXILARY FUNCTIONS--------------------------

function update_password (login, password, cryptVersion) {
	return new Promise(function (resolve, reject){
		var newPass = security.Hash(password, cryptVersion);

		User.update({login:login}, {$set : {password:newPass, cryptVersion:cryptVersion} }, function (err, count){
			if (err) { 
				log(err, 'CANNOT UPDATE PASSWORD TO NEWER ALGORITHM ' + cryptVersion); 
				return reject(err);
			}
			
			if (!updated(count)) return resolve(Fail);
			log('update_password OK');
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
	return count.n>0;
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
			packs: pack.newbiePackSet
		},

		cryptVersion:CURRENT_CRYPT_VERSION,
		salt:''
		//link:createActivationLink(login) 
	};
}



function log(msg){ console.log(msg); }

function printer(obj) { 
	//log('obj:'); 
	log(obj); 
}

function auth_printer(authenticated){
	if (!authenticated) { 
		log('auth failed'); 
	} else {
		log('authenticated');
	}
	return authenticated;
}

function p_printer (obj) {
	return new Promise(function (resolve, reject){
		printer(obj);
		return resolve(obj);
	})
}

function catcher(err){
	log('catched error!');
	if (err){
		log(err.stack||err);
	} else {
		log('null error');
	}
}

module.exports.all = all;
module.exports.profile = profile;
module.exports.auth = auth;
module.exports.setInviter = setInviter;
module.exports.changePassword = changePassword;
// module.exports.resetPassword = resetPassword;
module.exports.create = create;
module.exports.moneyTop = moneyTop;
module.exports.groupByEmails = groupByEmails;
module.exports.resetPassword = create_login_link;
module.exports.auth_by_link = auth_by_link;

module.exports.kill = kill;
module.exports.rich = richUsers;
module.exports.poor = poorUsers;

module.exports.mailers = mailers;
module.exports.update_auth_links = update_auth_links;

module.exports.grantMoney = grantMoney
module.exports.update_user_status = update_user_status
module.exports.pack = pack

module.exports.moneyIncrease = moneyIncrease

module.exports.quitTeam = quitTeam;
module.exports.joinTeam = joinTeam;