var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);


var helper = require('../helpers/helper');
var time = require('../helpers/time');

var log = console.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var Errors = require('./errors');

var User = models.User;
var MoneyTransfer = models.MoneyTransfer;

var db = require('../db')
var MoneyTransfers = db.wrap('MoneyTransfer')
var MobilePayments = db.wrap('MobilePayment')
var Payments = db.wrap('Payment')


var time = require('../helpers/time');


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

function money_worker (login, ammount, source, find, set, tag, hard) {

	return saveTransfer(login, ammount, source || null, tag)
	.then(function (result){
		console.log('saveTransfer ', result);

		return new Promise(function (resolve, reject){
			User.update(find, set, function (err, count) {
				if (err) return reject(err);

				if (hard && !helper.updated(count)) return reject(null);

				resolve(helper.updated(count)||null);
			});
		})

	})
	.catch(function (err){
		console.log(tag + ' failed', login, ammount, source, err);
		return { result:0, err:err };
	})

}

function money_worker2 (login, ammount, source, find, set, tag, hard) {

	return saveTransfer(login, ammount, source || null, tag)
	.then(function (result){
		console.log('saveTransfer ', result);

		return new Promise(function (resolve, reject){
			User.update(find, set, function (err, count) {
				if (err) return reject(err);

				if (hard && !helper.updated(count)) return reject(null);

				resolve(helper.updated(count)||null);
			});
		})
	})
}

module.exports = {
	increase: function(login, ammount, source){
		return money_worker(login, ammount, source, { login:login }, {$inc: { money: ammount }}, 'increase');
	},
	decrease: function(login, ammount, source){
		return money_worker(login, ammount, source, { login:login }, {$inc: { money: -ammount }}, 'decrease');
	},
	/*, grant: function(login, ammount, source){
		return money_worker(login, ammount, c.SOURCE_TYPE_GRANT, { login:login }, {$inc: { money: ammount }}, 'increase');
	}*/
	pay: function(login, ammount, source){
		return money_worker2(login, ammount, source, {login:login, money: {$not : {$lt: ammount }} }, {$inc: { money: -ammount }}, 'pay', true);
	},
	all: function (){

		return MoneyTransfers.list({})
		// return new Promise(function (resolve, reject){
		// 	MoneyTransfer.find({}, function (err, transfers){
		// 		if (err) return reject(err);

		// 		resolve(transfers);
		// 	})
		// })
	},
	recent: function (){
		return MoneyTransfers.list({ date: time.happened_this_week() })
		// return new Promise(function (resolve, reject){
		// 	MoneyTransfer.find({ date: time.happened_this_week() })
		// })
	},
	savePayment: function (data){
		var obj = {
			message:JSON.stringify(data),
			data: data,
			date: new Date()
		}
		return Payments.save(obj)
	},
	payments: function (){
		return Payments.list()
	},
	mobile: {
		add: function(payID, ammount){
			return MobilePayment.find({payID:payID, ammount:ammount})
			.then(function (payment){
				if (payment) return null;

				return MobilePayment.save({
					payID:payID,
					ammount:ammount,
					date: new Date(),
					active: true
				})
			})
		},
		mark: function (payID, ammount, login){
			return MobilePayment.update({ payID: payID, ammount:ammount, active: true },
			{
				$set : {
					active: false,
					login: login,
					dateActivated: new Date()
				}
			})
		}
	},
	standardPeriod: function(period){
		//0 - daily
		//1 - yesterday
		//2 - monthly

		switch(period){
			case 0:
				return MoneyTransfers.list({ date: time.happened_today() })
			break;
			case 1:
				return MoneyTransfers.list({ date: time.happened_yesterday() })
			break;
			case 2:
				return MoneyTransfers.list({ date: time.happened_this_month() })
			break;
			default:
				// console.log('default')
				return MoneyTransfers.list({ date: time.happened_today() })
			break;
		}
		// if (period==0){
		// }

		// return MoneyTransfers.list({ date: time.happened_this_month() })
	}
	// period: function (timeFunction){
	// 	return MoneyTransfers({date: timeFunction() })
	// }
}