var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);


var helper = require('../helpers/helper');
var log = console.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var Errors = require('./errors');

var User = models.User;
var MoneyTransfer = models.MoneyTransfer;

function saveTransfer(login, cash, source, tag){
	console.log('saveTransfer', arguments);
	return new Promise(function (resolve, reject){
		// if (cash!=0 && cash!=null) return reject(null);
		if (cash==0 || cash==null) return reject(null);
		console.log('MoneyTransfer Attempt to: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
		
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
		transfer.save(function (err){
			if (err) { 
				Errors.add(login, 'saveTransfer', { ammount:cash, source:source||null, tag:tag||null, code:err })
				return reject(err);
			}
			return resolve(1);
		})

	})

}

function money_worker (login, ammount, source, find, set, tag) {

	return saveTransfer(login, ammount, source || null, tag)
	.then(function (result){
		console.log('saveTransfer ', result);

		return new Promise(function (resolve, reject){
			User.update(find, set, function (err, count) {
				if (err) return reject(err);

				resolve(helper.updated(count)||null);
			});
		})
	})
	.catch(function (err){
		console.log(tag + ' failed', login, ammount, source, err);
		return { result:0, err:err };
	})

}

module.exports = {
	increase: function(login, ammount, source){
		return money_worker(login, ammount, source, { login:login }, {$inc: { money: ammount }}, 'increase');
		/*return saveTransfer(login, ammount, source || null, 'increase')
		.then(function (result){
			return new Promise(function (resolve, reject){
				User.update({ login:login }, {$inc: { money: ammount }} , function (err, count) {
					if (err) return reject(err);

					resolve(helper.updated(count)||null);
				});
			})
		})
		.catch(function (err){
			console.log('increase failed', login, ammount, source);
			return { result:0, err:err };
		})*/
	}
	, decrease: function(login, ammount, source){
			return money_worker(login, ammount, source, { login:login }, {$inc: { money: -ammount }}, 'decrease');
		
/*		return saveTransfer(login, ammount, source || null, 'decrease')
		.then(function (result){
			return new Promise(function (resolve, reject){
				User.update({ login:login }, {$inc: { money: -ammount }} , function (err, count) {
					if (err) return reject(err);

					resolve(helper.updated(count)||null);
				});
			})
		})
		.catch(function (err){
			console.log('decrease failed', login, ammount, source);
			return { result:0, err:err };
		})*/

	}
	/*, grant: function(login, ammount, source){
		return money_worker(login, ammount, c.SOURCE_TYPE_GRANT, { login:login }, {$inc: { money: ammount }}, 'increase');
	}*/
	, pay: function(login, ammount, source){
			return money_worker(login, ammount, source, {login:login, money: {$not : {$lt: ammount }} }, {$inc: { money: -ammount }}, 'pay');
		/*return saveTransfer(login, ammount, source || null, 'pay')
		.then(function (result){
			return new Promise(function (resolve, reject){
				User.update({login:login, money: {$not : {$lt: ammount }} } , {$inc: {money:-ammount} }, function (err, count) {
					if (err) return reject(err);

					if (helper.updated(count)) return resolve(1);
					
					return reject({ result:0 };);
					//resolve(||null);
				});
			})
		})
		.catch(function (err){
			console.log('pay failed', login, ammount, source);
			return { result:0, err:err };
		})*/
	}

}