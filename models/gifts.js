var Promise = require('bluebird');

var configs = require('../configs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var Gift = mongoose.model('Gift', { 
	name: String, photoURL: String, 
	description: String, URL: String, 
	price: Number, sended:Object, 
	date:Date 
});

function all(query){
	return new Promise(function(resolve, reject){
		Gift.find(query||{}, function (err, gifts){
			if (err) return reject(err);

			return resolve(gifts||null);
		});
	})
}

function getByID(giftID){
	return new Promise(function(resolve, reject){
		Gift.findOne({ _id : giftID}, function (err, gift){
			if (err) return reject(err);

			return resolve(gift||null);
		});
	});
}

function add(data){
	return new Promise(function(resolve, reject){
		log('trying to add gift '+ JSON.stringify(data)+ ' Gifts');

		if (data){
			gift = new Gift(data);
			gift.save(function (err){
				if (err) return reject(err);

				log('Added gift ' + JSON.stringify(data) + ' Gifts');
				return resolve(OK);
			})
		} else {
			log('No addition. Gift is null' + ' Gifts');
			return reject(Fail);
		}
	});

}

log('asdddd');
getByID('5622b320ecdf83f91ef09036')
.then(helper.p_printer)
.catch(helper.catcher);

//function log(msg){ console.log(msg); }