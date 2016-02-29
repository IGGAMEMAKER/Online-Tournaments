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


				log('add');
				var marath = new Marathon(marathon);
				marath.save(function (err1) {
					log('saving ...');

					if (err1) {
						return reject({err:err1, stage:'marathon.add save err'});
					}
					log('added Marathon ' + JSON.stringify(marathon));
					//enable(tournamentID);
					//sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'site');//, null, null );
					
					return resolve(marathon);
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

function isDate(dateString){
	var date = new Date(dateString);
	var isDateBool = date instanceof Date && !isNaN(date.valueOf());
	console.log(isDateBool);
	return isDateBool;
}

function isArray (data){ 
	// console.log('isArray', data, Array.isArray(data)); 
	return Array.isArray(data); 
}

function toArray(){}

function edit(data, MarathonID){

	// log('edit', data, MarathonID);
	return new Promise(function (resolve, reject){
		if (data==null) return resolve(null);
		// log('edit', data);

		var updObject = {};
		var prizes = data.prizes;
		var counts = data.counts;

		var start = data.startDate;
		var finish = data.finishDate;

		var accelerators = data.accelerators;


		//accelerators

		if (accelerators && isArray(accelerators)) updObject.accelerators=accelerators;
		if (prizes && isArray(prizes)) updObject.prizes=prizes;
		if (counts && isArray(counts)) updObject.counts=counts;

		if (start && isDate(start)) updObject.start= start;
		if (finish && isDate(finish)) updObject.finish= finish;
		// console.error('edit', updObject);

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

function addDefault(){
	return add(getDefaultMarathon());
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

				// if (marathon) return resolve(marathon);

				// reject(null);
				return resolve(marathon||null);
			})
	})
}

function get_current_marathon_or_reject(){
	return get_current_marathon()
	.then(function (marathon){
		return new Promise(function (resolve, reject){
			if (marathon) return resolve(marathon);

			return reject(null);
		})
	})
}



function increase_points(login, MarathonID, accelerator){
	log('increase_points', arguments);
	return new Promise(function (resolve, reject){
		MarathonUser.update({ login:login, MarathonID:MarathonID }, 
			{$inc : { points: accelerator, played: 1 } }, 

			function (err, count){
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
	// console.log('search leaderboard', MarathonID);
	var marathonInfo;
	return new Promise(function (resolve, reject){
		MarathonUser.find({MarathonID:MarathonID})
		.sort('-points')
		.exec(function (err, users){
			if (err) return reject(err);
			// console.log('users', users);
			marathonInfo = users||null;
			return resolve(marathonInfo);
		})
	})
	.then(function (result){
		if (result){
			return get_marathon_by_id(MarathonID);
		} else {
			return null;
		}
	})
	.then(function (marathon){
		if (marathon){
			marathonInfo.prizes = marathon.prizes || [];
			marathonInfo.counts = marathon.counts || [];
		}
		
		return marathonInfo;
	})
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
		var new_accelerator = accelerators[accelerator] || null;
		console.log(accelerators, new_accelerator);
		if (!new_accelerator) return null;

		return new Promise(function (resolve, reject){
			var updObject = {
				accelerator: {
					value:new_accelerator.value, 
					index: accelerator, 
					buyDay: 0, 
					buyDate: new Date()
				}
			}
			console.log('marathonUser pre update', login, updObject)
			MarathonUser.update({ login: login , MarathonID:MarathonID }, { $set : updObject }, function (err, count){
				console.log('tried to update', err, count);
				if (err) return reject(err);

				if (helper.updated(count)) {
					return resolve(1);
				} else {
					return resolve(null);
				}
			})
		})

	})
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
				if (!user.accelerator) {
					user.accelerator = {
						value:ACCELERATOR_STANDARD
					};
				}

				log(user.accelerator);
				return resolve(user)
				/*if (user.accelerators.length==0){
					user.accelerator = ACCELERATOR_STANDARD;
					return resolve(user);
				}	else {
					var accelerator = user.accelerators[user.accelerators.length - 1].value;
					log(accelerator);
					user.accelerator = accelerator;

					return resolve(user);
				}*/
			} else {
				return reject(null);
			}

		})
	})
}

// get_accelerator_of('g.iosebashvili', 2);

function try_to_increase_points(login, MarathonID){
	return get_accelerator_of(login, MarathonID)
	.then(function (user){
		if (user){
			console.log('try_to_increase_points of ', user);
			return increase_points(user.login, user.MarathonID, user.accelerator.value||ACCELERATOR_STANDARD);
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

function giveAccelerator(login, acceleratorIndex, errorMessageTag, acceleratorCount){
	var marathonInfo;
	return get_current_marathon_or_reject()
	.then(function (marathon){
		marathonInfo = marathon;

		return set_accelerator(login, marathon.MarathonID, acceleratorIndex);
	})
	.then(function (result){
		console.log('set_accelerator', result);
		if (result){
			accelerators = marathonInfo[acceleratorCount];//.'soldAccelerators'
			accelerators[acceleratorIndex]++;

			var updObject = {};
			updObject[acceleratorCount] = accelerators;
			Marathon.update({MarathonID:marathonInfo.MarathonID}, {$set : updObject }, // .'soldAccelerators'
				function (err, count){
					if (err) { 
						Errors.add(login, errorMessageTag, { fail:1, code: err}); 
					}

					if (!helper.updated(count)) {
						Errors.add(login, errorMessageTag, { fail:1, code: 'cannot update Marathon'});
					}
			})
		}
		return result;
	})
}

module.exports = {
	add:addDefault
	, edit: 									edit
	, get_user: 							getMarathonUser

	, increase_points: 				try_to_increase_points
	, find_or_create_user: 		find_or_create_user
	, get_current_marathon: 	get_current_marathon
	, get_marathon_by_id: 		get_marathon_by_id
	, update_prize_list: 			update_prize_list

	, isFreePlayer: 					isFreePlayer
	, setFreePlayer: 					setFreePlayer
	, get_marathon_accelerators: function(){
		return get_current_marathon()
		.then(function (marathon){
			if (marathon) return marathon.accelerators||null;

			return null;
		})
	}
	, sell_accelerator: function (login, acceleratorIndex){
		return giveAccelerator(login, acceleratorIndex, 'sell_accelerator', 'soldAccelerators')
	}
	/*, sell_accelerator: function (login, MarathonID, acceleratorIndex){
		return set_accelerator(login, MarathonID, acceleratorIndex)
		.then(function (result){
			if (result){
				var accelerators;

				Marathon.findOne({MarathonID:MarathonID}, function (err, marathon){
					accelerators = marathon.soldAccelerators;
					accelerators[acceleratorIndex]++;

					Marathon.update({MarathonID:MarathonID}, {$set : { soldAccelerators : accelerators} }, 
						function (err, count){
							if (err) { 
								Errors.add(login, 'sell_accelerator', { fail:1, code: err}); 
							}

							if (!helper.updated(count)) {
								Errors.add(login, 'sell_accelerator', { fail:1, code: 'cannot update Marathon'});
							}
					})
				})
			}

			return result;
		})
	}*/
	, grant_accelerator: function (login, acceleratorIndex){
		return giveAccelerator(login, acceleratorIndex, 'grant_accelerator', 'freeAccelerators')
		
/*		return get_current_marathon_or_reject()
		.then(function (marathon){
			return set_accelerator(login, MarathonID, acceleratorIndex);
		})
		.then(function (result){
			if (result){
				var accelerators;

				Marathon.findOne({MarathonID:MarathonID}, function (err, marathon){
					
					accelerators = marathon.freeAccelerators;
					accelerators[acceleratorIndex]++;

					Marathon.update({MarathonID:MarathonID}, {$set : { freeAccelerators : accelerators} }, 
						function (err, count){
							if (err) { 
								Errors.add(login, 'grant_accelerator', { fail:1, code: err}); 
							}

							if (!helper.updated(count)) {
								Errors.add(login, 'grant_accelerator', { fail:1, code: 'cannot update Marathon'});
							}
					})
				})
			}

			return result;
		})*/
	}
	, set_accelerator: 				set_accelerator
	, get_accelerator_of: 		get_accelerator_of

	, leaderboard: 						function(){
		return get_current_marathon()
		.then(function (marathon){
			// console.log('get_current_marathon' , marathon);

			if (marathon) return leaderboard(marathon.MarathonID||null);
			return null;
		})
	}
}