var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var time = require('../helpers/time');

var Actions = models.Action;

// Actions model
/*
	login: String,
	date: Date,
	type: String,
	auxillaries: Object
*/

function find_by_login_for_period(login, d1, d2){
	return new Promise(function (resolve, reject){
			var query = {login: login};
			if (d1 && d2) query.date = time.happened_in_period(d1, d2);

			Actions.find(query, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
	})
}

module.exports = {

	add: function(login, type, auxillaries) {
		return new Promise(function (resolve, reject){
			action = new Actions({
				login : login, 
				type  : type, 
				date  : new Date(), 
				auxillaries : auxillaries || null
			});
			action.save(function (err){
				if (err) return reject(err);

				return resolve(action);
			});
		})
	}
	,findByLogin: function(login){
		return find_by_login_for_period(login);
	}

	//findByLoginPerWeek
	//findByLoginPerDay

	/*findAllPerWeek*/
	,findAllPerDay: function(){
		return new Promise(function (resolve, reject){
			Actions.find({ date:time.happened_today() }, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
		})
	}

}