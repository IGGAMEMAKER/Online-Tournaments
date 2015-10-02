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
sender.setServer(serverName);
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
app.post('/EnableTournament', function (req, res) {EnableTournament(req.body, res);});

app.post('/Login', LoginUser);

app.post('/RegisterUserInTournament', function (req, res) {RegisterUserInTournament(req.body, res);} );
app.post('/GetPlayers', GetPlayers);

app.post('/AddGift', function (req, res) {AddGift(req.body, res);});
app.post('/ShowGifts', function (req, res){ShowGifts(req.body, res);});
//app.post('/')

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

var TournamentReg = mongoose.model('TournamentRegs', {	tournamentID: String, userID: String, promo:String });

var Gift = mongoose.model('Gift', { name: String, photoURL: String, description: String, URL: String, price: Number });

var UserGift = mongoose.model('UserGifts', { userID: String, giftID: String });


var TournamentResult = mongoose.model('TournamentResults', {tournamentID: String, userID: String, place:Number, giftID: String});
//var TournamentResults = mongoose.model('TournamentResults', {tournamentID: String, results: Array});

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
});



//var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609a7da4d4145c718549ab3' });//ObjectId(
//var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609b3a58b659cb7194c78c5' });//ObjectId(

uGift.save(function (err){
	if (err) {Error(err);}
})

function AddGift(data, res){
	if (data){
		gift = new Gift(data);
		gift.save(function (err){
			if (err){
				Error(err);
				Answer(res, Fail);
			}
			else{
				Answer(res, OK);
			}
		})
	}
}

function ShowGifts(data, res){
	if (data){
		Gift.find(data, function (err, gifts){
			if (err){
				Error(err);
				Answer(res, Fail);
			}
			else{
				Answer(res, gifts);
			}
		});
	}
	else{
		Answer(res, Fail);
	}
}

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

function EnableTournament(data, res){
	if (data && data.tournamentID){
		setTournStatus(data.tournamentID, TOURN_STATUS_REGISTER);
		Answer(res,OK);
	}
	else{
		Answer(res, Fail);
	}
}

function StartTournament(data, res){
	Log('DBServer starts tournament');
	if (data){
		if (data.tournamentID){
			setTournStatus(data.tournamentID, TOURN_STATUS_RUNNING);
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




function RegisterUserInTournament(data, res){
	var tournamentID = data.tournamentID;

	var reg = new TournamentReg({userID:data.login, tournamentID: tournamentID, promo:'gaginho'});
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
			 Answer(res, OK );
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
	TournamentReg.find({tournamentID:query.tournamentID},'', function (err, players){
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
			     Answer(res, OK);
			    Log('Logged in');
			}
			else{
				Log('Invalid login/password : ' + login);
				 Answer(res, {result:'Invalid reg'});
			}
		}
 	});
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
	    	//Log(JSON.stringify(users));
		    Answer(res, users);
		}
 	});

	// Answer(res, users);
}

function IncreaseMoney(req,res){
	var data = req.body;
	var login = data.login;
	var cash = data.cash;
	incrMoney(res, login, cash);
}
//function DecreaseMoney()
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
	Log('Set tourn status of ' + tournamentID + ' to ' + status);
	Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
		if(err) { Log('Tournament status update Error: ' + JSON.stringify(err)); }
	});//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]
}

function givePrizeToPlayer(player, Prize){
	Log('WinPrize: ' + JSON.stringify(player));
	if (isNaN(Prize) ){
		//gift
		Log('Prize is gift: ' + JSON.stringify(Prize));
		var userGift = new UserGift( {userID:player.login, giftID: Prize.giftID} );
		userGift.save(function (err){
			if (err){Error(err);}
		});
	}
	else{
		//money
		Log('mmmMoney!! ' + Prize);
		User.update( {login:player.login}, {$inc: { money: Prize }} , function (err,count) {
			if (err){ Error(err); }
			else{ Log(count);}
		});
	}
}

function LoadPrizes(tournamentID, winners){
	Log('LoadPrizes');
	Tournament.findOne( {tournamentID:tournamentID}, 'Prizes goNext', function (err, Prizes){
		if (err){ Error(err); }
		else{
			//var curRound=1;
			Log('Prizes: ' + JSON.stringify(Prizes));
			for (i=0; i< winners.length;i++){// && i <Prizes.Prizes.length
				var player = winners[i];
				givePrizeToPlayer(player, getPrize(Prizes.Prizes, Prizes.goNext,  i+1) );
			}
		}
	});
}

function getPrize(Prizes, goNext, i){
	Log('Rewrite getPrize function. NOW YOU MUST ALL PRIZES FOR EACH PLAYER!!!');
	var roundIndex=1;
	var next = 2;
	if (i>goNext[1]){
		return 0;
	}
	else{
		while(next<goNext.length && goNext[next] >= i){//playerRoundIndex<goNext.length-1 && 
			roundIndex=next;
			next = roundIndex+1;
		}
		return Prizes[roundIndex-1];
	}

	
}

function WinPrize( req,res){
	var data = req.body;

	/*var userID = data['userID'];
	var incr = data['prize'];
	Log('uID= '+ userID + ' incr=' + incr);*/
	Log(JSON.stringify(data));

	var winners = data.winners;
	var tournamentID = data.tournamentID;
	LoadPrizes(tournamentID, winners);

	
	Answer(res, {result:'WinPrize_OK'});
	setTournStatus(tournamentID, TOURN_STATUS_FINISHED);
	setTimeout(KillFinishedTournaments, 1500);
	//Tournament.remove({tournamentID:})
	//updatePromos(tournamentID);
	

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

//KillFinishedTournaments();

function KillFinishedTournaments(){
	Tournament.find({status:TOURN_STATUS_FINISHED}, 'tournamentID', function (err, finishedTournaments){
		Log('finishedTournaments: ' + JSON.stringify(finishedTournaments) );
		/*Tournament.remove({$or:finishedTournaments}, function deletingTournaments (err, tournaments){
			Log('finishedTournaments2: ' + JSON.stringify(tournaments) );
			if (err) {Error(err);}
			else{
				Log(JSON.stringify(tournaments));
			}
		})*/
		var TRegIDs = [];
		for (var i = finishedTournaments.length - 1; i >= 0; i--) {
			TRegIDs.push(finishedTournaments[i].tournamentID);
		};
		

		ClearRegistersInTournament(TRegIDs);
	})
}

function ClearRegistersInTournament(TRegIDs){
	Log('TRegIDs : ');
	Log(JSON.stringify(TRegIDs));

	TournamentReg.remove({tournamentID: {$in : TRegIDs} } , function deletingTournamentRegs (err, tournRegs){
		if (err) {Error(err);}
		else{
			Log('Killed TournamentRegs: ' + JSON.stringify(tournRegs) );
		}
	})
}

function killID(arr, field){
	var list = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		list.push(arr[i][field]);
	};
	Log('killID result: ' + JSON.stringify(list) );
	return list;
}

function GetUserProfileInfo(req , res){
	var data = req.body;
	Log('Write Checker for sender validity.');
	var login = data['login'];
	Log('-----------USER PROFILE INFO -----ID=' + login + '------');
	//var usr = User.find({}, 'login password money' )
	var profileInfo = {};//tournaments:{}, money:0};
	TournamentReg
		.find({userID:login})
		.sort('-tournamentID')
		.exec(function (err, tournaments){
		if (!err && tournaments) {
			profileInfo.tournaments = tournaments;
			User.findOne({login:login}, 'login money', function (err1, user) {    
			    if (err1 || !user) {
			    	Log('ProfileInfoError User findOne');
			    	Error(err1);
			    	Answer(res, Fail);
			    }
			    else{
			    	profileInfo.money = user.money;

			    	UserGift.find({userID:login}, 'giftID', function (err, gifts){
			    		if (err) {
			    			Error(err);
							Answer(res, Fail);
			    		}
			    		else{
			    			profileInfo.gifts = gifts?gifts:{};
			    			/*var TRegIDs = [];
							for (var i = finishedTournaments.length - 1; i >= 0; i--) {
								TRegIDs.push(finishedTournaments[i].tournamentID);
							};*/
							var userGifts = killID(gifts, 'giftID');
							//{tournamentID: {$in : TRegIDs} }
			    			Gift.find( { _id : {$in : userGifts}} , '', function (err, UserGifts){//ObjectId.fromString(
			    				if (err){
			    					Error(err);
			    					Answer(res, Fail);
			    				}
			    				else{
			    					if (!UserGifts){
			    						Log('Found NOTHING');
			    					}
			    					else{
			    						profileInfo.userGifts = UserGifts;
			    					}
			    					Log('Fin: ' + JSON.stringify(profileInfo));
			    					Answer(res,  profileInfo );
			    				}
			    			} )

			    			/*Log('Fin: ' + JSON.stringify(profileInfo));
			    			Answer(res,  profileInfo );*/
			    		}
			    	})
				}
		 	});
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
			 Answer(res, OK);
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
function findTournaments(res, query, queryFields, purpose){
	Tournament.find(query, queryFields , function (err, tournaments){
		if(!err){
			//Log(JSON.stringify(tournaments));
			Answer(res, tournaments);
		}
		else{
			Error(err);
			 Answer(res, Fail);
		}
	}).sort('-tournamentID');
}

const GET_TOURNAMENTS_USER = 1;
const GET_TOURNAMENTS_BALANCE = 2;
const GET_TOURNAMENTS_GAMESERVER = 3;
const GET_TOURNAMENTS_INFO = 4;

function getTournamentsQuery(query, fields, purpose){
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
			fields: fields?fields:''
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
}

function GetTournaments (req, res){
	var data = req.body;
	Log("GetTournaments ");// + data['login']);
	var purpose = data.purpose?data.purpose:null;

	var query = getTournamentsQuery(data.query, data.queryFields, purpose);
	//var query = ;//{}
	//var queryFields = ;//'id buyIn goNext gameNameID'; //''

	/*if (query && queryFields){
		
	}
	else{
		findTournaments(res, {}, '');
	}*/
	if (query.query) Log(JSON.stringify(query.query));
	if (query.fields) Log(JSON.stringify(query.fields));

	findTournaments(res, query.query, query.fields, purpose);
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

function addTournament(maxID, tournament, res){
	tournament.tournamentID = maxID+1;
	var tourn = new Tournament(tournament);
	tourn.save(function (err) {
		if (err){
			Error(err);
			Answer(res, Fail);
		}
		else{
			Answer(res, tournament);
			Log('added Tournament'); 
		}
	});
}

function AddTournament (req, res){
	var data = req.body;
	var tournament = data;
	Log('Adding tournament ');
	Log('++++++++++++++++++++++++++++');
	Log(JSON.stringify(tournament));
	Log('----------------------------');
	
	
	Tournament
		.findOne({})
		.sort('-tournamentID')
		.exec(function searchTournamentWithMaxID (err, maxTournament){
		if (!err){
			if (maxTournament) {
				addTournament(maxTournament.tournamentID, tournament, res);
			}
			else { addTournament(0,tournament, res); }
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
