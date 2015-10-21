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
    console.log(serverName + ': Request! ' + req.url );
    next();
});

app.post('/GetTournaments',GetTournaments);

app.post('/GetUsers', GetUsers);

app.post('/AddTournament', AddTournament);
app.post('/Register', Register);

app.post('/WinPrize', WinPrize);

app.post('/GetUserProfileInfo', GetUserProfileInfo);

app.post('/IncreaseMoney', IncreaseMoney);
app.post('/DecreaseMoney', DecreaseMoney);

//app.post('/RestartTournament', RestartTournament);
app.post('/StartTournament', function (req, res) {StartTournament(req.body, res);});
app.post('/StopTournament',  function (req, res) {StopTournament (req.body, res);});

app.post('/EnableTournament', function (req, res) {EnableTournament(req.body, res);});

app.post('/Login', LoginUser);

app.post('/RegisterUserInTournament', function (req, res) {RegisterUserInTournament(req.body, res);} );
app.post('/CancelRegister', function (req, res) { CancelRegister(req.body, res); })


app.post('/GetPlayers', GetPlayers);

app.post('/AddGift', function (req, res) {AddGift(req.body, res);});
app.post('/ShowGifts', function (req, res){ShowGifts(req.body, res);});
app.post('/GetGift', function (req, res){GetGiftByGiftID(req.body, res);})
app.post('/GetTransfers', GetTransfers);

var Fail = {
	result: 'fail'
};
var OK = {
	result: 'OK'
}
const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

const PROMO_COMISSION = 5;


const GET_TOURNAMENTS_USER = 1;
const GET_TOURNAMENTS_BALANCE = 2;
const GET_TOURNAMENTS_GAMESERVER = 3;
const GET_TOURNAMENTS_INFO = 4;
const GET_TOURNAMENTS_RUNNING = 5;

const ERR_LOG_STREAM = 'Err';


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
var MoneyTransfer = mongoose.model('MoneyTransfer', {userID: String, ammount:Number, source: Object, date: Date});

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

function ERR(err, res){
	Error(err);
	if (res){
		Answer(res, Fail);
	}
}

//var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609a7da4d4145c718549ab3' });//ObjectId(
/*var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609b3a58b659cb7194c78c5' });//ObjectId(

uGift.save(function (err){
	if (err) {Error(err);}
})*/

function AddGift(data, res){
	if (data){
		gift = new Gift(data);
		gift.save(function (err){
			if (err){
				Error(err);
				Answer(res, Fail);
			}
			else{
				strLog('Added gift ' + JSON.stringify(data), 'Gift');
				Answer(res, OK);
			}
		})
	}
}

function GetGiftByGiftID(data, res){
	if (data){
		Gift.findOne({ _id : data.giftID}, function (err, gift){
			if (err){
				Error(err);
				Answer(res, Fail);
			}
			else{
				Answer(res, gift);
			}
		});
	}
	else{
		Answer(res, Fail);
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

function StopTournament(data, res){
	Log('DBServer starts tournament');
	Log('RETURN MONEY TO USERS, WHO TOOK PART IN STOPPED TOURNAMETNT', 'shitCode');
	if (data && data.tournamentID){
		setTournStatus(data.tournamentID, TOURN_STATUS_FINISHED);
		ClearRegistersInTournament([data.tournamentID]);
		Answer(res, OK);
		Log('StopTournament ' + JSON.stringify(data), 'Tournaments');
		Log('StopTournament ' + JSON.stringify(data), 'Manual');
	}
	else{
		Log('StopTournament: no tournamentID, no fun!', 'WARN');

		Answer(res, Fail);
	}
}

function StartTournament(data, res){
	Log('DBServer starts tournament ' + data);
	if (data && data.tournamentID){
		setTournStatus(data.tournamentID, TOURN_STATUS_RUNNING);
		Answer(res, OK);
		Log('StartTournament ' + data.tournamentID, 'Tournaments');
	}
	else{
		Log('StartTournament: no tournamentID, no fun! ' + JSON.stringify(data), 'WARN');
		Log('StartTournament: no tournamentID, no fun! ' + JSON.stringify(data), ERR_LOG_STREAM);
		Answer(res, Fail);
	}
}



function CancelRegister(data, res){
	var login = data.login;
	var tournamentID = data.tournamentID;
	if (login && tournamentID){
		Tournament.findOne({tournamentID:tournamentID}, 'buyIn', 
			function (err, tournament){
				if (err) { ERR(err, res); }
				else{
					clearRegister(data, res, function(p1, p2, p3){
						incrMoney(res, login, tournament.buyIn);
						changePlayersCount(tournamentID, -1);
					}, ERR);
				}
			});
	}
	else{
		Answer(res, Fail);
	}
	/*TournamentReg.remove({userID:login, tournamentID:tournamentID}, function deletingTournamentRegs (err, tournRegs){
		if (err) {Error(err);}
		else{

			Log('Killed TournamentRegs: ' + JSON.stringify(tournRegs) );
		}
	})*/
}

function clearRegister(data, res, successCb, failCb){
	TournamentReg.remove({userID:data.login, tournamentID:data.tournamentID}, function (err, tournRegs){
		if (err){
			failCb(err, res);
		}
		else{
			successCb(tournRegs, data, res);
		}
	})
}

function RegisterUserInTournament(data, res){
	var tournamentID = data.tournamentID;
	var login = data.login;
	var reg = new TournamentReg({userID:login, tournamentID: tournamentID, promo:'gaginho'});

	Tournament.findOne({tournamentID:tournamentID} , 'buyIn status', function getTournamentBuyIn1 (err, tournament){
		if (err){ Error(err); Answer(res, Fail); }
		else{
			if (tournament && tournament.buyIn>=0 && tournament.status==TOURN_STATUS_REGISTER){
				var buyIn = tournament.buyIn;
				User.update({login:login, money: {$not : {$lt: buyIn }} }, {$inc : {money: -buyIn} }, function takeBuyIn (err, count){
					Log('RegisterUserInTournament NEEDS TRANSACTIONS!!!!!!!!!! IF REG IS FAILED, MONEY WILL NOT return!!!', 'WARN');
					if (err) { Error(err); Answer(res, Fail); }
					else{
						Log('Reg status: ' + JSON.stringify(count));
						if (count.n==1){
							reg.save(function (err) {
								if (err){ Error(err); Answer(res, Fail); }
								else{
									Answer(res, OK );
									changePlayersCount(tournamentID , 1);
									Log('added user to tournament'); 
									saveTransfer(login, -buyIn, {tournamentID:tournamentID});
								}
							});
						}
						else{
							Log('User ' + login + ' has not enough money');
							Answer(res, Fail);
						}
					}
				});				
			}
		}
	})
/*
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
			
		}
	});

*/

	
}

function changePlayersCount(tournamentID, mult){
	if (!mult) {mult = 1;}
	Tournament.update({tournamentID:tournamentID}, {$inc: {players:1*mult}} , function (err, count){
		if (err){
			Log('changePlayersCount');
			Error(err);
			/*Tournament.update({tournamentID:tournamentID}, {$set: {players:1}} , function (err1, count1){
				if (err1){
					Error(err1);
					Log('Still Error! Cannot set 1.' + JSON.stringify(err1) );
				}
			});*/
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
	Log('Try to login :' + login + '. (' + JSON.stringify(data) + ')', 'Users');

	var usr1 = User.findOne({login:login, password:password}, 'login password' , function (err, user) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	Log('GetUsersError ');
	    	Error(err);
	    	 Answer(res, {result: err});
	    }
	    else{
	    	if (user){
		    	//Log();
		    	Log('DBSERVER: Logged in ' + JSON.stringify(user), 'Users');
			    Answer(res, OK);
			    
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

/*function RestartTournament(req, res){
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
}*/

function GetUsers( req,res){
	//throw new Error('Catch Me If You Can');
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
	incrMoney(res, login, cash, 'Deposit');
}
function DecreaseMoney(req, res){
	Log('DecreaseMoney!!!!');
	var data = req.body;
	var login = data.login;
	var money = data.money;
	decrMoney(res, login, money, 'Cashout');
}

function decrMoney(res, login, cash, source){
	if (cash<0){ cash*= -1;}

	User.update({login:login, money: {$not : {$lt: cash }} } , {$inc: {money:-cash} }, function (err, count) {
		if (err) { Error(err); Answer(res, Fail); }
		else{
			Log('DecreaseMoney---- count= ' + JSON.stringify(count));
			if (count.ok==1){
				Answer(res, OK);
				Log('DecreaseMoney OK', 'Money');
				saveTransfer(login, -cash, source||null);
			}
			else{
				Answer(res, Fail);
				Log('DecreaseMoney Fail', 'Money');
			}
		}
	})
}

function incrMoney(res, login, cash, source){
	Log('trying to give ' + cash + ' points to ' + login);
	if (cash<0){ cash*= -1;}

	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			Error(err);
			if (res) Answer(res, Fail);
		}
		else{
			Log('IncreaseMoney----- count= ');
			Log(count);
			Log(login);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err || !user){
					Error(err);
					if (res) Answer(res, Fail);
				}
				else{
					Log(user);
					Log('Money now = '+ user.money);
					if (res) Answer(res, {login: user.login, money: user.money});
					saveTransfer(login, cash, source||null);
				}
			});
		}
	});
}

function GetTransfers(req, res){
	var query = req.body.query;
	var purpose = req.body.purpose;
	MoneyTransfer.find({query:query}, function (err, transfers){
		if (err){ Error(err); Answer(res, Fail); return;}
		Answer(res, transfers);
	})
}

function saveTransfer(login, cash, source){
	//, date:new Date()
	if (cash!=0 && cash!=null){
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null  });
		transfer.save(function (err){
			if (err){ Error(err); return;}
			Log('MoneyTransfer to: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
		});
	}
}


function setTournStatus(tournamentID, status){
	Log('Set tourn status of ' + tournamentID + ' to ' + status);
	Tournament.update({tournamentID:tournamentID}, {$set: {status:status}}, function (err,count){
		if(err) { Log('Tournament status update Error: ' + JSON.stringify(err)); }
	});//[{status:null},{status:TOURN_STATUS_RUNNING}, {status:TOURN_STATUS_REGISTER}]
}

function givePrizeToPlayer(player, Prize, tournamentID){
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
			if (err){ Error(err); return; }
			Log(count); saveTransfer(player.login, Prize, {tournamentID:tournamentID});
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
				givePrizeToPlayer(player, getPrize(Prizes.Prizes, Prizes.goNext,  i+1, tournamentID) );
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


function UpdatePromos(tournamentID){
	Tournament.findOne({tournamentID:tournamentID}, 'buyIn', function (err, tournament){
		if (tournament && tournament.buyIn>0){
			var buyIn = parseInt(tournament.buyIn);
			TournamentReg.find({tournamentID:tournamentID, promo: {$exists : true} }, 'promo', function (err, tournRegs){
				if (err){ Error(err);}
				else{
					if (tournRegs.length>0){
						var promoterIDs = {};
						var promoterIDsArray= [];
						for (var i = tournRegs.length - 1; i >= 0; i--) {
							var ID = tournRegs[i].promo;// PROMOTER ID (login)
							if (promoterIDs[ID]){
								promoterIDs[ID]++;
							}
							else{
								promoterIDs[ID]=1;
								promoterIDsArray.push(ID);
							}
						};

						for (var i = promoterIDsArray.length - 1; i >= 0; i--) {
							var promoter = promoterIDsArray[i];//parseInt
							var promoUsersCount = parseInt(promoterIDs[promoter]);
							var payment = buyIn*promoUsersCount*PROMO_COMISSION / 100;
							Log('Promoter '+promoter + ' invited '+ promoUsersCount + ' players and deserves to get ' + payment + ' points (' + payment/100 + '$)')
							incrMoney(null, promoter, payment);
						};

					}
					else{
						Log('No promos! I WILL EARN MORE!!');
					}
				}
			})
		}
	})
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
	setTimeout(KillFinishedTournaments, 5000);
	//Tournament.remove({tournamentID:})
	UpdatePromos(tournamentID);
	

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
}

function Register (req, res){
	var data = req.body;
	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	Log('adding user :' + login + '. (' + JSON.stringify(data) + ')','Users');
	Log('Check the data WHILE adding USER!!! need to write Checker');
	var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					Log('Sorry, user ' + login + ' Exists', 'Users');
					 Answer(res, {result: 'UserExists'});
				break;
				default:
					Error(err);
					 Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			Log('added User ' + login, 'Users'); 
			Answer(res, OK);
		}
	});

}

function findTournaments(res, query, queryFields, purpose){
	Tournament.find(query, queryFields , function (err, tournaments){
		if(!err){
			//Log(JSON.stringify(tournaments));
			
			//Log('purpose : ' + purpose);
			if (purpose == GET_TOURNAMENTS_INFO){
				TournamentReg.find({tournamentID: query.tournamentID},'', function (err, tournRegs){
					if (err){
						Error(err);
						Answer(res, tournaments);
					}
					else{
						Log('Registered: ' + JSON.stringify(tournRegs));
						//tournaments.regs = tournRegs;
						tournaments.push(tournRegs);
						Log('Registered: ' + JSON.stringify(tournaments));
						Answer(res, tournaments);
					}
				})
			}
			else{
				Answer(res, tournaments);
			}
		}
		else{
			Error(err);
			 Answer(res, Fail);
		}
	}).sort('-tournamentID');
}


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
	//Log("GetTournaments ");// + data['login']);
	var purpose = data.purpose?data.purpose:null;

	var query = getTournamentsQuery(data.query, data.queryFields, purpose);
	//var query = ;//{}
	//var queryFields = ;//'id buyIn goNext gameNameID'; //''

	
	//if (query.query) Log(JSON.stringify(query.query));
	//if (query.fields) Log(JSON.stringify(query.fields));

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
			Log('added Tournament ' + JSON.stringify(tournament), 'Manual'); 
		}
	});
}

function AddTournament (req, res){
	var data = req.body;
	var tournament = data;
	Log('Adding tournament ' + JSON.stringify(tournament), 'Manual');	
	
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
