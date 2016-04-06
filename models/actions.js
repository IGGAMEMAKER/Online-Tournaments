var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var time = require('../helpers/time');

var Actions = models.Action;

var db = require('../db')
var Actions2 = db.wrap('Action')

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

// console.log('get_leaderboard')
// get_leaderboard(time.happened_today)
// .then(console.log)
// .catch(console.error)

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
				// console.log(leaderboard);
			return resolve(leaderboard||[]);
		})
	})
}

function spentMostOnPacks(spent, time_function){
	// var time_function = time.happened_today;
	// date: time_function(),
	var match = { type:'openPack', 'auxillaries.price' : { $gt: spent || 0 } }
	if (time_function) match.date = time_function();

	var fields = { login: "$login" }
	// if (parseInt(date) == 1) {
	// 	match['date'] = time.happened_today();
	// }
	// if (paid == 1) { 
		fields.price =  "$auxillaries.price";
	// }

	var groupBy = {	
		// _id: "$login", 
		_id: fields
		,count: { $sum: 1 } 
	};

	var project = {
		spended: { $sum : "$price" }
	}

	var sort = { count: -1 };
// { $sort: sort }, , { $project : project }
	return Actions2.aggregate([ { $match : match }, { $group : groupBy }, { $sort: sort } ])
	.then(getPaymentsFromList)
}

function openedTotal(time_function){
	var match = { type:'openPack' }
	if (time_function) match.date = time_function();

	var groupBy = {	
		_id: { login: "$login" }
		,count: { $sum: 1 } 
	};

	var sort = { count: -1 };
	return Actions2.aggregate([ { $match : match }, { $group : groupBy }, { $sort: sort } ])
}

function packOpenings(time_function, paid){
	// var time_function = time.happened_today;
	// date: time_function(),
	var match = { type:'openPack' } //, 'auxillaries.price' : { $gt: 0 }

	var fields = { login: "$login" }
	if (time_function) match.date = time_function();

	if (paid == 1) { 
		fields.price =  "$auxillaries.price";
		match['auxillaries.price'] = { $gt: 0 }
	}

	var groupBy = {	
		// _id: "$login", 
		_id: fields,
		count: { $sum: 1 } 
	};
	var sort = { count: -1 };

	return Actions2.aggregate([ { $match : match }, { $group : groupBy }, { $sort: sort }])
	// .then(getPaymentsFromList)
}
var openings = {
	// income: function (time_function){ return spentMostOnPacks(0, time_function) }
	income: function (ammount, time_function){ return spentMostOnPacks(ammount || 0, time_function) }
	,all : function (time_function){ return packOpenings(time_function, 1) }
	,total: openedTotal

	,allPaid : function (time_function){ return packOpenings(time_function, 1) }
	// all: function (paid){ return packOpenings(0, paid) }
	// ,dayPaid: function (paid){ return packOpenings(1, paid) }
	// ,daily: function (){ return packOpenings(1, 0) }
	// ,dailyIncome: function() { return }
}

function getPaymentsFromList(list){
	console.log(list)
	// console.log('---------')
	var logins = {};
	var array = [];

	for (var i = list.length - 1; i >= 0; i--) {
		var item = list[i];
		var login = item._id.login;
		var price = item._id.price;
		var count = item.count;

		var income = count * price;
		// console.log(login, income)

		if (logins[login] == null) {
			var index = array.length;
			logins[login] = index;
			array.push({ login: login, index: index, income: 0 })
		}
		// console.log(array, logins, i);
		// console.log('***********')

		var index = logins[login];
		array[index].income += income;

	};

	return array;
}

// Actions2.list({})
// .then(console.log)
// .catch(console.error)

// spentMostOnPacks()
// .then(console.log)
// .catch(console.error)


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
	,packOpenings: packOpenings
	,openings: openings
	
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