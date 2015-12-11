var Promise = require('bluebird');

var configs = require('../configs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var helper = require('../helpers/helper');
var log = helper.log;

var Fail = { result: 'fail' };
var OK = { result: 'OK' };

const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

const PROMO_COMISSION = 5;

var Tournament = mongoose.model('Tournament', { 
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
	/*var data = req.body;
	var purpose = data.purpose || null;
	var query = getTournamentsQuery(data.query, data.queryFields, purpose);

	findTournaments(res, query.query, query.fields, purpose);*/

	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
}

function get_tournaments_for_user(){
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
	query = {$or: [{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] };
	return get_tournaments(query, '', null, null);
}

get_tournaments_default()
.then(helper.p_printer)
.catch(helper.catcher)

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
		Tournament.find(query, fields, function (err, tournaments){
			if (err) return reject(err);

			return resolve(tournaments||null);
		});
	})
}