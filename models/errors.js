var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var time = require('../helpers/time');

var Error = models.Error;

// Error model
/*
	login: String,
	date: Date,
	type: String,
	auxillaries: Object
*/

function LogError(msg, err){
	console.log('Error in LogError ', msg, err);
	//return reject(err);
}

function find_by_login_for_period(login, d1, d2){
	return new Promise(function (resolve, reject){
			var query = {login: login};
			if (d1 && d2) query.date = time.happened_in_period(d1, d2);

			Error.find(query, function (err, errors){
				if (err) {
					LogError('find_by_login_for_period ', [query, login, err]);
					return reject(err);
				}

				return resolve(errors||[]);
			})
	})
}

function find_for_recent_period(time_function){
	return new Promise(function (resolve, reject){
		Error.find({ date:time_function() }, function (err, errors){
			if (err) { 
				LogError('find_for_recent_period', err); 
				return reject(err); 
			}

			return resolve(errors||[]);
		})
	})
}



module.exports = {

	add: function(login, type, auxillaries) {
		return new Promise(function (resolve, reject){
			error = new Error({
				login : login, 
				type  : type, 
				date  : new Date(), 
				auxillaries : auxillaries || null
			});
			
			error.save(function (err){
				if (err) {
					LogError('add', err);
					return reject(err);
				}

				return resolve(error);
			});
		})
	}

	,findByLogin: function(login){
		return find_by_login_for_period(login);
	}

	//findByLoginPerWeek
	//findByLoginPerDay

	,findAllPerMonth: function() {
		return find_for_recent_period(time.happened_this_month);
	}
	,findAllPerWeek: function() {
		return find_for_recent_period(time.happened_this_week);
	}
	,findAllPerDay: function() {
		return find_for_recent_period(time.happened_today);
	}
}