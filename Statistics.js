var core = require('./core');
var serverName = 'Stats';
core.StartServer({host:'localhost', port:5002, serverName:serverName});
var app = core.app;
var sendRequest = core.sendRequest;
var Log = core.Log;
var OK = core.OK;
var Fail = core.Fail;
var str = core.str;

var handler = require('./errHandler')(app, Log, serverName);
var Promise = require('bluebird');


const STREAM_ERROR = 'Err';
const STREAM_TOURNAMENTS = 'Tournaments';
const STREAM_USERS = 'Users';
const STREAM_SHIT = 'shitCode';
const STREAM_WARN = 'WARN';
const STREAM_STATS = 'stats';

var configs = require('./configs');

var mongoose = require('mongoose');
var stat_server_address = configs.stats || 'localhost';
mongoose.connect('mongodb://'+stat_server_address+'/stats');

var Tournament = mongoose.model('Tournament', { 
	started: Number,
	finished: Number,
	restarted: Number,
	works: Number,
	ID: String,
	attempts: Number,
	prized: Number,
	loaded: Number,

	TSfinished: Number,

	startDate:Date,
	finishDate:Date
});

var ClientGameStats = mongoose.model('ClientGameStats', {
	ID:String, //tournamentID
	login:String,
	started:Number, //1 - tournament started
	loaded:Number,
	recievedData:Number, // 1 - if user got data from backend (questions in QS, coordinates in PP)
	movements:Number // gt 0 - user increments this when he plays
});

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
});

function getDefaultDailyStats(date){
	return new DailyStats({
		mail:0,
		mailFail:0,

		register:0,
		registerOK:0,
		registerFail:0,

		resetPassword:0,
		resetPasswordOK:0,
		resetPasswordFail:0,

		date:date|| getToday()
	});
}


app.post('/GivePrize', function (req, res){
	OK(res);
	Log('GivePrize ' + JSON.stringify(req.body), STREAM_STATS);
	GivePrize(req.body.tournamentID);
});


app.post('/Mail', function (req, res){
	OK(res);
	console.log('Mail');
	//Log('Mail', )
	//var mail = new Mail({})
	updateDaily({$inc: {mail:1} }, 'Mail');
});

app.post('/MailFail', function (req, res){
	OK(res);
	console.log('MailFail');
	//var mail = new Mail({})
	updateDaily({$inc: {mailFail:1} }, 'Mail');
});


//CreateDaily();

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
	};
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
		else {
			if (!data) {
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
});

create_daily_for_month();

function create_daily_for_month(){
	for (var i=0; i<30; i++){
		var d = new Date();
		//console.log(d)
		// Wed Feb 29 2012 11:00:00 GMT+1100 (EST)

		d.setDate(d.getDate() + i);
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
	};
	return today;
}


function updTournament(tournamentID, todo, message){
	Tournament.update( { ID: tournamentID }, todo, stdUpdateHandler(message) );
}

function GivePrize(tournamentID){
	updTournament(tournamentID, {$inc : {prized: 1 }, finishDate:new Date() }, 'GivePrize ');
}

app.post('/Register', function (req, res){
	OK(res);

	updateDaily({$inc: {register:1} }, 'Register');
});

app.post('/RegisterFail', function (req, res){
	OK(res);

	updateDaily( {$inc: {registerFail:1} }, 'RegisterFail');
});

app.post('/ResetPassword', function (req, res){
	OK(res);
	//var result = req.body.result;
	//var login = req.body.login;
	updateDaily({$inc: {resetPassword:1} }, 'ResetPassword');
	/*if (result==1){
		Profile.update({login:login}, {$inc : {resetPasswordAttempt: 1 } }, stdUpdateHandler('ResetPassword ' + req.body.login));
	}*/
});

function updateDaily(todo, message){
	var today = getTodayQuery();
	DailyStats.update({date: today}, todo, stdUpdateHandler(message));
}

app.post('/ResetPasswordFail', function (req, res){
	OK(res);
	//var result = req.body.result;
	//var login = req.body.login;
	updateDaily({$inc : {resetPasswordFail:1}}, 'resetPasswordFail');
	// if (result==1) { Users.update({login:login}, {$inc : {resetPassword: 1 } }, stdUpdateHandler('ResetPassword ' + login)); }
});

app.post('/StartTournament', function (req, res){ // starts in tournament Server
	StartTournament(req.body.tournamentID, req.body.players , res);
});

app.post('/AttemptToStart', function (req, res){
	var tournamentID = req.body.tournamentID || 0;
	var login = req.body.login || null;

	AttemptToStart(tournamentID, login , res);
});


app.post('/RestartTournament', function (req, res){ OK(res); });

app.post('/UserGetsData' , function (req, res){
	OK(res);

	UserGetsData(req.body.tournamentID, req.body.login);
});

app.post('/GameWorks', function (req, res){
	GameWorks(req.body.tournamentID);
});

app.post('/ClosedTournament', function (req, res){// Closed by force

});

app.post('/FinishedTournament', function (req, res){ // finished in TS (or, maybe DB)
	OK(res);

	var tournamentID = req.body.tournamentID;
	Log('FinishedTournament ' + tournamentID, STREAM_STATS);
	updTournament(tournamentID, {$inc : { finished:1 }}, 'FinishedTournament');
});

function processStats(tournaments, dailyStats){
	console.log('dailyStats: ');
	// console.log(dailyStats);
	var obj = {
		/*started:0,
		finished:0,
		prized:0,
		attempts:0,//opening attempts
		openSuccess:0*/

		IDs:[],
		started:[],
		finished:[],
		prized:[],
		attempts:[],
		opened:[],

		register:[],
		registerFail:[],

		mail:[],
		mailFail:[],

		resetPassword:[],
		resetPasswordFail:[]
	};
	for (var i = 0; i <= tournaments.length - 1; i++) {
		var t = tournaments[i];
		console.log('Loaded: ' + t.loaded);
		//obj.IDs.push[t.ID];

		/*obj.started += t.started||0;
		obj.prized += t.prized||0;
		obj.finished +=t.finished||0;
		obj.attempts += t.attempts||0;*/

		obj.started.push(t.started||0);
		obj.prized.push(t.prized||0);
		obj.finished.push(t.finished||0);
		obj.attempts.push(t.attempts||0);
		obj.opened.push(t.loaded||0);
		obj.IDs.push(t.ID||0);

		//obj.openSuccess += 
	}
	console.log(dailyStats.mail);
	obj.register.push(dailyStats.register||0);
	obj.registerFail.push(dailyStats.registerFail||0);
	obj.mail.push(dailyStats.mail||0);
	obj.mailFail.push(dailyStats.mailFail||0);
	obj.resetPassword.push(dailyStats.resetPassword||0);
	obj.resetPasswordFail.push(dailyStats.resetPasswordFail||0);

	return obj;
}

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
	if (month<=9)	month2 = '0' + month;

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
	};
	console.log('getTodayQuery',dtToday, dtTommorow, today);

	return today;
	//}
}

app.get('/', function (req, res){
	// Log('/GetTournaments', STREAM_STATS);

	var query = {
		startDate: getTodayQuery()
	};
	console.log('query', query);

	getTournamentStats(query)
	.then(function (data){
		console.log(data);
		return getDailyStats(data);
	})
	.then(function (data){
		// core.Answer(res, processStats(data.tournaments, data.dailyStats));
		res.json({result:1, code:processStats(data.tournaments, data.dailyStats) })
	})
	.catch(stdCatcher(res));
	// res.end('OK');
});

app.post('/GetTournaments', function (req, res){
	Log('/GetTournaments', STREAM_STATS);

	var query = {
		startDate: getTodayQuery()
	};

	//Tournament.find(query, '', stdFindHandler('GetTournament ', res, processStats) ); // , processStats
	getTournamentStats(query)
	.then(getDailyStats)
	.then(function (data){
		core.Answer(res, processStats(data.tournaments, data.dailyStats));
	})
	.catch(stdCatcher(res));


	//res.json
});

function stdCatcher(res){
	return function (err){
		// console.log(err);
		// Fail(res);
		res.json({code:err});
	}
}

function getTournamentStats(query){
	return new Promise(function (resolve, reject){
		Tournament.find(query, '', function (err, data){
			console.log('getTournamentStats');
			if (err) { ERROR(err); reject(err); }
			else{
				var stats = { tournaments: data||null };
				// console.log(stats);
				resolve(stats);
			}
		})
	})
}

function getDailyStats(stats){
	return new Promise(function (resolve, reject){
		var today = getTodayQuery();
		DailyStats.findOne({date:today}, '', function (err, dailyStats){
			if (err) { reject(err); }
			else{
				stats.dailyStats = dailyStats||null;
				resolve(stats);
			}
		})
	})
}

//app.post('/')

function UserGetsData(tournamentID, login){
	ClientGameStats.update({ID:tournamentID, login:login}, {$inc : {recievedData : 1 }}, 
		stdUpdateHandler('UserGetsData ' + tournamentID + ' ' + login));
}

app.post('/GameLoaded', function (req, res){
	console.log('/GameLoaded');
	OK(res);

	var tournamentID = req.body.tournamentID;
	var login = req.body.login;

	GameLoaded(tournamentID, login);
});

function GameLoaded(tournamentID, login){
	// console.log('GameLoaded : ', tournamentID, login);
	
	ClientGameStats.update({ID: tournamentID, login:login}, {$inc : {loaded :1} },
		stdUpdateHandler('GameLoaded ' + tournamentID + ' ' + login));

	updTournament(tournamentID, {$inc : {loaded :1} }, 'GameLoaded');
}

function update_tournament_stats(find, set, updateMessage){
	ClientGameStats.update(find, set, stdUpdateHandler(updateMessage))
}

app.get('/ClientGameStats', function (req, res){
	ClientGameStats.find({})
	.sort('-tournamentID')
	.exec(function (err, stats){
		if (err) return res.json({err:err});

		// res.render('')
		res.json(stats||null);
	});
	/*.catch(function (err){
		res.json({err:err});
	})*/
});

app.post('/mark/game/:name', function (req, res){
	res.end('');
	var name = req.params.name;
	var login = req.body.login;
	var tournamentID = req.body.tournamentID;

	switch(name){
		case 'drawPopup':
			update_tournament_stats({tournamentID:tournamentID});
		break;
	}
	// update_tournament_stats({})
});

function GameWorks(tournamentID){
	Tournament.update({ID:tournamentID}, {$inc: {works:1} }, stdUpdateHandler('GameWorks'));
}

function StartTournament(tournamentID, players, res){
	if (res) OK(res);
	Tournament.findOne({ID:tournamentID}, function (err, tournament){
		if (err) { ERROR(err); }
		else{
			if (!tournament) createStatTournament(tournamentID, players);
		}
	})
}

function AttemptToStart (tournamentID, login, res){
	console.error('function AttemptToStart started');
	if (res) OK(res);

	Tournament.update({ID:tournamentID} , {$inc : {attempts:1} }, function (err, count){
		if (err) { ERROR(err); }
		else{
			if (!updated(count)){
				Log('AttemptToStart Tournament.update failed: ' + JSON.stringify(count), STREAM_STATS );
			}
		}
	});
	console.error('At least tried to update Tournament attempts ', tournamentID, login);

	ClientGameStats.update({ID:tournamentID, login:login}, {$inc : {started:1} }, 
		stdUpdateHandler('AttemptToStart ClientGameStats.update'));
}

function createStatTournament(tournamentID, players){
	var tournament = {started:1, finished:0, works:0, restarted:0, ID:tournamentID, attempts:0, 
		prized:0, loaded:0, startDate: new Date(), finishDate: null};

	var statTournament = new Tournament(tournament);

	statTournament.save(function (err){
		if (err) { ERROR(err); }
		else{
			Log('createStatTournament OK! ' + tournamentID, STREAM_STATS);
		}
	});

	for (var i = players.length - 1; i >= 0; i--) {
		var cliGameStat = new ClientGameStats({ID:tournamentID,
			login:players[i],
			started:0,
			loaded:0,
			recievedData:0,
			movements:0});

		cliGameStat.save(stdSaver('cliGameStat saved!'));
	}
}

// ---- AUXillary functions
function updated(count){
	console.log('Updated : ' + JSON.stringify(count), STREAM_STATS );
	return count.n>0;
}

function stdSaver(message){
	return function (err){
		if (err) { ERROR(err); }
		else{
			Log(message, STREAM_STATS);
		}
	}
}

function stdUpdateHandler(message){
	return function (err, count){
		if (err) { ERROR(err); }
		else{
			if (!updated(count)){
				Log(message + ' failed: ' + JSON.stringify(count) , STREAM_STATS);
			}
			else{
				Log(message + ' success! ' , STREAM_STATS);
			}
		}
	}

}

function ERROR(err){
	Log(err, STREAM_ERROR);
}