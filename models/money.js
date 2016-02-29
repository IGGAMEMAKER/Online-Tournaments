var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);


var helper = require('../helpers/helper');
var log = console.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var Errors = require('./Errors');

var User = models.User;
var MoneyTransfer = models.MoneyTransfer;


/*
function IncreaseMoney(req,res) {

	var data = req.body;
	var login = data.login;
	var cash = data.cash;

	console.log("DBServer :::: increase money", login, cash);

	incrMoney(res, login, cash, {type: SOURCE_TYPE_DEPOSIT});
	console.log("payment info" , data.info);
}

function DecreaseMoney(req, res) {

	console.log('DecreaseMoney!!!!');
	var data = req.body;
	var login = data.login;
	var money = data.money;
	decrMoney(res, login, money, {type: SOURCE_TYPE_CASHOUT});
}

function pay(req, res){
	var data = req.body;
	var login = data.login;
	var money = data.money;
	var type = data.type;
	if (data && login && money && !isNaN(money) && type){
		decrMoney(res, login, money, {type:type})
	} else {
		res.json({result:0});
	}
}

function decrMoney(res, login, cash, source) {

	if (cash<0){ cash*= -1;}

	User.update({login:login, money: {$not : {$lt: cash }} } , {$inc: {money:-cash} }, function (err, count) {
		if (err) { Error(err); Answer(res, Fail); }
		else{
			console.log('DecreaseMoney---- count= ' + JSON.stringify(count));
			if (updated(count)){
				Answer(res, OK);
				console.log('DecreaseMoney OK -- ' + login + ':' + cash, 'Money');
				saveTransfer(login, -cash, source||null);
			} else {
				Answer(res, Fail);
				console.log('DecreaseMoney Fail -- ' + login + ':' + cash, 'Money');
			}
		}
	})

}

function incrMoney(res, login, cash, source) {

	console.log('incrMoney: give ' + cash + ' points to ' + login);
	if (cash<0){ cash*= -1;}

	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			Error(err);
			if (res) Answer(res, Fail);
		}
		else{
			cLog('IncreaseMoney----- count= ' + count + ' ___ ' +login);
			console.log('Analyze COUNT parameter in  incrMoney, stupid dumbass!', STREAM_SHIT);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err){
					Error(err);
					if (res) Answer(res, Fail);
				}
				else{
					if (user){
						console.log(user);
						console.log('Money now = '+ user.money);
						if (res) Answer(res, {login: user.login, money: user.money});
						saveTransfer(login, cash, source||null);
					}
					else{
						console.log('User NOT FOUND IT CANNOT BE SO! ' + login + '  ' + cash, STREAM_WARN);
						if (res) Answer(res, Fail);
					}
				}
			});
		}
	});
}

function GetTransfers(req, res){
	var query = req.body.query;
	var purpose = req.body.purpose;
	MoneyTransfer.find({query:query}, function (err, transfers){
		if (err){ Error(err); Answer(res, Fail); return;}
		Answer(res, transfers);
	})
}

function saveTransfer2(login, cash, source, tag){
	//, date:new Date()
	if (cash!=0 && cash!=null){
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
		transfer.save(function (err){
			console.log('MoneyTransfer Attempt to: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
			
			if (err) { 
				Errors.add(login, 'saveTransfer', { ammount:cash, source:source||null, tag:tag||null, code:err })
				console.log('MoneyTransfer Fail!!!: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
				throw err;
			}
			return true;
		});
	} else {
		throw null;
	}
}
*/

function saveTransfer(login, cash, source, tag){

	return new Promise(function (resolve, reject){
		if (cash!=0 && cash!=null) return reject(null);
		console.log('MoneyTransfer Attempt to: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
		
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
		transfer.save(function (err){
			if (err) { 
				Errors.add(login, 'saveTransfer', { ammount:cash, source:source||null, tag:tag||null, code:err })
				// console.log('MoneyTransfer Fail!!!: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
				return reject(err);
			}
			return resolve(1);
		}
	})

}

module.exports = {
	increase: function(login, ammount, source){

		return saveTransfer(login, ammount, source || null, 'increase')
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
		})
	}
	, decrease: function(login, ammount, source){

		return saveTransfer(login, ammount, source || null, 'decrease')
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
		})
	}
	, pay: function(login, ammount, source){

		return saveTransfer(login, ammount, source || null, 'pay')
		.then(function (result){
			return new Promise(function (resolve, reject){
				User.update({login:login, money: {$not : {$lt: ammount }} } , {$inc: {money:-ammount} }, function (err, count) {
					if (err) return reject(err);

					resolve(helper.updated(count)||null);
				});
			})
		})
		.catch(function (err){
			console.log('pay failed', login, ammount, source);
			return { result:0, err:err };
		})
	}

}