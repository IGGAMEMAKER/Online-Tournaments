var Promise = require('bluebird');

var configs = require('../configs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var MoneyTransfer = mongoose.model('MoneyTransfer', { userID: String, ammount:Number, source: Object, date: Date });

var money_koef = 100;

function getByLogin(login, limit){
	return new Promise(function(resolve, reject){
		MoneyTransfer
			.find({userID: login})
			.sort('-date')
			.limit(limit)
			.exec(function (err, transfers){
				if (err) return reject(err);

				return resolve(transfers||null);
			})
	})
}

function add(login, cash, source){
	return new Promise(function(resolve, reject){
		//, date:new Date()
		if (cash!=0 && cash!=null){
			var transfer = get_new_money_transfer(login, cash*money_koef, source);

			transfer.save(function (err){
				if (err) return reject(err);

				log('MoneyTransfer to: '+ login + ' '+ cash +'$ ('+ cash*money_koef+' points), because of: ' + JSON.stringify(source));
				return resolve(OK);
			});
		}
	});
}

getByLogin('Raja', 5)
.then(helper.p_printer)
.catch(helper.catcher)


//-------------------AUXILLARY FUNCTIONS------------------

function get_new_money_transfer(login, cash, source){
	return new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
}