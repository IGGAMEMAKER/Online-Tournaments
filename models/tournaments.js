var Promise = require('bluebird');

var configs = require('../configs');



var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
log(configs.db);
var db = mongoose.createConnection('mongodb://'+configs.db+'/test');

const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

const PROMO_COMISSION = 5;

var Tournament = db.model('Tournament', { 
	buyIn: 			Number,
	initFund: 		Number,
	gameNameID: 	Number,

	pricingType: 	Number,

	rounds: 		Number,
	goNext: 		Array,
		places: 		Array,
		Prizes: 		Array,
		prizePools: 	Array,

	comment: 		String,

	playersCountStatus: Number,///Fixed or float
		startDate: 		Date,
		status: 		Number,	
		players: 		Number,
	tournamentID:		Number,

	settings: 			Object, 

	startedTime: 		Date
	//tournamentServerID: String
});


function all(){
	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
}

function start(tournamentID){	setTournStatus(tournamentID, TOURN_STATUS_RUNNING); }

function stop(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_FINISHED); }

function enable(tournamentID){ setTournStatus(tournamentID, TOURN_STATUS_REGISTER); }

function finish(tournamentID){ stop(tournamentID); }

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

function setTournStatus(tournamentID, status){
	log('Set tourn status of ' + tournamentID + ' to ' + status);
	Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
		if(err) { log('Tournament status update Error: ' + JSON.stringify(err)); }
	});//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]
}

var COUNT_FIXED = 1;

function get_tournaments_for_user(){
	log('called');
	return get_tournaments_default();
	//query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
	//return get_tournaments(query, '', null, null);
}

function get_tournaments_balance(){
	query = {status:null};
	return get_tournaments(query, '', null, null);
}

function get_tournaments_gameserver(){
	var run_or_reg = {$or: [ {status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER} ] };
	query = { $and : [query, run_or_reg] };
	return get_tournaments(query, '', null, null);
}

function get_tournaments_default(){
	log('get_tournaments_default');
	query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
	return get_tournaments(query, 'tournamentID buyIn goNext gameNameID players', null, null);
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
		log('tournaments');
		Tournament.find(query, fields, function (err, tournaments){

			log('Asynced');
			if (err) return reject(err);

			//log(tournaments);
			return resolve(tournaments||null);
		});
	})
}

this.get_tournaments_for_user = get_tournaments_for_user;