var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var User = models.User;

var Message = models.Message;

var c = require('../constants');

var helpers = require('../helpers/helper')

//-----------------------EXTERNAL FUNCTIONS--------------------------------

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
	,getByID: function(id){
		return findOne('Message', { "_id": id })
	}

}


//----------------------Tests-----------------------------
// all()
// notifications.all('Raja')

// notifications.news('Raja')

// notifications.personal('Raja', 'Come on!')
// .then(console.log)
// .catch(console.error)


// -----------------------AUXILARY FUNCTIONS--------------------------

function now(){ return new Date(); }

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