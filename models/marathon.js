var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);


var helper = require('../helpers/helper');
var log = console.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

/*var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
log(configs.db);
var db = mongoose.createConnection('mongodb://'+configs.db+'/test');*/

const ACCELERATOR_STANDARD = 1;
const ACCELERATOR_GROUP = 2;

const FREE_USER = 1;
const FREE_COMISSION = 80;

var Marathon = models.Marathon;
var MarathonUser = models.MarathonUser;

function add(marathon){
	return new Promise(function(resolve, reject){
		Marathon
			.findOne({})
			.sort('-MarathonID')
			.exec(function searchMarathonWithMaxID (err, maxMarathon){
			log('exec');
			if (err) return reject({err:err, stage:'marathon.add find err'});

			var newID=0;
			if (maxMarathon) newID = maxMarathon.MarathonID || 0;
			marathon.MarathonID = newID+1;


			var marath = new Marathon(marathon);
			marath.save(function (err1) {
				if (err1) return reject({err:err1, stage:'marathon.add save err'});

				log('added Marathon ' + JSON.stringify(tournament));
				//enable(tournamentID);
				//sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'site');//, null, null );
				
				return resolve(tournament);
			});

		});
	});
}

function getDefaultMarathon(){
	return	{
		start:  new Date("January 22, 2016 00:00:00"),
		finish: new Date("January 27, 2016 20:00:00"),
		prizes: [100],
		counts: [1], 

		accelerators: [{value: 4, price: 20}, {value: 7, price: 35}], // value, price, sold, given upgade (index) [ {value: 4, price:20, sold:10, free:2, upgrade:0} , {value: 7, price:35, sold:10, free:3, upgrade:1} ]
		upgrades: [{value: 12, price: 20}, {value: 10, price: 35}], // value, price, sold, given // upgade (index) [ {value: 12, price:20, sold:10, free:2} , {value: 10, price:35, sold:10, free:3} ]

		soldAccelerators: [0, 0],
		soldUpgrades: [0, 0],

		freeAccelerators: [0, 0],
		freeUpgrades: [0, 0]
	};
}

//add(getDefaultMarathon())

//--------------AUXILLARY FUNCTIONS----------
/*function get_tournaments(query, fields, filters, sort){
	return new Promise(function(resolve, reject){
		log('tournaments');
		Tournament.find(query, fields, function (err, tournaments){

			log('Asynced');
			if (err) return reject(err);

			//log(tournaments);
			return resolve(tournaments||null);
		});
	})
}*/

function getCurrentMarathonID(MarathonID){
	return new Promise(function (resolve, reject){
		if (MarathonID && !isNaN(MarathonID)){
			return resolve(MarathonID);
		}
		Marathon
			.findOne({})
			.sort('-MarathonID')
			.exec(function searchMarathonWithMaxID (err, lastMarathon){
				if (err) return reject(err);

				if (!lastMarathon) return resolve(0);

				resolve(lastMarathon.MarathonID);
			})
	})
}

function getMarathonUser(login, MarathonID){
	return new Promise(function (resolve, reject){
		MarathonUser.findOne({login:login, MarathonID:MarathonID}, function (err, marathonUser){
			if (err) return reject(err);

			if (marathonUser) { 
				//log(marathonUser);
				return resolve(marathonUser);
			}
			log('no marathonUser');
			resolve(null);
		})
	})
}


function getDefaultMarathonUser(login, MarathonID){
	return {
		login: login,
		MarathonID: MarathonID,
		accelerators: [], // [ {index, buyDay, buyDate} , {index2, buyDay2, buyDate2} ] // индекс 0 (4), 1 (7), день покупки
		points: 0,
		played: 0,
		isFree: 0,
		isSigned: 0
	}
}

function create_marathon_user(login, MarathonID){
	return new Promise(function (resolve, reject){
		var marathonUser = getDefaultMarathonUser(login, MarathonID);

		var newMarathonUser = new MarathonUser(marathonUser);
		newMarathonUser.save(function (err){
			//log('saving... ' + JSON.stringify(marathonUser));
			if (err) { 
				log('err ' + JSON.stringify(err));
				return resolve(null);
			}

			resolve(marathonUser);
		})
	})
}

function find_or_create_user(login, MarathonID){
	log('find_or_create_user');
	return getMarathonUser(login, MarathonID)
	.then(function (user){
		if (user){
			log('found');
			return user;
		} else {
			log('creating');
			return create_marathon_user(login, MarathonID);
		}
	})
}

function get_marathon_by_id(MarathonID){
	return new Promise(function (resolve, reject){
		Marathon.findOne({MarathonID:MarathonID}, function (err, marathon){
			if (err) return reject(err);

			//log('get_marathon_by_id  ' +  marathon||null);
			return resolve(marathon||null);
		})
	})
}

function get_current_marathon(){ // returns current marathon
	return new Promise(function (resolve, reject){
		Marathon
			.findOne({})
			.sort('-MarathonID')
			.exec(function (err, marathon){
				if (err) return reject(err);

				if (marathon) return resolve(marathon);

				reject(null);
			})
	})
}



function increase_points(login, MarathonID, accelerator){
	log('increase_points', arguments);
	return new Promise(function (resolve, reject){
		MarathonUser.update({ login:login, MarathonID:MarathonID }, {$inc : { points: accelerator, played: 1 } }, function (err, count){
			if (err) return reject(err);

			if (helper.updated(count)){
				return resolve(1);
			} else {
				return reject(null);
			}

		})
	})
}

function setFreePlayer(login, MarathonID){
	return new Promise(function (resolve, reject){
		MarathonUser.update({ login:login, MarathonID:MarathonID}, {$set: { isFree: FREE_USER } }, function (err, count){
			if (err) return reject(err);

			if (helper.updated(count)){
				return resolve(1);
			} else {
				return reject(null);
			}

		})
	})
}

function leaderboard(MarathonID){
	MarathonUser.find({MarathonID:MarathonID})
}

function isFreePlayer(login, MarathonID){
	return getMarathonUser(login, MarathonID)
	.then(function (user){
		return isFreeUser(user||null);
	})
}

function isFreeUser(user){
	return (user && user.isFree== FREE_USER);
}

function get_marathon_accelerators (MarathonID){
	return get_marathon_by_id(MarathonID)
	.then(function (marathon){
		accelerators = marathon.accelerators;
		return new Promise(function (resolve, reject){
			if (accelerators) {
				return resolve(accelerators);
			} else {
				return reject(null);
			}

		})
	})
}

function set_accelerator (login, MarathonID, accelerator) { // accelerator: index?
	var usr;
	var accelerators;
	return get_marathon_accelerators(MarathonID)
	.then(function (accelerators){
		// accelerator is index. 0 or 1 (cheap or expensive)
		// MarathonUser.update({login: login, 'accelerators[0].index': { $exists: false } }, )
	})
}

function update_accelerator(login, MarathonID){
	
}

function prizesAndCountsAreValid(prizes, counts){
	return (prizes && counts && Array.isArray(prizes) || Array.isArray(counts));
}

function update_prize_list(MarathonID, prizes, counts){ // two arrays

	return new Promise(function (resolve, reject){
		if (!prizesAndCountsAreValid(prizes, counts)) {
			return reject('Invalid data');
		}

		var updObject = {};

		if (prizes && Array.isArray(prizes)) updObject.prizes=prizes;
		if (counts && Array.isArray(counts)) updObject.counts=counts;


		Marathon.update({MarathonID: MarathonID}, {$set: updObject }, function (err, count){
			if (err) return reject(err);

			if (helper.updated(count)){
				return resolve(1);
			} else {
				return resolve(null);
			}

		})
	})
}

function get_accelerator_of(login, MarathonID){
	return getMarathonUser(login, MarathonID)
	.then(function (user){
		return new Promise(function (resolve, reject){

			if (user){
				if (user.accelerators.length==0){
					user.accelerator = ACCELERATOR_STANDARD;
					return resolve(user);
				}	else {
					var accelerator = user.accelerators[user.accelerators.length - 1].value;
					log(accelerator);
					user.accelerator = accelerator;

					return resolve(user);
				}
			} else {
				return reject(null);
			}

		})
	})
}

function try_to_increase_points(login, MarathonID){
	return get_accelerator_of(login, MarathonID)
	.then(function (user){
		if (user){
			return increase_points(user.login, user.MarathonID, user.accelerator||ACCELERATOR_STANDARD);
		}
		return null;
	})
}


// TESTS

/*find_or_create_user('Raja', 1)
.then(function (user){
	log(user);
})
.catch(helper.catcher);*/

//try_to_increase_points('Raja', 1);

/*get_marathon_by_id(1);

update_prize_list(1, [300], [2])
.then(function (result){
	if (result==1){
		return get_marathon_by_id(1);
	} else {
		return null;
	}
})
.then(function (marathon){
	if (marathon){ 
		log('update_prize_list OK', marathon); 
	} else {
		log('update_prize_list fail');
	}
})
.catch(helper.catcher);*/

/*getMarathonUser('Raja', 1)
.then(function getAccelerator (user){
	return new Promise(function (resolve, reject){

		if (user){
			if (user.accelerators.length==0){
				user.accelerator = ACCELERATOR_STANDARD;
				return resolve(user);
			}	else {
				var accelerator = user.accelerators[user.accelerators.length - 1].value;
				log(accelerator);
				user.accelerator = accelerator;

				return resolve(user);
			}
		} else {
			return reject(null);
		}

	})
})
.then(function (user){
	return increase_points(user.login, user.MarathonID, user.accelerator||1);
})*/

/*setFreePlayer('Raja', 1)
.then(function (result){
	log('setFreePlayer result', result)
	
	// return isFreePlayer('Raja', 1)
});*/

/*return isFreePlayer('Raja', 1)
.then(function (result){
	log('isFreePlayer ', result);
})
.catch(helper.catcher);*/

// exports

module.exports = {
	add:add

	, get_user: 							getMarathonUser

	, increase_points: 				try_to_increase_points
	, find_or_create_user: 		find_or_create_user
	, get_current_marathon: 	get_current_marathon
	, get_marathon_by_id: 		get_marathon_by_id
	, update_prize_list: 			update_prize_list

	, isFreePlayer: 					isFreePlayer
	, setFreePlayer: 					setFreePlayer

	, set_accelerator: 				set_accelerator
	, get_accelerator_of: 		get_accelerator_of
}