var sender = require('./requestSender');
var express         = require('express');
var app = express();
var bodyParser = require('body-parser')

var strLog = sender.strLog;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var serverName = "DBServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
app.use(function(req,res,next){
    console.log(serverName + ': Request!');
    next();
});
//var funcArray = {};
app.post('/GetTournaments',GetTournaments);
//funcArray["/TournamentInfo"] = TournamentInfo;

app.post('/GetUsers', GetUsers);

app.post('/AddTournament', AddTournament);
app.post('/Register', Register);

app.post('/WinPrize', WinPrize);

app.post('/GetUserProfileInfo', GetUserProfileInfo);
app.post('/IncreaseMoney', IncreaseMoney);
app.post('/RestartTournament', RestartTournament);


app.post('/Login', LoginUser);
//app.post('/GetTournaments', GetTournaments);

app.post('/RegisterUserInTournament', function (req, res) {RegisterUserInTournament(req.body, res);} );
app.post('/GetPlayers', GetPlayers);

/*funcArray["/Ban"] = Ban;
funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;*/

var Fail = {
	result: 'fail'
};






var currentTournamentCounter=0;
var tournaments = {};
var users= {count:0 };
var IDToLoginConverter = {count:0};
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();

var errObject = {result:'error'};


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = mongoose.model('User', { login: String, password: String, money: Number });

var Game = mongoose.model('Game', { 
	gameName: String, 
	minPlayersPerGame:Number, maxPlayersPerGame:Number,
	frontendServerIP: String, frontendServerPort:Number, 
	token: String
});

var TournamentRegs = mongoose.model('TournamentRegs', {
	tournamentID: String, userID: String, promo:String
});

/*var Server = mongoose.model('Server'{
	host: String, port: Number,
});*/

var OBJ_EXITS = 11000;

/*var game = new Game({
	gameName:'GM_ABSTRACT_SYNC', 
	minPlayersPerGame:2, maxPlayersPerGame:10, 
	frontendServerIP:'127.0.0.1', frontendServerPort: 5008,
	token: 'z,ve'
})
game.save(function (err) {
		if (err){
			switch (err.code){
				case OBJ_EXITS:
					strLog('Sorry, game ' + 'GM_ABSTRACT_SYNC' + ' Exists');
					//sender.Answer(res, {result: 'OBJ_EXITS'});
				break;
				default:
					strLog(err);
					//sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//sender.Answer(res, {result: 'OK'});
			strLog('added Game'); 
		}
	});*/

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
	tournamentID:		Number
	//tournamentServerID: String


	//roundsList: Array
	/*asd: Object
	structure: {
		rounds: 1,
		goNext: [10, 2],
		//winners per whole round
		round1:{
			subRound1:{
				ID:1,
				players: 3,
				games: 3,
				winners: 3
			},
			subRound2:{
				ID:2,
				players: 2,
				games: 2,
				winners: 2
			}
		}
	}*/  
});
/*var tourn = new Tournament({
	buyIn: 			100,
	initFund: 		0,
	gameNameID: 	GM_ABSTRACT_SYNC,

	pricingType: 	PRIC,

	rounds: 		Number,
	goNext: 		Array,
		places: 		Array,
		Prizes: 		Array,
		prizePools: 	Array,

	comment: 		String,
	
	playersCountStatus: Number,///Fixed or float
		startDate: 		Date,
		status: 		Number,	
		players: 		Array
	});*/

function RegisterUserInTournament(data, res){
	var tournamentID = data.tournamentID;

	var reg = new TournamentRegs({userID:data.login, tournamentID: tournamentID, promo:'gaginho'});
	reg.save(function (err) {
		if (err){
			switch (err.code){
				case OBJ_EXITS:
					strLog('Sorry, User ' + data.login + ' Exists in tournament ' + tournamentID);
					sender.Answer(res, {result: 'TournamentExists??!!!'});
				break;
				default:
					strLog(err);
					sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			sender.Answer(res, {result:'OK'} );
			strLog('added user to tournament'); 
		}
	});
	incrPlayersCount(tournamentID);
}
function incrPlayersCount(tournamentID){
	Tournament.update({tournamentID:tournamentID}, {$inc: {players:1}} , function (err, count){
		if (err){
			strLog('incrPlayersCount');
			strLog(JSON.stringify(err));
			Tournament.update({tournamentID:tournamentID}, {$set: {players:1}} , function (err1, count1){
				if (err1){
					strLog('Still Error! Cannot set 1.' + JSON.stringify(err1) );
				}
			});
		}
	});
}

function Printer(err, count){
	if (err){ strLog('error: ' + JSON.stringify(err));
		Tournament.update
	}
	//strLog(func+ ' error: ' + )
}

function GetPlayers (req, res){
	var query = req.body;
	TournamentRegs.find({tournamentID:query.tournamentID},'', function (err, players){
		if (!err){
			sender.Answer(res, players);
		}
		else{
			sender.Answer(res, Fail);
		}
	});
}

function ChangePassword(req, res){
	var data = req.body;
	strLog("check current auth");
	strLog("ChangePass of User " + data['login']);
	res.end(Fail);
}

function RememberPassword(req, res){
	var data = req.body;
	strLog("Send mail and reset pass");
	strLog("Remember pass of User " + data['login']);
	res.end(Fail);
}

function LoginUser(req, res){
	var data = req.body;
	strLog("LoginUser...");
	strLog(data);

	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	strLog('Try to login :' + login + '. (' + JSON.stringify(data) + ')');

	var usr1 = User.findOne({login:login, password:password}, 'login password' , function (err, user) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	strLog('GetUsersError ');
	    	strLog(err);
	    	sender.Answer(res, {result: err});
	    }
	    else{
	    	if (user){
		    	strLog(JSON.stringify(user));
			    sender.Answer(res, {result:'OK'});
			    strLog('Logged in');
			}
			else{
				strLog('Invalid login/password : ' + login);
				sender.Answer(res, {result:'Invalid reg'});
			}
		}
 	});
	/*var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					strLog('Sorry, user ' + login + ' Exists');
					sender.Answer(res, {result: 'UserExists'});
				break;
				default:
					strLog(err);
					sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			sender.Answer(res, {result: 'OK'});
			strLog('added User'); 
		}
	});*/

}


function GetGameParametersByGameName (gameName){
	strLog('GetGameParametersByGameName... HERE MUST BE REAL REQUEST TO DATABASE');
	switch(gameName){
		case GM_ABSTRACT_SYNC:
			return {minPlayersPerGame:2, maxPlayersPerGame:3};
		break;
		default:
			return {minPlayersPerGame:2, maxPlayersPerGame:0};
		break;
	}
}
const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;




function RestartTournament(req, res){
	var data = req.body;
	var tournamentID = data['tournamentID'];
	Tournament.findOne({tournamentID: tournamentID}, '', function (err, tournament){
		if (err){
			strLog('RestartTournament Error: ' + JSON.stringify(err));
			sender.Answer(res, errObject);
		}
		else{
			if (tournament){
				strLog('RestartTournament: ' + tournamentID);
				//strLog(JSON.stringify(tournament));
				sender.Answer(res, tournament);
			}
			else{
				sender.Answer(res, {result:'fail', message:'tournament not Exists'+tournamentID } );
			}
		}
	});
}

function GetUsers( req,res){
	var data = req.body;
	var query = {};
	var queryFields = '';//'id buyIn goNext gameNameID';
	
	if (data['query']) {query = data['query'];}
	if (data['queryFields']) {queryFields = data['queryFields']; strLog('Got it!');}


	/*strLog(query);
	strLog(queryFields);*/

	/*Tournament.find(query,queryFields , function (err, tournaments){
		strLog(tournaments);
		sender.Answer(res, tournaments);
	});*/

	var usr1 = User.find(query, 'login money' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	strLog('GetUsersError ');
	    	strLog(err);
	    	sender.Answer(res, errObject);
	    }
	    else{
	    	strLog(JSON.stringify(users));
		    sender.Answer(res, users);
		}
 	});

	//sender.Answer(res, users);
}

function IncreaseMoney(req,res){
	var data = req.body;
	var login = data['login'];
	var cash = data['cash'];
	incrMoney(res, login, cash);
}
function incrMoney(res, login, cash){
	strLog('trying to give ' + cash + ' points to ' + login);
	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			strLog(err);
			sender.Answer(res, Fail);
		}
		else{
			strLog('IncreaseMoney----- count= ');
			strLog(count);
			strLog(login);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err || !user){
					strLog(err);
					sender.Answer(res, Fail);
				}
				else{
					strLog(user);
					strLog('Money now = '+ user.money);
					sender.Answer(res, {login: user.login, money: user.money});
				}
			});
		}
	});
}

function setTournStatus(tournamentID, status){
	Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
		if(err) { strLog('Tournament status update Error: ' + JSON.stringify(err)); }
	});//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]
}

function WinPrize( req,res){
	var data = req.body;
	/*var userID = data['userID'];
	var incr = data['prize'];
	strLog('uID= '+ userID + ' incr=' + incr);*/
	strLog(JSON.stringify(data));
	var player = {};
	var winners = data.winners;
	var tournamentID = data.tournamentID;
	for (i=0; i< winners.length;i++){
		player = winners[i];

		strLog('WinPrize:')
		strLog(player);
		User.update( {login:player.login}, {$inc: { money: player.prize }} , function (err,count) {
			if (err){ strLog(err); }
			else{ strLog(count);}
		});
	}
	sender.Answer(res, {result:'WinPrize_OK'});
	setTournStatus(tournamentID, TOURN_STATUS_FINISHED);

	/*for (var player in data){
		incrMoney(res, player.login, player.prize);
		
	}*/

	/*var user = getUserByID(userID);
	strLog(user);
	user.money+= incr;
	strLog('money now=' + user.money);*/
}

/*function getUserByID(ID){
	return users[getLoginByID(ID)];
}


function getLoginByID(ID){
	return IDToLoginConverter[ID]?IDToLoginConverter[ID]:'defaultLogin';
}*/
function GetUserProfileInfo(req , res){
	var data = req.body;
	strLog('Write Checker for sender validity');
	var login = data['login'];
	strLog('-----------USER PROFILE INFO -----ID=' + login + '------');
	//var usr = User.find({}, 'login password money' )

	var usr1 = User.findOne({login:login}, 'login password money', function (err, user) {    
	    if (err || !user) {
	    	strLog('ProfileInfoError ');
	    	strLog(err);
	    	sender.Answer(res, errObject);
	    }
	    else{
	    	strLog(JSON.stringify(user));
		    sender.Answer(res, {
		    	login:user.login,
		    	password : '****',
		    	money : user.money
		    });
		}
 	});
}

function Register (req, res){
	var data = req.body;
	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	strLog('adding user :' + login + '. (' + JSON.stringify(data) + ')');
	strLog('Check the data WHILE adding USER!!! need to write Checker');
	var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					strLog('Sorry, user ' + login + ' Exists');
					sender.Answer(res, {result: 'UserExists'});
				break;
				default:
					strLog(err);
					sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			sender.Answer(res, {result: 'OK'});
			strLog('added User'); 
		}
	});
	//strLog('Adding user ' + login + ' !!!');
		
		/*users[login] = data;
		users[login].userID = ++users.count;
		users[login].money = 100;
		IDToLoginConverter[users[login].userID]= login;*/

}
/*function GetUserProfileInfoHandler ( error, response, body, res){
	
}*/
function findTournaments(res, query, queryFields){
	Tournament.find(query, queryFields , function (err, tournaments){
		if(!err){
			//strLog(tournaments);
			sender.Answer(res, tournaments);
		}
		else{
			strLog(err);
			sender.Answer(res, Fail);
		}
	});
}
function getTournamentsQuery(query, fields){
	if (query && fields){
		return { 
			query: query,
			fields: fields
		};
	}
	else{
		return {
			//query:{}, 
			query: {$or: [{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] },
			fields:''
		};
	}
}

function GetTournaments (req, res){
	var data = req.body;
	strLog("GetTournaments ");// + data['login']);

	var query = getTournamentsQuery(data['query'], data['queryFields']);
	//var query = ;//{}
	//var queryFields = ;//'id buyIn goNext gameNameID'; //''

	/*if (query && queryFields){
		
	}
	else{
		findTournaments(res, {}, '');
	}*/
	strLog(query.query);
	strLog(query.fields);

	findTournaments(res, query.query, query.fields);
}
/*query = [{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}];
{$or: query }

//query = ;
{$or: [{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}] }*/


/*function GetTournaments(req, res){
 
	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
	
	var query = req.body.status;
	if (!query || query) { query = [{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]; }
	Tournament.find({$or: query }, '', function (err, tournaments){
	//Tournament.findOne({status: { $not: { status: query } } }, '', function (err, tournaments){
		if (err){
			strLog('GetTournaments Error: ' + JSON.stringify(err));
			sender.Answer(res, errObject);
		}
		else{
			if (tournaments){
				strLog('GetTournaments count: ' + tournaments.length);
				//strLog(JSON.stringify(tournament));
				sender.Answer(res, tournaments);
			}
			else{
				sender.Answer(res, {result:'fail', message:'tournament not Exists'+tournamentID } );
			}
		}
	});
}*/


var COUNT_FIXED = 1;
function AddTournament (req, res){
	var data = req.body;
	var tournament = data;
	strLog('Adding tournament ');
	strLog('++++++++++++++++++++++++++++');
	strLog(JSON.stringify(tournament));
	strLog('----------------------------');
	
	
	Tournament.count({}, function (err, cnt){
		tournament.tournamentID = cnt;
		var tourn = new Tournament(tournament);
		if (!err){
			tourn.save(function (err) {
				if (err){
					switch (err.code){
						case OBJ_EXITS:
							strLog('Sorry, tournament '  + ' Exists');
							sender.Answer(res, {result: 'TournamentExists??!!!'});
						break;
						default:
							strLog(err);
							sender.Answer(res, {result: 'UnknownError'});
						break;
					}
				}
				else{
					//showRestraunt(res, name);
					sender.Answer(res, tournament);
					strLog('added Tournament'); 
				}
			});
		}
		else{
			strLog('Mario, no addition');
			sender.Answer(res, {result: 'Fail', message: 'Gaga Genius'});
		}
	});
	

	/*var tournament = data;
	var tournID = ++currentTournamentCounter;
	tournament.tournamentID = tournID;
	tournaments[tournID] = tournament;*/


	//sender.Answer(res, tournament);
}

var server = app.listen(5007, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
