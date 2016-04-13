var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);

var User = models.User;

var Message = models.Message;

var c = require('../constants');

var helpers = require('../helpers/helper')


var db = require('../db');
var News = db.wrap('News');
var Message2 = db.wrap('Message');

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

var chat = {
	load: function (room){
		return Message2.aggregate([ 
			{ $match : { room:room } }, 
			// { $sort : { "$natural": -1 } },
			{ $sort : { "_id": -1 } },
			{ $limit : 20 }
		])
	},
	add: function (room, login, text){
		return Message2.save({ room:room, senderName:login, text: text, date: new Date() })
	}
}
// chat.add('default', '23i03g', 'QUATTRO')

// chat.load('default')
// .then(function (messages){
// 	console.log(messages);
// })

var news = {
	//{ active: Boolean, finishTime: Date, startTime : Date, text: String, image: String, url: String }
	// text image url
	add: function(text, image, url, title, finishTime, startTime){
		var obj = { active: false, title:title, finishTime: finishTime, startTime : startTime, text: text, image: image, url: url }
		return News.save(obj);
	},
	activation: function(id, status){
		var obj = { active: false }
		if (status=='show') obj.active = true;

		return News.update({_id: id}, obj)
	},
	edit: function (id, obj){
		return News.update({_id: id}, obj)
	},
	get: function(id){
		return News.find({ _id : id })
	},
	all: function(){ return News.list({}); },
	active: function() { return News.list({ active: true }) },
	remove: function(id) { return News.remove({ _id: id }) },
	clear: function() { return News.remove({}) }

}
// news.clear();
// news.activation('')

// news.add('NEWS1', '/img/cardLayers/0.jpg', "/Packs", 'TITLE')
// .then(console.log)
// .catch(console.error)

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
module.exports.news = news;
module.exports.chat = chat;