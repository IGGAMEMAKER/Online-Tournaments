var sender = require('./requestSender');
var Answer =  sender.Answer;
var express         = require('express');
var app = express();
var bodyParser = require('body-parser')

var Log = sender.strLog;

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
app.post('/StartTournament', function (req, res) {StartTournament(req.body, res);});


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
var OK = {
	result: 'OK'
}
function Error( err){
	Log('DBServer Error: ' + JSON.stringify(err));
}





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
	gameName: String, gameNameID: Number,
	minPlayersPerGame: Number, maxPlayersPerGame:Number,
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

//addGame('PingPong', 2, {port:5009, maxPlayersPerGame:2} );
function addGame(gameName, gameNameID, options ){
	var minPlayersPerGame = options.minPlayersPerGame?options.minPlayersPerGame:2;
	var maxPlayersPerGame = options.maxPlayersPerGame?options.maxPlayersPerGame:10;
	var frontendServerIP = '127.0.0.1';
	var frontendServerPort = options.port;
	var token = 'tkn';

	var game = new Game({
		gameName:gameName, gameNameID:gameNameID,
		minPlayersPerGame:minPlayersPerGame, maxPlayersPerGame:maxPlayersPerGame, 
		frontendServerIP:frontendServerIP, frontendServerPort: frontendServerPort,
		token: token
	})
	game.save(function (err) {
		if (err){
			switch (err.code){
				case OBJ_EXITS:
					Log('Sorry, game ' + gameName + ' Exists');
					// Answer(res, {result: 'OBJ_EXITS'});
				break;
				default:
					Error(err);
					// Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			// Answer(res, {result: 'OK'});
			Log('added Game'); 
		}
	});
}

function StartTournament(data, res){
	if (data){
		if (data.tournamentID){
			setTournStatus(tournamentID, TOURN_STATUS_RUNNING);
			 Answer(res, OK);
		}
		else{
			Log('no tournamentID, no fun!');
			 Answer(res, Fail);
		}
	}
	else{
		Log('data is null');
		 Answer(res,Fail);
	}
}


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

function RegisterUserInTournament(data, res){
	var tournamentID = data.tournamentID;

	var reg = new TournamentRegs({userID:data.login, tournamentID: tournamentID, promo:'gaginho'});
	reg.save(function (err) {
		if (err){
			switch (err.code){
				case OBJ_EXITS:
					Log('Sorry, User ' + data.login + ' Exists in tournament ' + tournamentID);
					 Answer(res, {result: 'TournamentExists??!!!'});
				break;
				default:
					Error(err);
					 Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			 Answer(res, {result:'OK'} );
			Log('added user to tournament'); 
		}
	});
	incrPlayersCount(tournamentID);
}

function incrPlayersCount(tournamentID){
	Tournament.update({tournamentID:tournamentID}, {$inc: {players:1}} , function (err, count){
		if (err){
			Log('incrPlayersCount');
			Error(err);
			Tournament.update({tournamentID:tournamentID}, {$set: {players:1}} , function (err1, count1){
				if (err1){
					Error(err1);
					Log('Still Error! Cannot set 1.' + JSON.stringify(err1) );
				}
			});
		}
	});
}

function Printer(err, count){
	if (err){ Error(err);
		//Tournament.update
	}
	//Log(func+ ' error: ' + )
}

function GetPlayers (req, res){
	var query = req.body;
	TournamentRegs.find({tournamentID:query.tournamentID},'', function (err, players){
		if (!err){
			 Answer(res, players);
		}
		else{
			 Answer(res, Fail);
		}
	});
}

function ChangePassword(req, res){
	var data = req.body;
	Log("check current auth");
	Log("ChangePass of User " + data['login']);
	res.end(Fail);
}

function RememberPassword(req, res){
	var data = req.body;
	Log("Send mail and reset pass");
	Log("Remember pass of User " + data['login']);
	res.end(Fail);
}

function LoginUser(req, res){
	var data = req.body;
	Log("LoginUser...");
	Log(data);

	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	Log('Try to login :' + login + '. (' + JSON.stringify(data) + ')');

	var usr1 = User.findOne({login:login, password:password}, 'login password' , function (err, user) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	Log('GetUsersError ');
	    	Error(err);
	    	 Answer(res, {result: err});
	    }
	    else{
	    	if (user){
		    	Log(JSON.stringify(user));
			     Answer(res, {result:'OK'});
			    Log('Logged in');
			}
			else{
				Log('Invalid login/password : ' + login);
				 Answer(res, {result:'Invalid reg'});
			}
		}
 	});
	/*var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					Log('Sorry, user ' + login + ' Exists');
					 Answer(res, {result: 'UserExists'});
				break;
				default:
					Log(err);
					 Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			 Answer(res, {result: 'OK'});
			Log('added User'); 
		}
	});*/

}


function GetGameParametersByGameName (gameName){
	Log('GetGameParametersByGameName... HERE MUST BE REAL REQUEST TO DATABASE');
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
			Error(err);
			 Answer(res, errObject);
		}
		else{
			if (tournament){
				Log('RestartTournament: ' + tournamentID);
				//Log(JSON.stringify(tournament));
				 Answer(res, tournament);
			}
			else{
				 Answer(res, {result:'fail', message:'tournament not Exists'+tournamentID } );
			}
		}
	});
}

function GetUsers( req,res){
	var data = req.body;
	var query = {};
	var queryFields = '';//'id buyIn goNext gameNameID';
	
	if (data['query']) {query = data['query'];}
	if (data['queryFields']) {queryFields = data['queryFields']; Log('Got it!');}


	/*Log(query);
	Log(queryFields);*/

	/*Tournament.find(query,queryFields , function (err, tournaments){
		Log(tournaments);
		 Answer(res, tournaments);
	});*/

	var usr1 = User.find(query, 'login money' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	Log('GetUsersError ');
	    	Error(err);
	    	 Answer(res, errObject);
	    }
	    else{
	    	Log(JSON.stringify(users));
		     Answer(res, users);
		}
 	});

	// Answer(res, users);
}

function IncreaseMoney(req,res){
	var data = req.body;
	var login = data['login'];
	var cash = data['cash'];
	incrMoney(res, login, cash);
}
function incrMoney(res, login, cash){
	Log('trying to give ' + cash + ' points to ' + login);
	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			Error(err);
			 Answer(res, Fail);
		}
		else{
			Log('IncreaseMoney----- count= ');
			Log(count);
			Log(login);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err || !user){
					Error(err);
					 Answer(res, Fail);
				}
				else{
					Log(user);
					Log('Money now = '+ user.money);
					 Answer(res, {login: user.login, money: user.money});
				}
			});
		}
	});
}

function setTournStatus(tournamentID, status){
	Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
		if(err) { Log('Tournament status update Error: ' + JSON.stringify(err)); }
	});//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]
}

function WinPrize( req,res){
	var data = req.body;
	/*var userID = data['userID'];
	var incr = data['prize'];
	Log('uID= '+ userID + ' incr=' + incr);*/
	Log(JSON.stringify(data));
	var player = {};
	var winners = data.winners;
	var tournamentID = data.tournamentID;
	for (i=0; i< winners.length;i++){
		player = winners[i];

		Log('WinPrize:')
		Log(player);
		User.update( {login:player.login}, {$inc: { money: player.prize }} , function (err,count) {
			if (err){ Error(err); }
			else{ Log(count);}
		});
	}
	 Answer(res, {result:'WinPrize_OK'});
	setTournStatus(tournamentID, TOURN_STATUS_FINISHED);

	/*for (var player in data){
		incrMoney(res, player.login, player.prize);
		
	}*/

	/*var user = getUserByID(userID);
	Log(user);
	user.money+= incr;
	Log('money now=' + user.money);*/
}

/*function getUserByID(ID){
	return users[getLoginByID(ID)];
}


function getLoginByID(ID){
	return IDToLoginConverter[ID]?IDToLoginConverter[ID]:'defaultLogin';
}*/


function GetUserProfileInfo(req , res){
	var data = req.body;
	Log('Write Checker for sender validity.');
	var login = data['login'];
	Log('-----------USER PROFILE INFO -----ID=' + login + '------');
	//var usr = User.find({}, 'login password money' )
	var profileInfo = {};
	TournamentRegs.find({userID:login}, '', function (err, tournaments){
		if (!err && tournaments) {
			

			User.findOne({login:login}, 'login money', function (err1, user) {    
			    if (err1 || !user) {
			    	Log('ProfileInfoError User findOne');
			    	Error(err1);
			    	 Answer(res, Fail);
			    }
			    else{
			    	Log('GOT TOTAL INFO' + JSON.stringify(user));
			    	profileInfo.tournaments = tournaments;
			    	profileInfo.money = user.money;
			    	Log('Fin: ' + JSON.stringify(profileInfo));
				     Answer(res,  JSON.parse(JSON.stringify(profileInfo)) );
				}
		 	});

			 Answer(res, tournaments);
		}
		else{
			Error(err);
			 Answer(res, Fail);
		}
	})
	/*var usr1 = User.findOne({login:login}, 'login password money', function (err, user) {    
	    if (err || !user) {
	    	Log('ProfileInfoError ');
	    	Log(err);
	    	 Answer(res, errObject);
	    }
	    else{
	    	Log(JSON.stringify(user));
		     Answer(res, {
		    	login:user.login,
		    	password : '****',
		    	money : user.money
		    });
		}
 	});*/
}

function Register (req, res){
	var data = req.body;
	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	Log('adding user :' + login + '. (' + JSON.stringify(data) + ')');
	Log('Check the data WHILE adding USER!!! need to write Checker');
	var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					Log('Sorry, user ' + login + ' Exists');
					 Answer(res, {result: 'UserExists'});
				break;
				default:
					Error(err);
					 Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			 Answer(res, {result: 'OK'});
			Log('added User'); 
		}
	});
	//Log('Adding user ' + login + ' !!!');
		
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
			//Log(JSON.stringify(tournaments));
			 Answer(res, tournaments);
		}
		else{
			Error(err);
			 Answer(res, Fail);
		}
	});
}
function getTournamentsQuery(query, fields){
	Log(JSON.stringify(query));
	Log(JSON.stringify(fields));
	if (query){
		return { 
			query: query,
			fields: fields?fields:''
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
	Log("GetTournaments ");// + data['login']);

	var query = getTournamentsQuery(data['query'], data['queryFields']);
	//var query = ;//{}
	//var queryFields = ;//'id buyIn goNext gameNameID'; //''

	/*if (query && queryFields){
		
	}
	else{
		findTournaments(res, {}, '');
	}*/
	Log(JSON.stringify(query.query));
	Log(JSON.stringify(query.fields));

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
			Log('GetTournaments Error: ' + JSON.stringify(err));
			 Answer(res, errObject);
		}
		else{
			if (tournaments){
				Log('GetTournaments count: ' + tournaments.length);
				//Log(JSON.stringify(tournament));
				 Answer(res, tournaments);
			}
			else{
				 Answer(res, {result:'fail', message:'tournament not Exists'+tournamentID } );
			}
		}
	});
}*/


var COUNT_FIXED = 1;
function AddTournament (req, res){
	var data = req.body;
	var tournament = data;
	Log('Adding tournament ');
	Log('++++++++++++++++++++++++++++');
	Log(JSON.stringify(tournament));
	Log('----------------------------');
	
	
	Tournament.count({}, function (err, cnt){
		tournament.tournamentID = cnt;
		var tourn = new Tournament(tournament);
		if (!err){
			tourn.save(function (err) {
				if (err){
					switch (err.code){
						case OBJ_EXITS:
							Log('Sorry, tournament '  + ' Exists');
							 Answer(res, {result: 'TournamentExists??!!!'});
						break;
						default:
							Error(err);
							 Answer(res, {result: 'UnknownError'});
						break;
					}
				}
				else{
					//showRestraunt(res, name);
					 Answer(res, tournament);
					Log('added Tournament'); 
				}
			});
		}
		else{
			Log('Mario, no addition');
			 Answer(res, {result: 'Fail', message: 'Gaga Genius'});
		}
	});
	

	/*var tournament = data;
	var tournID = ++currentTournamentCounter;
	tournament.tournamentID = tournID;
	tournaments[tournID] = tournament;*/


	// Answer(res, tournament);
}

var server = app.listen(5007, function () {
  var host = server.address().address;
  var port = server.address().port;

  Log(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
