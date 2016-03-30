var Promise = require('bluebird');

var configs = require('../configs');

var db = require('../db')
var Tournament2 = db.wrap('Tournament')


var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var c = require('../constants')

// var mongoose = require('mongoose');
// //mongoose.connect('mongodb://localhost/test');
log(configs.db);
// var db = mongoose.createConnection('mongodb://'+configs.db+'/test');

const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

const PROMO_COMISSION = 5;

var REGULARITY_NONE=0;
var REGULARITY_REGULAR=1;
var REGULARITY_STREAM=2;

var models = require('../models')(configs.db);
var Tournament = models.Tournament;

// var Tournament = mongoose.model('Tournament', { 
// 	buyIn: 			Number,
// 	initFund: 		Number,
// 	gameNameID: 	Number,

// 	pricingType: 	Number,

// 	rounds: 		Number,
// 	goNext: 		Array,
// 		places: 		Array,
// 		Prizes: 		Array,
// 		prizePools: 	Array,

// 	comment: 		String,

// 	playersCountStatus: Number,///Fixed or float
// 		startDate: 		Date,
// 		status: 		Number,	
// 		players: 		Number,
// 	tournamentID:		Number,

// 	settings: 			Object,

// 	startedTime: 		Date,
// 	playTime: Date,
// 	finishTime: Date
// 	//tournamentServerID: String
// });

function running(tournamentID){
	return Tournament2.find({tournamentID:tournamentID, status: TOURN_STATUS_RUNNING})
}

function all(){
	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
}

function getByID(tournamentID){
	return Tournament2.search(tournamentID)
	// return new Promise(function(resolve, reject){
	// 	Tournament.findOne({tournamentID:tournamentID}, '', function(err, tournament){
	// 		if (err) return reject(err);

	// 		return resolve(tournament||null);
	// 	})
	// })
}

function findByQuery(query){
	return Tournament2.find(query)
}

function updateByID(tournamentID, updateObj){
	return Tournament2.update({tournamentID:tournamentID}, { $set: updateObj })
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

/*
function isSpecialTournament(tournament){
	return tournament.settings && tournament.settings.special==SPECIALITY_SPECIAL;
}
*/
var REGULARITY_NONE=0;
var REGULARITY_REGULAR=1;
var REGULARITY_STREAM=2;

var SPECIALITY_SPECIAL=1;

function specials(){
	return new Promise(function (resolve, reject){
		Tournament.find({ 'settings.special': SPECIALITY_SPECIAL, status:TOURN_STATUS_REGISTER }
		, function (err, tournaments){
			if (err) return reject(err);

			resolve(tournaments);
		})
	})
}

function stop(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_FINISHED); }
function enable(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_REGISTER); }


function start(tournamentID){	
	return setTournStatus(tournamentID, TOURN_STATUS_RUNNING); 
}

function finish(tournamentID){ 
	return setTournStatus(tournamentID, TOURN_STATUS_FINISHED)
	// stop(tournamentID); 
}

function add(tournament){
	return new Promise(function(resolve, reject){
		Tournament
			.findOne({})
			.sort('-tournamentID')
			.exec(function searchTournamentWithMaxID (err, maxTournament){

			if (err) return reject({err:err, stage:'tournament.add find err'});

			var newID=0;
			if (maxTournament) newID = maxTournament.tournamentID || 0;
			tournament.tournamentID = newID+1;

			var tourn = new Tournament(tournament);
			tourn.save(function (err1) {
				if (err1) return reject({err:err1, stage:'tournament.add save err'});

				log('added Tournament ' + JSON.stringify(tournament));
				enable(tournamentID);
				//sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'site');//, null, null );
				
				return resolve(tournament);
			});

		});
	});
}

function addNewTournament(tournament){
	return new Promise(function (resolve, reject){
		Tournament
			.findOne({})
			.sort('-tournamentID')
			.exec(function searchTournamentWithMaxID (err, maxTournament){

			if (err) return reject({err:err, stage:'tournament.add find err'});

			var newID=0;
			if (maxTournament) newID = maxTournament.tournamentID || 0;
			var tournamentID = newID + 1;
			// tournament.tournamentID = newID+1;
			tournament.tournamentID = tournamentID;

			Tournament2.save(tournament)
			.then(function (result){
				enable(tournamentID)
				return resolve(tournament)
			})
			.catch(function (err){
				return reject({err: err, message: 'cannot add tournament', tournament: tournament })
			})

		});
	});
}

function find(tournamentID){
	return Tournament2.find({ tournamentID: tournamentID })
}

function setTournStatus(tournamentID, status){
	log('Set tourn status of ' + tournamentID + ' to ' + status);
	var updateObj = {
		status:status
	}

	switch(status){
		case TOURN_STATUS_RUNNING:
			updateObj.playTime = new Date();
		break;
		case TOURN_STATUS_FINISHED:
			updateObj.finishTime = new Date();
		break;
		default:
			updateObj.startedTime = new Date();
			// Errors.add('', 'invalid setTournStatus', {err:status});
		break;
	}
	return Tournament2.update({tournamentID: tournamentID}, {$set: updateObj})
	// Tournament.update({tournamentID:tournamentID}, {$set: updateObj}, function (err,count){
	// 	if(err) return Log('Tournament status update Error: ' + JSON.stringify(err));
	// });
}

// function setTournStatus(tournamentID, status){
// 	// log('Set tourn status of ' + tournamentID + ' to ' + status);
// 	// Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
// 	// 	if(err) { log('Tournament status update Error: ' + JSON.stringify(err)); }
// 	// });//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]

	

// }

var COUNT_FIXED = 1;

function get_tournaments_for_user(){
	// log('called');
	return get_tournaments_default();
	//query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
	//return get_tournaments(query, '', null, null);
}

function get_tournaments_balance(){
	var query = {status:null};
	return get_tournaments(query, '', null, null);
}

function get_tournaments_gameserver(){
	var run_or_reg = {$or: [ {status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER} ] };
	var query = { $and : [query, run_or_reg] };
	return get_tournaments(query, '', null, null);
}

function get_tournaments_default(){
	// log('get_tournaments_default');
	var query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
	return get_tournaments(query, 'tournamentID buyIn goNext gameNameID players Prizes', null, null);
}

function get_tournaments_update(){
	// log('get_tournaments_default');
	var run_or_reg = {$or: [ {status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER} ] };
	var query = { $and : [{"settings.hidden": {$ne : true} }, run_or_reg] };

	return get_tournaments(query, '', null, null);
}

/*get_tournaments_for_user()
.then(helper.p_printer)
.catch(helper.catcher)*/

/*function getTournamentsQuery(query, fields, purpose){
	if (query) Log(JSON.stringify(query));
	if (fields) Log(JSON.stringify(fields));

	switch(purpose){
		case GET_TOURNAMENTS_USER:
			query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
		break;
		case GET_TOURNAMENTS_BALANCE:
			query = {status:null};
		break;
		case GET_TOURNAMENTS_GAMESERVER:
			var run_or_reg = {$or: [ {status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER} ] };
			query = { $and : [query, run_or_reg] };
		break;
	}
	if (query){
		return { 
			query: query,
			fields: fields || ''
		};
	}
	else{
		return {
			//query:{}, 
			query: {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] },
			//query: {$or: [{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] },
			fields:''
		};
	}
}*/




//--------------AUXILLARY FUNCTIONS----------
function get_tournaments(query, fields, filters, sort){
	return new Promise(function(resolve, reject){
		// log('tournaments');
		Tournament.find(query, fields, function (err, tournaments){

			// log('Asynced');
			if (err) return reject(err);

			//log(tournaments);
			return resolve(tournaments||null);
		});
	})
}

this.all = get_tournaments_default;
this.get_tournaments_for_user = get_tournaments_for_user;
this.get = get_tournaments_update;

this.getByID = getByID;

this.start = start;
this.stop = stop;
this.enable = enable;
this.add = add;
this.finish = finish;
this.getStreamID = getStreamID;
this.specials = specials;

this.running = running;
this.setStatus = setTournStatus
this.find = find
this.findByQuery = findByQuery

this.updateByID = updateByID
this.addNewTournament = addNewTournament;


// specials()
// .then(console.log)
// .catch(console.error)