var sender = require('./requestSender');
var fs = require('fs');

var Answer =  sender.Answer;
var express         = require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');

var validator = require('validator');

var security = require('./Modules/DB/security');

var Log = sender.strLog;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var serverName = "DBServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE
sender.setServer(serverName);
app.use(function(req,res,next){
    //console.log(serverName + ': Request! ' + req.url );
    next();
});

var configs = require('./configs');
console.log(configs);


var mailer = require('./sendMail');

var domainName = configs.gameHost;//domainName
var mailAuth = { user: configs.mailUser, pass: configs.mailPass }

//console.error(mailAuth);

mailer.set(mailAuth, Log);

var handler = require('./errHandler')(app, Log, serverName);

var Stats = sender.Stats;

/*app.use(function(err, req, res, next){
  console.error('ERROR STARTS!!');
  //console.error(err.stack);
  //console.error('-------------');
  Log('Error happened in ' + serverName + ' : ' + err, 'Err');
  Log('Description ' + serverName + ' : ' + err.stack, 'Err');
  console.error(err);
  console.error('CATCHED ERROR!!!! IN: ' + req.url);
  res.status(500).send('Something broke!');
  next(err);
});*/

app.post('/GetTournaments',GetTournaments);

app.post('/GetUsers', GetUsers);

app.post('/AddTournament', AddTournament);


app.post('/Register', Register);

//app.post('/WinPrize', WinPrize);
app.post('/FinishGame', FinishGame);

app.post('/GetUserProfileInfo', GetUserProfileInfo);

app.post('/IncreaseMoney', IncreaseMoney);
app.post('/DecreaseMoney', DecreaseMoney);

//app.post('/StartTournament', function (req, res) {StartTournament(req.body.tournamentID, null, res);});
app.post('/RestartTournament', function (req, res) {StartTournament(req.body.tournamentID, true, res);});

app.post('/StopTournament',  function (req, res) {StopTournament (req.body, res);});

app.post('/EnableTournament', function (req, res) {EnableTournament(req.body, res);});

app.post('/Login', LoginUser);

app.post('/RegisterUserInTournament', function (req, res) {RegisterUserInTournament(req.body, res);} );
app.post('/CancelRegister', function (req, res) { CancelRegister(req.body, res); })

app.post('/Changepassword', Changepassword);
app.post('/ResetPassword', ResetPassword);

//app.post('/BanUser', BanUser);

app.post('/GetPlayers', GetPlayers);

app.post('/AddGift', function (req, res) {AddGift(req.body, res);});
app.post('/ShowGifts', function (req, res){ShowGifts(req.body, res);});
app.post('/GetGift', function (req, res){GetGiftByGiftID(req.body, res);})

app.post('/GetTransfers', GetTransfers);

app.post('/MoneyTransfers', MoneyTransfers);

app.post('/Mail', function (req, res){
	Stats('Mail', {});
	mailer.sendStd('23i03g@mail.ru', 'API Mail test', 'TEXT TEXT','TXT2', res);
	/*setTimeout(function(){

	}, 200);*/
})

app.post('/GetTournamentAddress' , GetTournamentAddress);

//var statistics = require('./Modules/DB/stats')(app, AsyncRender, Answer, sender, Log, proxy);

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

const STREAM_ERROR = 'Err';
const STREAM_TOURNAMENTS = 'Tournaments';
const STREAM_USERS = 'Users';
const STREAM_SHIT = 'shitCode';
const STREAM_WARN = 'WARN';
const STREAM_STATS = 'stats';

const CURRENT_CRYPT_VERSION = 0;

function Error(err, message, additionalStream){
	var txt='DBServer Error: ';
	if (message){
		txt += message + ' ';
	}
	if (err){
		txt += JSON.stringify(err) + ' ';
	}
	Log(txt, STREAM_ERROR);
	if (additionalStream) Log(txt, STREAM_ERROR);

	console.error(txt);
}


var currentTournamentCounter=0;
var tournaments = {};

var users= {count:0 };
var IDToLoginConverter = {count:0};

var errObject = {result:'error'};


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = mongoose.model('User', { login: String, password: String, money: Number, 
	email: String, activated:String, date: Date, link: String, bonus:Object, 
	salt:String, cryptVersion:Number });

var Game = mongoose.model('Game', { 
	gameName: String, gameNameID: Number,
	minPlayersPerGame: Number, maxPlayersPerGame:Number,
	frontendServerIP: String, frontendServerPort:Number, 
	token: String
});

var TournamentReg = mongoose.model('TournamentRegs', {	tournamentID: Number, userID: String, promo:String, status:Number, date:Date });

var Gift = mongoose.model('Gift', { name: String, photoURL: String, description: String, URL: String, price: Number, sended:Object, date:Date });

var UserGift = mongoose.model('UserGifts', { userID: String, giftID: String });
var MoneyTransfer = mongoose.model('MoneyTransfer', {userID: String, ammount:Number, source: Object, date: Date});

//var TournamentResult = mongoose.model('TournamentResults', {tournamentID: String, userID: String, place:Number, giftID: String});
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
	tournamentID:		Number,

	settings: 			Object, 

	startedTime: 		Date
	//tournamentServerID: String
});

function SERVER_ERROR(err, res){
	Error(err);
	if (res){
		Answer(res, Fail);
	}
}

function servError(err, res){
	Error(err);
	if (res){
		Answer(res, {result:'ServerError'} );
	}
}

//var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609a7da4d4145c718549ab3' });//ObjectId(
/*var uGift = new UserGift({ userID: 'Alvaro_Fernandez', giftID: '5609b3a58b659cb7194c78c5' });//ObjectId(

uGift.save(function (err){
	if (err) {Error(err);}
})*/

function AddGift(data, res){
	Log('trying to add gift '+ JSON.stringify(data), 'Gifts');
	if (data){
		gift = new Gift(data);
		gift.save(function (err){
			if (err){
				Error(err);
				Answer(res, Fail);
			}
			else{
				Log('Added gift ' + JSON.stringify(data), 'Gifts');
				Answer(res, OK);
			}
		})
	}
	else{
		Log('No addition. Gift is null', 'Gifts');
		Answer(res, Fail);
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

addGame('Battle', 3, {port:5011, maxPlayersPerGame:2} );
function addGame(gameName, gameNameID, options ){
	var minPlayersPerGame = options.minPlayersPerGame||2;
	var maxPlayersPerGame = options.maxPlayersPerGame||10;
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

function makeUserArray(userRegs){
	var arr = [];
	for (var i = userRegs.length - 1; i >= 0; i--) {
		arr.push(userRegs[i].userID);
	};
	return arr;
}

function getBuyInOfTournament(tournamentID){
	return new Promise(function (resolve, reject){
		// console.error('Starting Promise');
		Tournament.findOne({tournamentID:tournamentID},'buyIn tournamentID', function (err, tournament){
			if (err) {
				console.err('Tournament buyIn not found. ' + JSON.stringify(err));
				reject(err);
			}
			else{
				if (tournament){
					if (tournament.buyIn>=0){
						Log('Tournament found. ' + JSON.stringify(tournament));
						resolve(tournament);
					}
					else{
						console.log('Tournament ' + tournamentID +' was free, no returns needed');
						reject('Tournament ' + tournamentID +' was free, no returns needed');
					}
				}
				else{
					console.error('Tournament not found. ' + JSON.stringify(tournament));
					reject('Tournament not found. ' + JSON.stringify(tournament));
				}
			}
		})
	});
}

function str(obj){
	return ' '+JSON.stringify(obj)+' ';
}


function pGetPlayers (obj){
	// needs tournamentID
	return new Promise(function (resolve, reject){
		// console.error('Continue Promise ' + JSON.stringify(obj));
		TournamentReg.find({tournamentID:obj.tournamentID},'userID', function (err, players){
			if (!err){
				//Answer(res, players);
				//console.error('Players :' + JSON.stringify(players) );
				var obj2 = {tournamentID: obj.tournamentID, players:makeUserArray(players), buyIn: obj.buyIn};
				
				console.log('Players now :' + JSON.stringify(obj2));
				//obj.players=players;

				resolve(obj2);
			}
			else{
				console.error(err);
				reject('Error ' + JSON.stringify(err) );
				//Answer(res, Fail);
			}
		});
	})
}

app.post('/RunningTournaments', function (req, res){
	console.error('RunningTournaments');
	getRunningTournaments(res);
})

function getRunningTournaments (res) {
	Tournament.find({status:TOURN_STATUS_RUNNING},'', function (err, tournaments){
		if (err) { SERVER_ERROR(err, res); return; }
		var running = [];
		for (var i in tournaments){

			running.push(tournaments[i].tournamentID);
		}
		Answer(res, running);
	})
}

function retMoney(tournament){
	return new Promise( function (resolve, reject){
		// console.error('Last Promise ' + JSON.stringify(tournament) );
		for (var index in tournament.players){
			var user = tournament.players[index];
			var money = parseInt(tournament.buyIn);
			console.error('Incr money of user ' + user+ ' by ' + money + ' points');
			if (money>0) { 
				incrMoney(null, user, money, {
					type:SOURCE_TYPE_CANCEL_REG, 
					tournamentID: tournament.tournamentID
				});

			}
			else {
				if (money<0) console.error('Money error: ' + money);
				reject('Money error: '+ money);
			}
		}
		console.log('Money OK: ');
		resolve(tournament);
	})
}

function ReturnBuyInsToPlayers(tournamentID){
	console.error('return BuyIns ' + tournamentID);
	getBuyInOfTournament(tournamentID)
	.then(pGetPlayers)//get userIDs
	.then(retMoney)
	.catch(Error);
}

function StopTournament(data, res){
	Log('DB.StopTournament needs promises!!!', STREAM_SHIT);
	Log('RETURN MONEY TO USERS, WHO TOOK PART IN STOPPED TOURNAMENT', STREAM_SHIT);
	if (data && data.tournamentID){
		Log('DBServer starts tournament '+ data.tournamentID, STREAM_TOURNAMENTS);
		setTournStatus(data.tournamentID, TOURN_STATUS_FINISHED);
		ClearRegistersInTournament([data.tournamentID]);
		ReturnBuyInsToPlayers(data.tournamentID);
		Answer(res, OK);
		multiLog('StopTournament ' + JSON.stringify(data), [STREAM_TOURNAMENTS, 'Manual'] );
	}
	else{
		Log('StopTournament: no tournamentID, no fun!', STREAM_WARN);

		Answer(res, Fail);
	}
}


function StartTournament(tournamentID, force, res){
	var gameNameID;
	var players;
	Log("Tournament " + tournamentID + " starts", STREAM_TOURNAMENTS);
	
	Tournament.findOne({tournamentID:tournamentID}, 'gameNameID', function (err, tournament){
		if (err) {SERVER_ERROR(err, res); return;}
		if (!tournament) {SERVER_ERROR(null, res); return;}
		
		gameNameID = tournament.gameNameID;

		TournamentReg.find({tournamentID:tournamentID}, '', function (err, regs){
			players = [];
			//var obj = [];
			for (var a in regs){ players.push( regs[a].userID);	}

			var obj = getPortAndHostOfGame(gameNameID);
			obj.tournamentID = tournamentID;
			obj.logins = players;
			if (force) obj.force = true;

			Log('StartTournament: ' + str(obj), STREAM_TOURNAMENTS);
			TournamentLog(tournamentID, 'Tournament starts... ' + str(players));
			TournamentLog(tournamentID, 'start Object:' + str(obj));

			setTournStatus(tournamentID, TOURN_STATUS_RUNNING);

			sender.sendRequest("StartTournament", obj, '127.0.0.1', 'FrontendServer', null, sender.printer);
			
			if (!force) {
				sender.Stats('StartTournament', {tournamentID:tournamentID, players:players });
			}	else {
				sender.Stats('RestartTournament', {tournamentID:tournamentID});
			}
			if (res) Answer(res, OK);
		})
	})
}

/*function StartTournament(data, res){
	Log('DBServer starts tournament ' + data);
	if (data && data.tournamentID){
		setTournStatus(data.tournamentID, TOURN_STATUS_RUNNING);
		Answer(res, OK);
		Log('StartTournament ' + data.tournamentID, STREAM_TOURNAMENTS);
	}
	else{
		multiLog('StartTournament: no tournamentID, no fun! ' + JSON.stringify(data), [STREAM_WARN,STREAM_ERROR] );
		Answer(res, Fail);
	}
}*/

function last (Arr){
	return Arr[Arr.length-1];
}

function FinishGame (req, res){
	var data = req.body;
	console.error('DBServer FinishGame');
	Log(data);
	var gameID = data['gameID'];
	var tournamentID = data['tournamentID'];
	var scores = data['scores'];
	
	Log('******************* game Finishes *********' + gameID + '****************', 'Tournaments');
	Log('EndTournament: ' + tournamentID, 'Tournaments');
	EndTournament(scores, gameID, tournamentID);
	
	sender.Answer(res, {result: 'OK', message: 'endingTournament'+tournamentID} );

	/*if (gameWasLast(gameID)){
		strLog('EndTournament: ' + tournamentID, 'Tournaments');
		sender.Answer(res, {result: 'OK', message: 'endingTournament'+tournamentID} );
		EndTournament(scores, gameID, tournamentID);
	}
	else{
		sender.Answer(res, {result: 'OK', message: 'endingGame'+gameID});
		strLog('Middle results: ' + JSON.stringify(data), 'Tournaments');
	}*/	
}

function EndTournament( scores, gameID, tournamentID){
	Tournament.findOne({tournamentID:tournamentID, status:TOURN_STATUS_RUNNING},'goNext', function (err, tournament){
		if (err) { SERVER_ERROR(err); return; }

		if (!tournament) {console.error('EndTournament not found'); return;}

		sender.Stats('FinishedTournament', {tournamentID: tournamentID}); 
		
		var obj = [];
		for (var a in scores){ obj.push( { value:scores[a], login: a } );	}

		var winnersCount = tournament.goNext[0];
		Log('Prizes will go to ' + winnersCount + ' first users');

		obj.sort(sort_by('value', true, parseInt));
		Log(obj);
		Log(tournaments[tournamentID]);
		Log('------');
		TournamentLog(tournamentID, 'Winners:'+str(obj));


		WinPrize({winners:obj, tournamentID:tournamentID});
		
		Log('Finished Tournament ' + tournamentID, 'chk');

		Log(scores);
		
	})

	//if (tournaments[tournamentID]){
	//}
}



var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}


function GetTournamentAddress(req, res){
	var tournamentID = req.body.tournamentID;
	Log('BODY : ' + JSON.stringify(req.body), STREAM_TOURNAMENTS);
	Log('get addr of ' + tournamentID, STREAM_TOURNAMENTS);

	Tournament.findOne({tournamentID:tournamentID}, '', function (err, tournament){
		if (err) { SERVER_ERROR(err, res); return;}
		if (!tournament) { SERVER_ERROR('tournament not found', res); return;}
		var gameNameID = tournament.gameNameID;
		var a = getPortAndHostOfGame(gameNameID);
		
		a.running = tournament.status==TOURN_STATUS_RUNNING;//||null;
		Log(JSON.stringify(a), STREAM_TOURNAMENTS);

		sender.Answer(res, {address: a});
	})
}


var gameHost = configs.gameHost;

function getPortAndHostOfGame(gameNameID){
	Log('getPortAndHostOfGame. REWRITE IT!!!!');

	switch (gameNameID)
	{
		case 1: return { port:5009, host: gameHost }; break; // PPServer
		case 2: return { port:5010, host: gameHost }; break; // QuestionServer
		case 3: return { port:5011, host: gameHost };	break; // BattleServer
		default:
			Log('Some strange gameNameID !!' + gameNameID,'WARN');
			return { port:5010, host: gameHost };//QuestionServer
		break;
	}
}


function MoneyTransfers(req, res){
	MoneyTransfer
		.find({userID: req.body.login})
		.sort('-date')
		.exec(function (err, transfers){
			if (err) { Err(err, res); }
			else{
				Answer(res, transfers);
			}
		})
}
function TournamentLog(tournamentID, message){
	var time = new Date();
	//console.log('TournamentLog LOGGING!!!!');
	fs.appendFile('Logs/Tournaments/' + tournamentID + '.txt', '\r\n' + time + ' TS: ' + message + '\r\n', function (err) {
		if (err) {Log(err); throw err; }
		//console.log('The "data to append" was appended to file!');
	});
}


function clearRegister(tournamentID, login){
	return new Promise(function (resolve, reject){
			TournamentReg.remove({userID:login, tournamentID:tournamentID}, function (err, count){
				if (err){ reject(err); }
				else{
					if (removed(count)) { 
						resolve(1);
					}	else {
						reject(null);
					}
				}
			});
	});
}

function incrMoney1(login, cash, source) {
	return new Promise(function (resolve, reject){
		Log('incrMoney: give ' + cash + ' points to ' + login);
		if (cash<0){ cash*= -1;}
		
		User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
			if (err){ reject(err); }
			else{
				if (updated(count)){
					cLog('IncreaseMoney----- count= ' + count + ' ___ ' +login);
					Log('SAVE TRANSFER NEEDS OWN Promise!!', STREAM_SHIT);
					resolve(1);
				} else {
					reject(null);
				}
			}
		});
	});
}

function CancelRegister(data, res){
	var login = data.login;
	var tournamentID = data.tournamentID;
	var buyIn;
	getUnRegistrableTournament(tournamentID)
	.then(function (tournament){
		buyIn = tournament.buyIn;

		return clearRegister(tournamentID, login);
	})
	.then(function (cleared){
		return incrMoney1(login, buyIn, {type:SOURCE_TYPE_CANCEL_REG, tournamentID: tournamentID});
	})
	.then(function (saved){
		return pSaveTransfer(login, buyIn, {type:SOURCE_TYPE_CANCEL_REG, tournamentID: tournamentID});
	})
	.then(function (increased){
		return changePlayersCount(tournamentID, -1);
	})
	.then(function (msg){
		Answer(res, OK);
	})
	.catch(function (err){
		cLog('CATCHED error while CancelRegister'); cLog(err);
		Error(err);
		Answer(res,Fail);
	})
}

function removed(count){
	console.error(count.result);
	return count.result.n>0;
}


const SOURCE_TYPE_BUY_IN = 'BuyIn'
,SOURCE_TYPE_WIN = 'Win'
,SOURCE_TYPE_PROMO = 'Promo'
,SOURCE_TYPE_CANCEL_REG = 'Cancel'
,SOURCE_TYPE_CASHOUT = 'Cashout'
,SOURCE_TYPE_DEPOSIT = 'Deposit';

function payBuyIn(buyIn, login){
	return new Promise(function (resolve, reject){
		console.log('payBuyIn', buyIn, login);
		User.update({login:login, money: {$not : {$lt: buyIn }} }, {$inc : {money: -buyIn} }, function takeBuyIn (err, count) {
			if (err) { reject(err); } 
			else {
				if (updated(count)) { 
					resolve(true);
				} else {
					reject(TREG_NO_MONEY);
				}
			}
		});
	})
}

function saveReg(tournamentID, login, promo){
	return new Promise(function (resolve, reject){
			var reg = new TournamentReg({userID:login, tournamentID: parseInt(tournamentID), promo:promo});
			reg.save(function (err) {
				if (err) reject(err);
				
				Log('added user to tournament');
				resolve(true);
			});
	})
}

function findTournamentReg(tournamentID, login){
	return new Promise(function (resolve, reject){
		TournamentReg.findOne({tournamentID:tournamentID, userID:login},'', function (err1, reg){

			if (err1) reject(err1);
			console.error('reg:', reg);
			if (reg) reject('AlreadyRegistered');

			if (reg) console.log('I am still writing after reject!');
			
			resolve(true);
			console.log('I am writing after resolve!');
			
		})
	})
}

function getRegistrableTournament(tournamentID){
	return new Promise(function (resolve, reject){

		Tournament.findOne({tournamentID:tournamentID, status:TOURN_STATUS_REGISTER}, '', function (err, tournament) {
			if (err) { Error(err); reject(err); }
			else{
				if (tournament && tournament.players<tournament.goNext[0]) { 
					console.log('getRegistrableTournament', tournament);
					resolve(tournament);
				} else {
					reject(TREG_FULL);
				}
			}
		})

	})
}

function getUnRegistrableTournament(tournamentID){
	return new Promise(function (resolve, reject){

		Tournament.findOne({tournamentID:tournamentID, status:TOURN_STATUS_REGISTER}, '', function (err, tournament) {
			if (err) { Error(err); reject(err); }
			else{
				if (tournament && tournament.players>0) { 
					console.log('getUnRegistrableTournament', tournament);
					resolve(tournament);
				} else {
					reject(null);
				}
			}
		})

	})
}

var TREG_NO_MONEY='TREG_NO_MONEY';
var TREG_FULL='TREG_FULL';

function RegisterUserInTournament(data, res){
	var tournamentID = data.tournamentID;
	var login = data.login;


	var buyIn;
	var playerCount;
	var maxPlayers;
	getRegistrableTournament(tournamentID)
	.then(function (tournament) {
		console.log(tournament);
		buyIn = tournament.buyIn;
		playerCount = tournament.players;
		maxPlayers = tournament.goNext[0];
		return findTournamentReg(tournamentID, login);
	})
	.then(function (reg){
		return saveReg(tournamentID, login, 'gaginho');
	})
	.then(function (savingSuccess){
		console.log('savingSuccess');
		return payBuyIn(buyIn, login);
	})
	.then(function (paymentSucceed){
		console.log('paymentSucceed');
		return pSaveTransfer(login, -buyIn, {type:SOURCE_TYPE_BUY_IN, tournamentID:tournamentID});
	})
	.then(function (increased){
		console.log('increased');
		//return incrPlayersCount(tournamentID);
		return changePlayersCount(tournamentID);
	})
	.then(function (saved){
		console.log('REGISTER OK!!!!!');
		Answer(res, OK);

		if (playerCount==maxPlayers-1){
			StartTournament(tournamentID);
		}
	})
	.catch(function (err){
		console.log('CATCHED error while player registering!', err);
		Answer(res, Fail);
		Error(err);
	})
}

function getTournament(tournamentID){
	return new Promise(function (resolve, reject){
		Tournament.findOne({tournamentID:tournamentID}, '', function (err, tournament) {
			if (err) { Error(err); reject(err); }
			else{
				if (tournament) resolve(tournament);
				reject(null);
			}
		})
	})
}

function incrPlayersCount(tournamentID){
	return new Promise(function (resolve, reject){
		Tournament.update({tournamentID:tournamentID}, {$inc: {players:1}} , function (err, count){
			if (err){	reject(err); return; } 
			resolve(true);
		});
	})
}

function changePlayersCount(tournamentID, mult){
	if (!mult) {mult = 1;}
	/*return new Promise(function (resolve, reject){
		Tournament.update({tournamentID:tournamentID}, {$inc: {players:1*mult}} , function (err, count){
			if (err){	reject(err); }
			else{
				if (updated(count)){
					resolve(1);

				} else {
					reject('changePlayersCount');
				}
			}
		});
	})*/
	return new Promise(function (resolve, reject){
		TournamentReg.find({tournamentID:tournamentID}, '', function (err, regs){
			if (err) {reject(err);}
			else{
				var playerCount = regs.length;
				console.log('changePlayersCount playerCount: '+ playerCount);
				
				Tournament.update({tournamentID:tournamentID}, {$set : {players:playerCount}}, function (err, count){
					if (err){	reject(err); }
					else{
						if (updated(count)){
							resolve(1);
						} else {
							reject('changePlayersCount');
						}
					}
				})		
			}
		})
	});
}

function Printer(err, count){
	if (err){ Error(err); }
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

function updated(count){
	console.log('Updated : ' + JSON.stringify(count), STREAM_USERS );
	return count.n>0;
}

function HASH(password){
	return password;
}

function createPass(login){
	var rand= 5;//(new Date()).toMilliseconds % 1024;
	return login+rand;
}

function resetPassword(user){
	return new Promise(function (resolve, reject){
		var login = user.login;
		var email = user.email;
		var newPass = HASH(createPass(login));
		Log('Filter passwords, when you change them!!', STREAM_SHIT);

		User.update({login:login, email:email}, {$set : {password:newPass } }, function (err, count){
			if (err) { reject(err); }
			else{
				if (updated(count)) {
					Log('resetPassword OK '+ login + '  ' + newPass, STREAM_USERS);
					//Answer(res, OK);
					user.password = newPass;
					resolve(user);
				}
				else{
					reject(Fail);
					//Answer(res, Fail);
				}
			}
		})

	})
}

function Changepassword(req, res){
	var data = req.body;
	var login = data.login;
	var oldPass = data.oldPass;
	var newPass = data.newPass;

	Log('Filter passwords, when you want to change them!! Changepassword', STREAM_SHIT);
	User.update({login:login, password:HASH(oldPass)}, {$set : {password:HASH(newPass) } }, function (err, count){
		
		if(err) { servError(err, res); }
		else{
			if (updated(count)) {
				Log('Changepassword OK '+ login, STREAM_USERS);
				Answer(res, OK);
			}
			else{
				Answer(res, Fail);
			}
		}
	})

	/*Log("check current auth");
	Log("ChangePass of User " + data['login']);
	res.end(Fail);*/
}

function ResetPassword(req, res){
	var data = req.body;
	Log('these actions must be done together!! ResetPassword', STREAM_SHIT);
	var login = data.login;
	Stats('ResetPassword', {login:login});

	resetPassword(data)
	.then(sendResetPasswordEmail)
	.catch(function (err){
		//Stats('ResetPassword', {login:login, result:});
		Answer(res, err);
		Stats('ResetPasswordFail', {login:login});
	})
	.then(function (result){
		Answer(res, OK);
		//Stats('ResetPasswordOK', {login:login});
		Log("Sended mail and reset pass. Remember pass of User " + JSON.stringify(result), STREAM_USERS);
	})
}

function cLog(data){
	console.log(data);
}

function passwordCorrect(user, enteredPassword){
	return security.passwordCorrect(user, enteredPassword);
}

function LoginUser(req, res){
	var data = req.body;
	cLog("LoginUser... " + JSON.stringify(data));

	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	//Log('Try to login :' + login + '. (' + JSON.stringify(data) + ')', STREAM_USERS);

	var usr1 = User.findOne({login:login}, 'login password cryptVersion salt' , function (err, user) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	Error(err, 'CANNOT LOG IN USER!!!');
	    	Answer(res, {result: err});
	    }
	    else{
	    	if (user && passwordCorrect(user, password) ){
		    	Log('Logged in ' + JSON.stringify(user), STREAM_USERS);
			    Answer(res, OK);
			    
			}
			else{
				Log('Invalid login/password : ' + login, STREAM_USERS);
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

function GetUsers( req,res){
	//throw new Error('Catch Me If You Can');
	var data = req.body;
	var query = {};
	var queryFields = '';//'id buyIn goNext gameNameID';
	
	if (data['query']) {query = data['query'];}
	if (data['queryFields']) {queryFields = data['queryFields'];}


	/*Log(query);
	Log(queryFields);*/

	/*Tournament.find(query,queryFields , function (err, tournaments){
		Log(tournaments);
		 Answer(res, tournaments);
	});*/

	User.find(query, 'login money' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
			Error(err, 'GetUsersError ');
			Answer(res, errObject);
	    }
	    else{
			Answer(res, users);
		}
 	});
}

function IncreaseMoney(req,res) {

	var data = req.body;
	var login = data.login;
	var cash = data.cash;
	incrMoney(res, login, cash, {type: SOURCE_TYPE_DEPOSIT});
}
function DecreaseMoney(req, res) {

	Log('DecreaseMoney!!!!');
	var data = req.body;
	var login = data.login;
	var money = data.money;
	decrMoney(res, login, money, {type: SOURCE_TYPE_CASHOUT});
}

function decrMoney(res, login, cash, source) {

	if (cash<0){ cash*= -1;}

	User.update({login:login, money: {$not : {$lt: cash }} } , {$inc: {money:-cash} }, function (err, count) {
		if (err) { Error(err); Answer(res, Fail); }
		else{
			Log('DecreaseMoney---- count= ' + JSON.stringify(count));
			if (updated(count)){
				Answer(res, OK);
				Log('DecreaseMoney OK -- ' + login + ':' + cash, 'Money');
				saveTransfer(login, -cash, source||null);
			}
			else{
				Answer(res, Fail);
				Log('DecreaseMoney Fail -- ' + login + ':' + cash, 'Money');
			}
		}
	})
}

function incrMoney(res, login, cash, source) {

	Log('incrMoney: give ' + cash + ' points to ' + login);
	if (cash<0){ cash*= -1;}

	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			Error(err);
			if (res) Answer(res, Fail);
		}
		else{
			cLog('IncreaseMoney----- count= ' + count + ' ___ ' +login);
			Log('Analyze COUNT parameter in  incrMoney, stupid dumbass!', STREAM_SHIT);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err){
					Error(err);
					if (res) Answer(res, Fail);
				}
				else{
					if (user){
						Log(user);
						Log('Money now = '+ user.money);
						if (res) Answer(res, {login: user.login, money: user.money});
						saveTransfer(login, cash, source||null);
					}
					else{
						Log('User NOT FOUND IT CANNOT BE SO! ' + login + '  ' + cash, STREAM_WARN);
						if (res) Answer(res, Fail);
					}
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

function pSaveTransfer(login, cash, source){
	//, date:new Date()
	if (cash!=0 && cash!=null){
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
		transfer.save(function (err){
			if (err){ Error(err); throw err;}
			Log('MoneyTransfer to: '+ login + ' '+ cash/100 +'$ ('+ cash+' points), because of: ' + JSON.stringify(source), 'Money');
			return true;
		});
	}
}

function saveTransfer(login, cash, source){
	//, date:new Date()
	if (cash!=0 && cash!=null){
		var transfer = new MoneyTransfer({userID:login, ammount: cash, source:source || null , date:new Date() });
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
			else{
				Stats('GivePrize', {tournamentID: tournamentID});
			}
		});
	}
	else{
		//money
		Log('mmmMoney!! ' + Prize);
		if (Prize>0){
			User.update( {login:player.login}, {$inc: { money: Prize }} , function (err,count) {
				if (err){ Error(err); return; }
				Log(count); 
				saveTransfer(player.login, Prize, { type:SOURCE_TYPE_WIN, tournamentID:tournamentID } );
				Stats('GivePrize', {tournamentID: tournamentID});
			});
		}
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
				givePrizeToPlayer(player, getPrize(Prizes.Prizes, Prizes.goNext,  i+1), tournamentID );
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
							incrMoney(null, promoter, payment, {type:SOURCE_TYPE_PROMO, tournamentID:tournamentID} );
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

function WinPrize(data, res){
	//var data = req.body;

	/*var userID = data['userID'];
	var incr = data['prize'];
	Log('uID= '+ userID + ' incr=' + incr);*/
	Log(JSON.stringify(data));

	var winners = data.winners;
	var tournamentID = data.tournamentID;
	LoadPrizes(tournamentID, winners);

	
	//Answer(res, {result:'WinPrize_OK'});
	setTournStatus(tournamentID, TOURN_STATUS_FINISHED);
	setTimeout(KillFinishedTournaments, 5000);
	//Tournament.remove({tournamentID:})
	UpdatePromos(tournamentID);

}

/*function getUserByID(ID){
	return users[getLoginByID(ID)];
}


function getLoginByID(ID){
	return IDToLoginConverter[ID]?IDToLoginConverter[ID]:'defaultLogin';
}*/

KillFinishedTournaments();

function KillFinishedTournaments(){
	Tournament.find({status:TOURN_STATUS_FINISHED}, 'tournamentID', function (err, finishedTournaments){
		Log('finishedTournaments: ' + JSON.stringify(finishedTournaments) );
		/*var TRegIDs = [];
		for (var i = finishedTournaments.length - 1; i >= 0; i--) {
			var id = finishedTournaments[i].tournamentID;
			console.log(id);
			TRegIDs.push(id);
			//TRegIDs.push(finishedTournaments[i].tournamentID);
		};*/
		var TRegIDs = killID(finishedTournaments, 'tournamentID');
		ClearRegistersInTournament(TRegIDs);
	})
}



function ClearRegistersInTournament(TRegIDs){
	Log('TRegIDs : '+JSON.stringify(TRegIDs), 'TREGS');

	var finishedTS = 3; //TOURN_STATUS_FINISHED

	for (var i = TRegIDs.length - 1; i >= 0; i--) {
		var tournamentID = TRegIDs[i];
		Log('treg: ' + tournamentID, 'TREGS');
		TournamentReg.update( { tournamentID : tournamentID}, { $set: { status : finishedTS } }, {multi: true}, function (err, count){
			if (err) {Error(err);}
			else{
				var cnt = updated(count);
				if (cnt){
					Log('Killed TournamentRegs: ' + tournamentID + ' count: '+cnt, 'TREGS' );
				}
				else{
					Log('No changes ' + tournamentID + ' ' + JSON.stringify(cnt), 'TREGS')
				}
			}
		})
	};

	/*TournamentReg.find({tournamentID: {$in : TRegIDs} } , function (err, tournRegs){
		if (err) {Error(err);}
		else{

			Log('Killed TournamentRegs: ' + JSON.stringify(tournRegs), 'TREGS' );
		}
	})*/
	
	/*TournamentReg.update({tournamentID: {$in : TRegIDs} } , {$set: {status:TOURN_STATUS_FINISHED}}, function finishTournamentRegs (err, tournRegs){
		if (err) {Error(err);}
		else{

			Log('Killed TournamentRegs: ' + JSON.stringify(tournRegs), 'TREGS' );
		}
	})*/
}

function killID(arr, field){
	var list = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		list.push(arr[i][field]);
	};
	Log('killID result: ' + JSON.stringify(list) );
	return list;
}


function attachFieldToObj(obj, field, value){
	obj[field] = value;
	return obj;
}

function findUser(login){
	return new Promise(function (resolve, reject){
		User.findOne({login:login}, 'login money', function (err, user) {
			if (err) { reject(err); }
			else{
				if (!user) { 
					console.error('User ' + login + ' doesn\'t exist'); 
					reject({}); 
				}// if catch, but .err not found, it means, that user doesn't exist
				else{
					var profileInfo = {login:login, money:user.money};
					resolve(profileInfo);
				}
			}
		});
	});
}

function findRegs(profileInfo){
	return new Promise(function (resolve, reject){
		TournamentReg
		.find({userID:profileInfo.login, status : { $ne: TOURN_STATUS_FINISHED } })
		.sort('-tournamentID')
		.exec(function (err, tournaments){
			if (err){
				console.error(err);
				reject(attachFieldToObj(profileInfo, 'err', err));
			}
			else{
				resolve(attachFieldToObj(profileInfo, 'tournaments', tournaments||{} ));
			}
		})
	});
}

function findGiftIDs(profileInfo){
	return new Promise(function (resolve, reject){
		UserGift.find({userID:profileInfo.login}, 'giftID', function (err, gifts){
			console.log('findGiftIDs got '+JSON.stringify(profileInfo) );
			if (err){
				reject(attachFieldToObj(profileInfo, 'err', err));
			}
			else{
				//var userGifts = killID(gifts || {}, 'giftID');
				resolve(attachFieldToObj(profileInfo, 'gifts', gifts || {} ));
			}
		});
	});
}

function findGifts(profileInfo){
	return new Promise(function (resolve, reject){
		var userGifts = killID(profileInfo.gifts, 'giftID');
		Gift.find( { _id : {$in : userGifts}} , '', function (err, UserGifts){
			if (err){
				reject(attachFieldToObj(profileInfo, 'err', err));
			}
			else{
				resolve(attachFieldToObj(profileInfo, 'userGifts', UserGifts || {} ));
			}
		});
	});
}

function GetUserProfileInfo(req , res){
	var data = req.body;
	Log('Write Checker for sender validity.');
	var login = data['login'];
	Log('-----------USER PROFILE INFO -----ID=' + login + '------');
	findUser(login)
	.then(findRegs)
	.then(findGiftIDs)
	.then(findGifts)
	.then(function (profileInfo){
		Answer(res, profileInfo); //console.error('User profileInfo ' + JSON.stringify(profileInfo));
	})
	.catch(function (profileInfo){
		if (profileInfo.err){
			console.error(profileInfo.err);
			Answer(res, profileInfo); // it means, that user exists
		}	else {
			Answer(res, Fail); // user does not exist
		}
	})
}

app.post('/userExists', user_exists);

function user_exists (req, res) {
	var login = req.body.login;
	findUser(login)
	.then(function (user){
		Answer(res, user);
	})
	.catch(function (msg){
		console.error('user_exists error', msg);
		Answer(res, Fail);
	})
}

function now(){
	return new Date();
}

function createActivationLink(login){
	var domainName = 'online-tournaments.org';
	domainName = 'localhost';
	Log('Rewrite createActivationLink. It must be less human-readable. guuid', STREAM_SHIT);
	return login;
}

var USER_EXISTS = 11000;
var INVALID_DATA = 100; 

function createUser(data){
	return new Promise(function (resolve, reject){	
		var login = data['login'];
		var password = data['password'];
		var email = data['email'];

		if (!(validator.isEmail(email) && validator.isAlphanumeric(login) && validator.isAlphanumeric(password))){
			reject(INVALID_DATA);
		}

		var USER = { 
			login:login, 
			password: HASH(password), 
			money:0, 
			email:email, 
			date: now(), 
			activate:0, 
			bonus:{},

			cryptVersion:CURRENT_CRYPT_VERSION,
			salt:''
			//link:createActivationLink(login) 
		};

		var user = new User(USER);
		user.save(function (err) {
			if (err){
				switch (err.code){
					case USER_EXISTS:
						Log('Sorry, user ' + login + ' Exists', STREAM_USERS); //Answer(res, {result: 'UserExists'});
						reject(USER_EXISTS);
					break;
					default:
						Error(err);
						reject(UNKNOWN_ERROR);
					break;
				}
			}
			else{
				Log('added User ' + login+'/' + email, STREAM_USERS);
				resolve(USER);
			}
		})

	});
}

function makeRegisterText(login, link){
	console.log(login);
	console.log(link);
	var text = '<html><br>Thank you for registering in online-tournaments.org, ' + login + '!<br>';
	/*text+= 'Follow the link below to activate your account: '
	text+= '<br><a href="'+link+'">'+link+'</a>';*/
	text+= '</html>';

	Log('Registering email: ' + text, STREAM_USERS);

	return text;
}

function makeResetPasswordText(user){
	var text = 'You resetted your password. Your new password is : ' + user.password;
	text+=  ' . We strongly recommend you to change it in your profile ';

	return text;
}

function sendActivationEmail(user){
	console.error('sendActivationEmail');

	user.to = user.email;
	user.subject = 'Registered in online-tournaments.org!';
	user.html = makeRegisterText(user.login, 'http://' + domainName + '/Activate/'+ user.link);

	return mailer.send(user);
	//mailer.send(user.email, 'Registered in online-tournaments.org!', makeRegisterText(login, email) );
}

function sendResetPasswordEmail(user) {
	user.to = user.email;
	user.subject = 'Reset password';
	user.html = makeResetPasswordText(user);

	return mailer.send(user);
}

var UNKNOWN_ERROR=500;

function Register (req, res){

	var data = req.body;
	Log('Register '+ JSON.stringify(data), STREAM_USERS);
	Stats('Register',{});
	createUser(data)
	.then(sendActivationEmail)
	.then(function (msg){
		Log('Reg OK: ' + JSON.stringify(msg) , STREAM_USERS);
		Answer(res, OK);
	})
	.catch(function (msg){
		Log('REG fail: ' + JSON.stringify(msg) , STREAM_USERS);
		switch(msg) {
			case UNKNOWN_ERROR:
				Answer(res, {result:UNKNOWN_ERROR} );
			break;
			case USER_EXISTS:
				Answer(res, {result:USER_EXISTS} );
			break;
			default:
				console.error(msg);
				Answer(res, Fail);
			break;
		}
		//Answer(res, Fail);//msg.err||null
		Stats('RegisterFail',{});
	})

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
					} else {
						Log('Registered: ' + JSON.stringify(tournRegs));
						//tournaments.regs = tournRegs;
						tournaments.push(tournRegs);
						Log('Registered: ' + JSON.stringify(tournaments));
						Answer(res, tournaments);
					}
				})
			} else {
				Answer(res, tournaments);
			}
		} else {
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
}

function GetTournaments (req, res){
	var data = req.body;
	var purpose = data.purpose || null;
	var query = getTournamentsQuery(data.query, data.queryFields, purpose);

	findTournaments(res, query.query, query.fields, purpose);

	//null - инициализирован
	//1 - reg - отправлен Турнирному и игровому серверам (объявлена регистрация)
	//2 - running - турнир начат
	//3 - finished - турнир окончен
	//4 - paused - турнир приостановлен
}

var COUNT_FIXED = 1;

function addTournament(maxID, tournament, res){
	tournament.tournamentID = maxID+1;
	var tourn = new Tournament(tournament);
	tourn.save(function (err) {
		if (err){
			Error(err);
			Answer(res, Fail);
		}	else {
			Answer(res, tournament);
			Log('added Tournament ' + JSON.stringify(tournament), STREAM_TOURNAMENTS);

			setTournStatus(tournament.tournamentID, TOURN_STATUS_REGISTER);
			sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'site');//, null, null );
		}
	});
}

function AddTournament (req, res){
	var data = req.body;
	var tournament = data;
	
	Tournament
		.findOne({})
		.sort('-tournamentID')
		.exec(function searchTournamentWithMaxID (err, maxTournament){
		if (!err){
			if (maxTournament) {
				addTournament(maxTournament.tournamentID, tournament, res);
			} else { 
				addTournament(0,tournament, res); 
			}
		}	else {
			multiLog('adding failed: ' + JSON.stringify(err), [STREAM_TOURNAMENTS, STREAM_ERROR] );	
			Answer(res, Fail);
		}
	});
}

function Initialize(){
	Tournament.find({status:null})
	.exec(function (err, tournaments){
		if (err) return err;
		if (tournaments){
			for (var i = tournaments.length - 1; i >= 0; i--) {
				setTournStatus(tournaments[i].tournamentID, TOURN_STATUS_REGISTER);

			};
		}
	})
}
//Initialize();


function multiLog(message, streams){
	for (var i = streams.length - 1; i >= 0; i--) {	Log(message,streams[i]); }
}

var server = app.listen(5007, function () {
  var host = server.address().address;
  var port = server.address().port;

  Log(serverName + ' is listening at http://%s:%s', host, port);
});
//server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
