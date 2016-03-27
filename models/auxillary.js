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

var c = require('../constants');

var Actions = require('./actions');// models.Action;
var Errors = require('./errors');//models.Error;
var Stats = require('./statistics');//models.Statistic;

var Message = require('./message');

// AuxillarySpec
// writing logs
// log errors
// useful middlewares isAdmin, isAuthenticated ...
// counting stats
// useful functions : isUpdated, isRemoved


function isAuthenticated(req){ return (req.session && req.session.login); } // || req.user; 
function isNumeric(num) { return !isNaN(num); }

function errorJSON (err, req, res, next){
	res.json({err: err})
}

function sendJSON (req, res){
	res.json({msg: req.data})
}


var io;
module.exports = {
	debug : debug
	,log : log

	,io: function(socket){
		io = socket;
	}

	,isAuthenticated : middlewares.authenticated
	,authenticated : middlewares.authenticated
	,isAdmin : middlewares.isAdmin

	// ,attempt : Stats.attempt
	,clientside: function(login, auxillaries){
		// console.error('clientside', arguments)
		return Actions.add(login, 'clientside', auxillaries)
	}
	,clientsideError: function (login, auxillaries){
		return Errors.add(login, 'clientside', auxillaries)
	}
	,done : function(login, type, auxillaries) {
		return Actions.add(login, type, auxillaries)
	}
	,fail : function(login, type, auxillaries) {
		return Errors.add(login, type, auxillaries)
	}

	,notify : Message.notifications.personal
	
	,alert: function(login, type, data){
		return Message.notifications.personal(login, type, data)
		.then(function (result){
			io.forceTakingNews(login);
			return result;
		})
	}

	,updated: helper.updated
	,removed: helper.removed

	,setData: function(req, next){
		return function (data){
			req.data = data;
			next();
		}
	}
	,save: function (objects, name){
		return function (result){
			objects[name] = result;
			return result;
		}
	}
	,drop: function (err){
		throw err;
	}
	// ,err : function (err, req, res, next){
	// 	res.json({err: err})
	// }
	// ,json : function (req, res){
	// 	res.json({msg: req.data})
	// }
	,err:errorJSON
	,json:sendJSON
	,raw : function (req, res){
		res.end(req.data);
	}
	,std: [sendJSON, errorJSON]
	,getLogin: function (req){
	  if (isAuthenticated(req)){
	    return req.session.login;
	  } else {
	    return 0;
	  }
	}
	,result: function (req, next){
		return function (value){
			req.data = value;
			next();
		}
	}
	,render : function (page){
		return function (req, res){
			res.render(page, { msg: req.data||null });
		}
	}
	// send message and page
	,answer : function (page){
		return function (req, res){
			res.render(page, { msg: req.data||null });
		}
	}
	,error: function (page, message, tag, code){
		return function (err, req, res, next){
			res.render(page, { msg:0, err:message, code:code||null })

			// write errors here
		}
	}
	,catcher : console.error
	,c:c

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