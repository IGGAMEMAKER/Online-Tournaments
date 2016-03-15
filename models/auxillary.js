var Promise = require('bluebird');

var configs = require('../configs');
var helper = require('../helpers/helper');
var middlewares = require('../middlewares');

var log = helper.log;
var debug = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

// var mongoose = require('mongoose');
// //mongoose.connect('mongodb://localhost/test');
log(configs.db);

var models = require('../models')(configs.db);
// var Tournament = models.Tournament;

// 

var mailsender = require('../helpers/mailchimp');

// 

var Actions = models.Action;
var Errors = models.Error;
var Stats = models.Statistic;

// AuxillarySpec
// writing logs
// log errors
// useful middlewares isAdmin, isAuthenticated ...
// counting stats
// useful functions : isUpdated, isRemoved


module.exports = {
	debug : debug
	,log : log

	,isAuthenticated : middlewares.authenticated
	,isAdmin : middlewares.isAdmin

	// ,attempt : Stats.attempt
	,done : Actions.add
	,fail : Errors.add

	,updated: helper.updated
	,removed: helper.removed

	,json : function(req, res){
		res.json({msg: req.data})
	}
	,err : function(err, req, res, next){
		res.json({err: err})
	}

	// send message and page
	,answer : function(page){
		return function (req, res){
			res.render(page, {msg: req.data});
		}
	}
	,error: function (page, message, tag, code){
		return function (err, req, res, next){
			res.render(page, { msg:0, err:message, code:code||null })

			// write errors here
		}
	}


	// mail
	,mailLists: function(){
		return mailsender.list()
	}
	,mailUsers: function(){
		return mailsender.users()
	}
	,delivery: function(list, letters){
		for (var i = list.length - 1; i >= 0; i--) {
			var email = list[i];
			var letter = letters[i];
			mailsender.send(email, letter);
		};
	}

}