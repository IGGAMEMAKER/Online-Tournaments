/*

var ClientGameStats = mongoose.model('ClientGameStats', {
	ID:String, //tournamentID
	login:String,
	started:Number, //1 - tournament started
	loaded:Number,
	recievedData:Number, // 1 - if user got data from backend (questions in QS, coordinates in PP)
	movements:Number // gt 0 - user increments this when he plays
})

var DailyStats = mongoose.model('DailyStats', {
	mail:Number,
	mailFail:Number,

	register:Number,
	registerOK:Number,
	registerFail:Number,

	resetPassword:Number,
	resetPasswordOK:Number,
	resetPasswordFail:Number,

	date:Date
})

*/

var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var Statistic = models.Statistic;
var time = require('../helpers/time');
var helper = require('../helpers/helper');

var validator = require('validator');

var security = require('../Modules/DB/security');
const CURRENT_CRYPT_VERSION = 2;

var USER_EXISTS = 11000;
var UNKNOWN_ERROR=500;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var money_koef = 100;

//---------------------------------------------------

// daily
// personal

function now(){ return new Date(); }

function log(){	return console.log; }



function add_personal(tag, login, auxillaries){
	return new Promise(function (resolve, reject){
		auxillaries.login = login || null;

		var stat = new Statistic({tag:tag, auxillaries:auxillaries, Date:now() })
		stat.save(function (err){
			if (err) return reject(err);

			resolve(1);
		})

	})
}

function updatedToday(){

}

function createDaily(tag){
	return new Promise(function (resolve, reject){
		var stat = new Statistic({ tag:tag, date:now(), attempt:0, fail:0 })
		stat.save(function (err){
			if (err) return reject(err);

			resolve(1);
		})
	})
}

function findOrCreateDaily(tag){
	/*if (updatedToday()){
		return 1;
	}*/

	return new Promise(function (resolve, reject){
		Statistic.findOne({ date: time.happened_today() })
		.exec(function (err, statistic){
			if (err) return reject(err);
			// if (stat)
			resolve(statistic || null);
		})
	})
	.then(function (data){
		if (!data){
			return createDaily(tag);
		}
		return 1;
	})
}

// 
/*
	function dayQuery(date){
		var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var tmrw 	= new Date(date.getFullYear(), date.getMonth(), date.getDate());
		tmrw.setDate(tmrw.getDate() + 1);

		// console.log(today, tmrw);

		var query = {
			// $gte : ISODate("2015-11-02T00:00:00Z"), 
			// $lt : ISODate("2014-07-03T00:00:00Z")
			$gte : today, 
			$lt : tmrw 
		}
		return query;
	}

	function CreateDaily(date){
		var dailyStats = getDefaultDailyStats();
		if (date) { 
			var dt = new Date(date.getFullYear(), date.getMonth(), date.getDate() );
			dailyStats = getDefaultDailyStats(dt);
		}
		//var today = getTodayQuery();
		var query = dayQuery(date);
		//console.log(today);
		//Log('CreateDaily: ' + str(query), STREAM_STATS );

		//console.error(query);

		DailyStats.findOne({date:query},'', function (err, data){
			if (err) { ERROR(err); }
			else{
				if (!data){
					dailyStats.save(stdSaver('DailyStats saved!!'));
					//DailyStats.update({date:today}, dailyStats, {upsert:true}, stdUpdateHandler('CreateDaily'));
				}
			}
		})	
	}

	app.all('/createDailyStats', function (req, res){
		console.log('createDailyStats');
		//CreateDaily();
		create_daily_for_month();
		res.end('OK');
	})

	create_daily_for_month();

	function create_daily_for_month(){
		for (var i=0; i<30; i++){
			var d = new Date();
			//console.log(d)
			// Wed Feb 29 2012 11:00:00 GMT+1100 (EST)

			d.setDate(d.getDate() + i)
			//console.log(d)
			// Thu Mar 01 2012 11:00:00 GMT+1100 (EST)

			//console.log(d.getDate())

			CreateDaily(d);
		}

	}

	function get_today_query(date){

		var currentDate = new Date();
		if (date) currentDate = date;
	    var day = currentDate.getDate();
	    var month = currentDate.getMonth() + 1;
	    var year = currentDate.getFullYear();

		var next = day+1;
		if (day<=9) day = '0'+day;
		if (next<=9) next = '0'+next;

		var c = "T00:00:00.000Z";
		var dtToday = year+"-"+month+"-"+day;
		var dtTommorow = year+"-" + month+"-"+ next;
		Log('dtToday: ' + dtToday + '  dtTommorow: ' + dtTommorow, STREAM_STATS);
		//var query = {
		var today = {
			// $gte : ISODate("2015-11-02T00:00:00Z"), 
			// $lt : ISODate("2014-07-03T00:00:00Z")
			$gte : new Date(dtToday + c), 
			$lt : new Date(dtTommorow + c) 
		}
		return today;
	}

	// 

	// 

	function getToday(){
		var currentDate = new Date();
	    var day = currentDate.getDate();
	    var month = currentDate.getMonth() + 1;
	    var year = currentDate.getFullYear();

		var next = day+1;
		if (day<=9) day = '0'+day;
		if (next<=9) next = '0'+next;

		var c = "T00:00:00.000Z";
		var dtToday = year+"-"+month+"-"+day;
		var dtTommorow = year+"-" + month+"-"+ next;
		Log('dtToday: ' + dtToday + '  dtTommorow: ' + dtTommorow, STREAM_STATS);
		return dtToday;
	}

	function getTodayQuery(date){
		var currentDate = new Date();
		if (date) currentDate = date;
	    var day = currentDate.getDate();
	    var month = currentDate.getMonth() + 1;
	    var year = currentDate.getFullYear();

		var next = day+1;
		if (day<=9) day = '0'+day;
		if (next<=9) next = '0'+next;

		var monthNext = '1';
		var month2 = month;
		if (month<=9)	month2 = '0'+month

		var c = "T00:00:00.000Z";
		var c2 = "T23:59:59.000Z";

		var dtToday = year+"-"+month2+"-"+day;
		var dtTommorow = year+"-" + monthNext+"-"+ next;

		Log('dtToday: ' + dtToday + '  dtTommorow: ' + dtTommorow, STREAM_STATS);
		//var query = {
		var today = {
			// $gte : ISODate("2015-11-02T00:00:00Z"), 
			// $lt : ISODate("2014-07-03T00:00:00Z")

			$gte : new Date(dtToday + c), 
			$lt : new Date(dtToday + c2) 
		}
		console.log('getTodayQuery',dtToday, dtTommorow, today);
		return today;
		//}
	}
*/

function updateDaily(tag, updateQuery){
	return new Promise(function (resolve, reject){
		Statistic.update({tag:tag, date:time.happened_today() }, updateQuery, function (err, count){
			if (err) return reject(err);

			if (helper.updated(count)) return resolve(1);

			reject(null);
		})
	})
}

var currentDate;

var log = console.log;

function attempt_daily(tag, auxillaries){
	return findOrCreateDaily(tag)
	.then(function (result){
		// log('findOrCreateDaily', result);
		return updateDaily(tag, {$inc: { attempt: 1 } })
	})
}

function fail_daily(tag, auxillaries){
	return findOrCreateDaily(tag)
	.then(function (result){
		// log('findOrCreateDaily', result);
		return updateDaily(tag, {$inc: { fail: 1 } })
	})
}


function get_daily(){
	return Statistic.find({ date : time.happened_today() })
	.exec(function (err, statistics){
		return new Promise(function (resolve, reject){
			if (err) return reject(err);

			resolve(statistics||null);
		})
		/*.then(function (statistics){
			// log('get_daily', statistics)
		})
		.catch(function (err){
			// log('get_daily', err)
		})*/
	})
}

/*attempt_daily('loadGame')
.then(console.log);*/

// get_daily();

module.exports = {
	attempt: attempt_daily
	, fail: fail_daily

	, get: get_daily
}