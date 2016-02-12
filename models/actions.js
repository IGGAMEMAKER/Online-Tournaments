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

function find_for_recent_period(time_function){
	return new Promise(function (resolve, reject){
		Actions.find({ date:time_function() }, function (err, actions){
			if (err) return reject(err);

			return resolve(actions||[]);
		})
	})
	/*return new Promise(function (resolve, reject){
			var query = {login: login};
			if (d1 && d2) query.date = time.happened_in_period(d1, d2);

			Actions.find(query, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
	})*/
}

get_leaderboard(time.happened_today);

function get_leaderboard(time_function){
	return new Promise(function (resolve, reject){
		Actions.aggregate([
		{ $match: { date:time_function() } },
		{
			$group: {
				_id: "$login",
				count: { $sum: 1 }
			}
		}
		], function (err, leaderboard){
			if (err) return reject(err);
				console.log(leaderboard);
			return resolve(leaderboard||[]);
		})
	})
}

/*

function get_leaderboard(time_function){
	return new Promise(function (resolve, reject){
		Actions.aggregate([
		{
     $group: {
        _id: "$login",
        count: { $sum: 1 }
     }
   	},
   	{ 
   		$match: { count: { $gt: 1 } } 
   	}])
   	.exec(
			function (err, leaderboard){
				if (err) return reject(err);
				console.log(leaderboard);
				return resolve(leaderboard||[]);
			})
	})
}

*/

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

	,findAllPerMonth: function() {
		return find_for_recent_period(time.happened_this_month);
	}
	,findAllPerWeek: function() {
		return find_for_recent_period(time.happened_this_week);
	}
	,findAllPerDay: function() {
		return find_for_recent_period(time.happened_today);
	}
	
	/*,findAllPerMonth: function(){
		return new Promise(function (resolve, reject){
			Actions.find({ date:time.happened_this_month() }, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
		})
	}
	,findAllPerWeek: function(){
		return new Promise(function (resolve, reject){
			Actions.find({ date:time.happened_this_week() }, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
		})
	}

	,findAllPerDay: function(){
		return new Promise(function (resolve, reject){
			Actions.find({ date:time.happened_today() }, function (err, actions){
				if (err) return reject(err);

				return resolve(actions||[]);
			})
		})
	}*/

}