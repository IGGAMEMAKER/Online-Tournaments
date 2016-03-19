var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var User = models.User;

var validator = require('validator');

var security = require('../Modules/DB/security');
const CURRENT_CRYPT_VERSION = 2;

var USER_EXISTS = 11000;
var UNKNOWN_ERROR=500;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var money_koef = 100;

var Message = models.Message;

var c = require('../constants');

var helpers = require('../helpers/helper')

//-----------------------EXTERNAL FUNCTIONS--------------------------------
// function add(){
// 	return new Promise(function (resolve, reject){
// 		Message.find()
// 	})
// }

function search(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].find(find || {}, parameters || '', function (err, array){
			if (err) return reject(err);

			resolve(array);// || null
		})
	})
}

function searchOne(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].findOne(find || {}, parameters || '', function (err, item){
			if (err) return reject(err);

			resolve(item);// || null
		})
	})
}

function findOne(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].findOne(find || {}, parameters || '', function (err, item){
			if (err) return reject(err);

			if (item) return resolve(item);

			reject(null);
		})
	})
}

function save(modelName, item){
	return new Promise(function (resolve, reject){
		var ITEM = new models[modelName](item)
		ITEM.save(function (err){
			if (err) return reject(err)

			return resolve(item)
		})
	})
}

function update(modelName, find, update, options){
	return new Promise(function (resolve, reject){
		models[modelName].update(find, update, options||null, function (err, count){
			if (err) return reject(err);

			if (helpers.updated(count)){
				return resolve(1);
			}

			return reject(null);
		})
	})
}


function all() {
	return search('Message', {})
}

var notifications = {
	all: function (login) {
		return search('Message', { target:login })
	}
	,news: function (login){
		return search('Message', { target:login , status: {$exists: false } })
	}
	,personal: function (target, type, data){ // creates personal notification
		return save('Message', { target:target, type:type, data:data })
	}
	,read: function (id, login){
		return update('Message', {"_id": id, target:login }, { status : c.MESSAGE_READ })
	}
	,markAll: function(login){
		return update('Message', { target:login, status: { $exists: false } }, { status : c.MESSAGE_READ }, {multi: true})
	}


}


function find_all_by_target_login(login){}


// all()
// notifications.all('Raja')

// notifications.news('Raja')

// notifications.personal('Raja', 'Come on!')
// .then(console.log)
// .catch(console.error)

function profile(login){
	return new Promise(function(resolve,reject){
		User.findOne({login:login}, 'login money email social', function (err, user) {
			if (err) return reject(err);
			
			if (!user) return resolve(null);
			return resolve(user);			
		});
	})
}

function find_or_reject(login, parameters){
	return new Promise(function (resolve, reject){
		User.findOne({login:login}, parameters||'', function(err, user){
			if (err) return reject(err);

			if (!user) return reject(null);
			return resolve(user);
		})
	})
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

//----------------------Tests-----------------------------


// -----------------------AUXILARY FUNCTIONS--------------------------

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

// module.exports.all = all;
// module.exports.profile = profile;
// module.exports.auth = auth;
// module.exports.setInviter = setInviter;
// module.exports.changePassword = changePassword;
// module.exports.resetPassword = resetPassword;
// module.exports.create = create;
// module.exports.moneyTop = moneyTop;
// module.exports.groupByEmails = groupByEmails;


module.exports.notifications = notifications;