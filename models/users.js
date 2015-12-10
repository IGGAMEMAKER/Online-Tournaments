var Promise = require('bluebird');

var configs = require('../configs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var User = mongoose.model('User', { 
	login: String, password: String, money: Number, 
	email: String, activated:String, date: Date, link: String, bonus:Object, 
	salt:  String, cryptVersion:Number 
});

var validator = require('validator');

var security = require('../Modules/DB/security');
const CURRENT_CRYPT_VERSION = 2;

var USER_EXISTS = 11000;
var UNKNOWN_ERROR=500;

var Fail = {
	result: 'fail'
};
var OK = {
	result: 'OK'
}

var money_koef = 100;

//-----------------------EXTERNAL FUNCTIONS--------------------------------

function all(){
	return new Promise(function(resolve, reject){
		User.find({}, 'login money' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
			if (err) return reject(err);

			return resolve(users||null);
		});

	})
}

function profile(login){
	return new Promise(function(resolve,reject){
		User.findOne({login:login}, 'login money email', function (err, user) {
			if (err) return reject(err);
			
			if (!user) return resolve(null);
			return resolve(user);			
		});
	})
}

function create(login, password, email){
	return new Promise(function (resolve, reject){
		if ( invalid_email(email) || invalid_login(login) || invalid_pass(password) ) return reject(INVALID_DATA);

		var USER = get_new_user(login, password, email);
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

function auth(login, password){
	return new Promise(function(resolve, reject){
		User.findOne({login:login}, 'login password cryptVersion salt' , function (err, user) {
			if (err) return reject(err);

			if (user && passwordCorrect(user, password) ){
				resolve(OK);

				if (password_needs_update(user.cryptVersion)) update_password(login, password, CURRENT_CRYPT_VERSION);
			}	else {
				return resolve(null);
			}
		});
	})
}

function changePassword(login, oldPass, newPass){
	return auth(login, oldPass)
	.then(auth_printer)
	.then(function(authenticated){
		if (authenticated) {
			return update_password(login, newPass, CURRENT_CRYPT_VERSION);
		}
		return null;
	})
	.then(function(changed){
		log('changed: ' + changed);
	})
	/*return new Promise(function(resolve, reject){
		User.findOne({login:login}, '', function (err, user){
			if (err) return reject(err);

			if (!user || !passwordCorrect(user, oldPass)) return resolve(Fail);

			return update_password(login, newPass, CURRENT_CRYPT_VERSION);
		})
	})*/
}

function resetPassword(user){
	return new Promise(function (resolve, reject){
		var login = user.login;
		var email = user.email;
		var newPass = security.create_random_password();//HASH();
		//Log('Filter passwords, when you change them!!', STREAM_SHIT);

		User.update({login:login, email:email}, {$set : { password:HASH(newPass), cryptVersion:CURRENT_CRYPT_VERSION } }, function (err, count){
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
	return new Promise(function(resolve, reject){
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


function now(){
	return new Date();
}

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

		cryptVersion:CURRENT_CRYPT_VERSION,
		salt:''
		//link:createActivationLink(login) 
	};
}



function log(msg){ console.log(msg); }

function printer(obj) { 
	log('obj:'); 
	//log(obj); 
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
	return new Promise(function(resolve, reject){
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