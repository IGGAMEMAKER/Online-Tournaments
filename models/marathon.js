var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);


var helper = require('../helpers/helper');
var log = helper.log;

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

function all(){
	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
}

function getByID(tournamentID){
	return new Promise(function(resolve, reject){
		Tournament.findOne({tournamentID:tournamentID}, '', function(err, tournament){
			if (err) return reject(err);

			return resolve(tournament||null);
		})
	})
}

function getStreamID(login){
	return new Promise(function (resolve, reject){
		Tournament.findOne({
			'settings.regularity':REGULARITY_STREAM
			,	'settings.hidden': {$ne: true}
			,	status: {$in : [TOURN_STATUS_REGISTER, TOURN_STATUS_RUNNING] }
			,	buyIn: 0 
		},
		'tournamentID', function (err, tournament){
			if (err) return reject(err);
			if (tournament){
				resolve(tournament.tournamentID);
			} else {
				resolve(null);
			}
		})
	})
}

function start(tournamentID){	setTournStatus(tournamentID, TOURN_STATUS_RUNNING); }

function stop(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_FINISHED); }

function enable(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_REGISTER); }

function finish(tournamentID){ stop(tournamentID); }

function add(marathon){
	log('add')
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
		freeUpgrades: [0, 0],	
	};
}

//add(getDefaultMarathon())

//--------------AUXILLARY FUNCTIONS----------
function get_tournaments(query, fields, filters, sort){
	return new Promise(function(resolve, reject){
		log('tournaments');
		Tournament.find(query, fields, function (err, tournaments){

			log('Asynced');
			if (err) return reject(err);

			//log(tournaments);
			return resolve(tournaments||null);
		});
	})
}

/*this.all = get_tournaments_default;
this.get_tournaments_for_user = get_tournaments_for_user;
this.getByID = getByID;

this.start = start;
this.stop = stop;
this.enable = enable;
this.add = add;
this.finish = finish;
this.getStreamID = getStreamID;*/

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
	//.catch(helper.catcher);
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
	console.log('increase_points', arguments);
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

find_or_create_user('Raja', 1)
.then(function (user){
	log(user);
})
.catch(helper.catcher);


getMarathonUser('Raja', 1)
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
})

module.exports = {
	add:add

	, get_user: getMarathonUser

	, increase_points: increase_points
	, find_or_create_user: find_or_create_user
	, get_current_marathon: get_current_marathon
}