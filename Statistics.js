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

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stats');

var Tournament = mongoose.model('Tournament', { 
	started: Number,
	finished: Number,
	restarted: Number,
	works: Number,
	ID: String,
	attempts: Number,
	prized: Number,

	TSfinished: Number,

	startDate:Date,
	finishDate:Date
})

var ClientGameStats = mongoose.model('ClientGameStats', {
	ID:String, //tournamentID
	login:String,
	started:Number, //1 - tournament started
	loaded:Number,
	recievedData:Number, // 1 - if user got data from backend (questions in QS, coordinates in PP)
	movements:Number // gt 0 - user increments this when he plays
})

app.post('/GivePrize', function (req, res){
	OK(res);
	Log('GivePrize ' + JSON.stringify(req.body), STREAM_STATS);
	GivePrize(req.body.tournamentID);
})




function updTournament(tournamentID, todo, message){
	Tournament.update( {ID: tournamentID}, todo, stdUpdateHandler(message) );
}

function GivePrize(tournamentID){
	updTournament(tournamentID, {$inc : {prized: 1 }, finishDate:new Date() }, 'GivePrize ');
}

app.post('/StartTournament', function (req, res){ // starts in tournament Server
	StartTournament(req.body.tournamentID, req.body.players , res);
})

app.post('/AttemptToStart', function (req, res){
	AttemptToStart(req.body.tournamentID||0, req.body.login||null);
})


app.post('/RestartTournament', function (req, res){
	OK(res);
	//var 
})

app.post('/UserGetsData' , function (req, res){
	OK(res);

	UserGetsData(req.body.tournamentID, req.body.login);
})

app.post('/GameWorks', function (req, res){ GameWorks(req.body.tournamentID); })

app.post('/ClosedTournament', function (req, res){// Closed by force

})

app.post('/FinishedTournament', function (req, res){ // finished in TS (or, maybe DB)
	OK(res);

	var tournamentID = req.body.tournamentID;
	Log('FinishedTournament ' + tournamentID, STREAM_STATS);
	updTournament(tournamentID, {$inc : {finished:1} }, 'FinishedTournament');
})

function processStats(data){

}

app.post('/GetTournaments', function (req, res){
	Log('/GetTournaments', STREAM_STATS);
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
	var query = {
		startDate: {
			// $gte : ISODate("2015-11-02T00:00:00Z"), 
    		// $lt : ISODate("2014-07-03T00:00:00Z")

    		$gte : new Date(dtToday + c), 
    		$lt : new Date(dtTommorow + c) 
		}
	}

	Tournament.find(query, '', stdFindHandler('GetTournament ', res) ); // , processStats
	//res.json
})

//app.post('/')

function UserGetsData(tournamentID, login){
	ClientGameStats.update({ID:tournamentID, login:login}, {$inc : {recievedData : 1 }}, 
		stdUpdateHandler('UserGetsData ' + tournamentID + ' ' + login));
}

app.post('/GameLoaded', function (req, res){
	OK(res);

	var tournamentID = req.body.tournamentID;
	var login = req.body.login;

	GameLoaded(tournamentID, login);
})

function GameLoaded(tournamentID, login){
	ClientGameStats.update({ID: tournamentID, login:login}, {$inc : {loaded :1} },
		stdUpdateHandler('GameLoaded ' + tournamentID + ' ' + login));
}



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
	if (res) OK(res);

	Tournament.update({ID:tournamentID} , {$inc : {attempts:1} }, function (err, count){
		if (err) { ERROR(err); }
		else{
			if (!updated(count)){
				Log('AttemptToStart Tournament.update failed: ' + JSON.stringify(count), STREAM_STATS );
			}
		}
	})

	ClientGameStats.update({ID:tournamentID, login:login}, {$inc : {started:1} }, 
		stdUpdateHandler('AttemptToStart ClientGameStats.update'));

	/*ClientGameStats.update({ID:tournamentID, login:login}, {$inc : { started:1 } }, function (err, count){
		if (err) { Log(err); }
		else{
			if (!updated(count)){

			}
		}
	})*/
}

function createStatTournament(tournamentID, players){
	var tournament = {started:1, finished:0, works:0, restarted:0, ID:tournamentID, attempts:0, 
		prized:0, startDate: new Date(), finishDate: null};

	var statTournament = new Tournament(tournament);

	statTournament.save(function (err){
		if (err) { ERROR(err); }
		else{
			Log('createStatTournament OK! ' + tournamentID, STREAM_STATS);
		}
	})

	for (var i = players.length - 1; i >= 0; i--) {
		var cliGameStat = new ClientGameStats({ID:tournamentID,
			login:players[i],
			started:0,
			loaded:0,
			recievedData:0,
			movements:0});

		cliGameStat.save(stdSaver('cliGameStat saved!'));
	};
}

// ---- AUXillary functions
function updated(count){
	console.log('Updated : ' + JSON.stringify(count), STREAM_USERS );
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

function stdFindHandler(message, res, dataProcessor){
	return function (err, data){
		if (err) { ERROR(err); }
		else{
			Log(message + 'found : ' + JSON.stringify(data), STREAM_STATS);
			if (dataProcessor) data = dataProcessor(data);
			res.json(data||null);
		}
	}
}


function ERROR(err){
	Log(err, STREAM_ERROR);
}