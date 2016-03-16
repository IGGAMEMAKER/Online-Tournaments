var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);

var time = require('../helpers/time');
var TournamentReg = models.TournamentReg;

var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

//var TournamentReg = db.model('TournamentRegs', {	tournamentID: Number, userID: String, promo:String, status:Number, date:Date });

const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

function add(tournamentID, login, promo){
	return new Promise(function (resolve, reject){
		var reg = new TournamentReg({userID:login, tournamentID: parseInt(tournamentID), promo:promo});
		reg.save(function (err) {
			if (err) return reject(err);
			
			log('added ' + login + ' to tournament ' + tournamentID);
			return resolve(true);
		});
	})
}

function remove(tournamentID, login){
	return new Promise(function (resolve, reject){
		TournamentReg.remove({userID:login, tournamentID:tournamentID}, function (err, count){
			if (err) return reject(err);
			
			if (!helper.removed(count)) return resolve(Fail);
			
			log('removed '+login+' from '+tournamentID);
			return resolve(OK);
		});
	});
}

function getParticipants(tournamentID){
	return new Promise(function (resolve, reject){
		TournamentReg.find({tournamentID:tournamentID},'', function (err, players){
			if (err) return reject(err);

			log('players : ');
			log(players);
			return resolve(players||null);
		});
	});
}

function playedCount(login){
	return new Promise(function (resolve, reject){
		TournamentReg
		.find({userID:login, status : TOURN_STATUS_FINISHED })
		.sort('-tournamentID')
		.exec(function (err, tournaments){
			//console.log('TournamentReg');
			if (err) return reject(err);
			//console.log('playedCount', tournaments);
			if (tournaments) return resolve(tournaments.length || 0);

			return resolve(0);
		})
	})
}

function get(login){
	return new Promise(function (resolve, reject){
		TournamentReg
		.find({userID:login, status : { $ne: TOURN_STATUS_FINISHED } })
		.sort('-tournamentID')
		.exec(function (err, tournaments){
			//console.log('TournamentReg');
			if (err) return reject(err);
			// console.log('TournamentReg', tournaments);
			return resolve(tournaments || {});
		})
	});
}


function userRegistered(login, tournamentID){
	return new Promise(function (resolve, reject){
		TournamentReg.findOne({tournamentID:tournamentID, userID:login},'', function (err, reg){
			if (err) return reject(err);
			
			return resolve(!!reg);
		})
	})
}

function leaderboard(){//time_function
	return new Promise(function (resolve, reject){
		TournamentReg.aggregate([
		{ $match: { date:time.happened_this_week(), status :TOURN_STATUS_FINISHED } },
		{
			$group: {
				_id: "$userID",
				count: { $sum: 1 }
			}
		},
		{
			$sort: {count:-1}
		}
		], function (err, leaderboard){
			if (err) return reject(err);
			//	console.log(leaderboard);
			return resolve(leaderboard||[]);
		})
	})
}
// works OK

/*function playedTop(){
	return new Promise(function (resolve, reject){
		TournamentReg.aggregate([
		{ $match: { status : TOURN_STATUS_FINISHED } },
		{
			$group: {
				_id: "$userID",
				count: { $sum: 1 }
			}
		},
		{
			$sort: { count: -1 }
		}
		], function (err, leaderboard){
			if (err) return reject(err);
			//	console.log(leaderboard);
			return resolve(leaderboard||[]);
		})
	})
}*/

// ---

function playedTop(playedMoreThan){
	return new Promise(function (resolve, reject){
		TournamentReg.aggregate([
		{ $match: { status : TOURN_STATUS_FINISHED } },
		{
			$group: {
				_id: "$userID",
				count: { $sum: 1 }
			}
		},
		{ $match: { count: { $gt: playedMoreThan || 1 } } },
		{ $sort: { count: -1 } },
		], function (err, leaderboard){
			if (err) return reject(err);

			return resolve(leaderboard||[]);
		})
	})
}

function regsMost(){

}

/*db.tournamentregs.aggregate( [
   {
     $group: {
        _id: "$userID",
        count: { $sum: 1 }
     }
   },
   { $match: { status : TOURN_STATUS_FINISHED, count: { $gt: 1 } } }
] ).itcount()*/

// playedTop()
// .then(function(data){
// 	console.log(data);
// })


/*function Experiment(tournamentID, login){
	return new Promise(function (resolve, reject){
		TournamentReg.findOne({tournamentID:tournamentID, userID:login},'', function (err, reg){
			if (err) return reject(err);

			return resolve(!!reg);
		})
	})
}*/

//--------------AUXILLARY FUNCTIONS


//----------------TESTS------------------------

/*test_add(363, 'AlvaroFernandez', 'gaginho')
test_add(363, 'RafaMartinez', 'gaginho')
test_remove(363, 'AlvaroFernandez')
test_remove(363, 'RafaMartinez')
//test_registered('AlvaroFernandez', 364)
test_player_regs('AlvaroFernandez')
test_participants(363);*/

function test_player_regs(login){
	getPlayerRegs(login)
	//.then(helper.p_printer)
	.catch(helper.catcher)
}

function test_remove(tournamentID, login){
	remove(tournamentID, login)
	//.then(helper.p_printer)
	.catch(helper.catcher)
}

function test_participants(tournamentID){
	getParticipants(tournamentID)
	.then(function(players){
		log('players: ' + JSON.stringify(players));
	})
	.catch(helper.catcher);
}

function test_registered(login, tournamentID){
	userRegistered(login, tournamentID)
	.then(function(result){

		if (result) {
			log('test_registered OK: '+login+'||'+tournamentID);
		} else {
			log(login + ' is not registered in ' + tournamentID);
		}
		/*return new Promise(function(resolve, reject){
			return resolve('result: '+result);
		})*/
		return 'result: ' + result;
	})
	.then(helper.p_printer)
	.then(function(result){
		log('still writing!');
	})
	.catch(helper.catcher)
}

function test_add(tournamentID, login, promo){
	add(tournamentID, login, promo)
	.then(helper.p_printer)
	.catch(helper.catcher)
}

/*Experiment(363, 'AlvaroFernandez')
.then(function(val){
	log('Experiment: ' + val);
})
.catch(helper.catcher)*/

this.getParticipants = getParticipants;
this.get = get;
this.add = add;
this.remove = remove;
this.userRegistered = userRegistered;
this.playedCount = playedCount;
this.leaderboard = leaderboard;
this.playedTop = playedTop;