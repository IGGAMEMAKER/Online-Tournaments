var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "DBServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/GetTournaments"] = GetTournaments; //start all comands with '/'. IT's a URL to serve
//funcArray["/TournamentInfo"] = TournamentInfo;

funcArray["/GetUsers"] = GetUsers;

funcArray["/AddTournament"] = AddTournament;
funcArray["/Register"] = Register;

funcArray["/WinPrize"] = WinPrize;

funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;
funcArray['/IncreaseMoney'] = IncreaseMoney;
funcArray['/RestartTournament'] = RestartTournament;


funcArray["/Login"] = LoginUser;
/*funcArray["/Ban"] = Ban;
funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;*/

var loginSuccess = {
	result: 'success'
};

var loginFail = {
	result: 'fail'
};

var Success = {
	result: 'success'
};

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
					console.log('Sorry, game ' + 'GM_ABSTRACT_SYNC' + ' Exists');
					//sender.Answer(res, {result: 'OBJ_EXITS'});
				break;
				default:
					console.log(err);
					//sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//sender.Answer(res, {result: 'OK'});
			console.log('added Game'); 
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
		players: 		Array,
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

function ChangePassword(data, res){
	console.log("check current auth");
	console.log("ChangePass of User " + data['login']);
	res.end(Fail);
}

function RememberPassword(data, res){
	console.log("Send mail and reset pass");
	console.log("Remember pass of User " + data['login']);
	res.end(Fail);
}

function LoginUser( data, res){
	console.log("LoginUser...");
	console.log(data);
	//res.end(JSON.stringify(loginSuccess));

	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	console.log('Try to login :' + login + '. (' + JSON.stringify(data) + ')');

	var usr1 = User.findOne({login:login, password:password}, 'login password' , function (err, user) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	console.log('GetUsersError ');
	    	console.log(err);
	    	sender.Answer(res, {result: err});
	    }
	    else{
	    	if (user){
		    	console.log(JSON.stringify(user));
			    sender.Answer(res, {result:'OK'});
			    console.log('Logged in');
			}
			else{
				console.log('Invalid login/password : ' + login);
				sender.Answer(res, {result:'Invalid reg'});
			}
		}
 	});
	/*var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					console.log('Sorry, user ' + login + ' Exists');
					sender.Answer(res, {result: 'UserExists'});
				break;
				default:
					console.log(err);
					sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			sender.Answer(res, {result: 'OK'});
			console.log('added User'); 
		}
	});*/

}


function GetGameParametersByGameName (gameName){
	console.log('GetGameParametersByGameName... HERE MUST BE REAL REQUEST TO DATABASE');
	switch(gameName){
		case GM_ABSTRACT_SYNC:
			return {minPlayersPerGame:2, maxPlayersPerGame:3};
		break;
		default:
			return {minPlayersPerGame:2, maxPlayersPerGame:0};
		break;
	}
}

function RestartTournament(data, res){
	var tournamentID = data['tournamentID'];
	Tournament.findOne({tournamentID: tournamentID}, '', function (err, tournament){
		if (err){
			console.log('RestartTournament: ' + JSON.stringify(err));
			sender.Answer(res, errObject);
		}
		else{
			console.log('RestartTournament: ' + tournamentID);
			console.log(JSON.stringify(tournament));
			sender.Answer(res, tournament);
		}
	});
}

function GetUsers( data,res){
	var query = {};
	var queryFields = '';//'id buyIn goNext gameNameID';
	
	if (data['query']) {query = data['query'];}
	if (data['queryFields']) {queryFields = data['queryFields']; console.log('Got it!');}


	console.log(query);
	console.log(queryFields);

	/*Tournament.find(query,queryFields , function (err, tournaments){
		console.log(tournaments);
		sender.Answer(res, tournaments);
	});*/

	var usr1 = User.find(query, 'login money' , function (err, users) {    //'login money'  { item: 1, qty: 1, _id:0 }
	    if (err) {
	    	console.log('GetUsersError ');
	    	console.log(err);
	    	sender.Answer(res, errObject);
	    }
	    else{
	    	console.log(JSON.stringify(users));
		    sender.Answer(res, users);
		}
 	});

	//sender.Answer(res, users);
}

function IncreaseMoney(data,res){
	var login = data['login'];
	var cash = data['cash'];
	incrMoney(res, login, cash);
}
function incrMoney(res, login, cash){
	console.log('trying to give ' + cash + ' points to ' + login);
	User.update( {login:login}, {$inc: { money: cash }} , function (err,count) {
		if (err){
			console.log(err);
			sender.Answer(res, {result: 'fail'});
		}
		else{
			console.log('IncreaseMoney----- count= ');
			console.log(count);
			console.log(login);
			User.findOne({login:login}, 'login money', function (err, user){
				if (err || !user){
					console.log(err);
					sender.Answer(res, {result: 'fail'});
				}
				else{
					console.log(user);
					console.log('Money now = '+ user.money);
					sender.Answer(res, {login: user.login, money: user.money});
				}
			});
		}
	});
}

function WinPrize( data,res){
	/*var userID = data['userID'];
	var incr = data['prize'];
	console.log('uID= '+ userID + ' incr=' + incr);*/
	//console.log(users);
	//console.log('000000');
	/*for (var i = data.length - 1; i >= 0; i--) {
		data[i]
	};*/
	console.log(JSON.stringify(data));
	var player = {};
	for (i=0; i< data.length;i++){
		player = data[i];
		console.log('WinPrize:')
		console.log(player);
		User.update( {login:player.login}, {$inc: { money: player.prize }} , function (err,count) {
			if (err){ console.log(err); }
			else{ console.log(count);}
		});
	}
	sender.Answer(res, {result:'WinPrize_OK'});
	/*for (var player in data){
		incrMoney(res, player.login, player.prize);
		
	}*/

	/*var user = getUserByID(userID);
	console.log(user);
	user.money+= incr;
	console.log('money now=' + user.money);*/
}

/*function getUserByID(ID){
	return users[getLoginByID(ID)];
}


function getLoginByID(ID){
	return IDToLoginConverter[ID]?IDToLoginConverter[ID]:'defaultLogin';
}*/
function GetUserProfileInfo(data , res){
	console.log('Write Checker for sender validity');
	var login = data['login'];
	console.log('-----------USER PROFILE INFO -----ID=' + login + '------');
	//var usr = User.find({}, 'login password money' )

	var usr1 = User.findOne({login:login}, 'login password money', function (err, user) {    
	    if (err || !user) {
	    	console.log('ProfileInfoError ');
	    	console.log(err);
	    	sender.Answer(res, errObject);
	    }
	    else{
	    	console.log(JSON.stringify(user));
		    sender.Answer(res, {
		    	login:user.login,
		    	password : '****',
		    	money : user.money
		    });
		}
 	});
}

function Register (data, res){
	var USER_EXISTS = 11000;
	var login = data['login'];
	var password = data['password'];
	console.log('adding user :' + login + '. (' + JSON.stringify(data) + ')');
	console.log('Check the data WHILE adding USER!!! need to write Checker');
	var user = new User({ login:login, password:password, money:100 });
	user.save(function (err) {
		if (err){
			switch (err.code){
				case USER_EXISTS:
					console.log('Sorry, user ' + login + ' Exists');
					sender.Answer(res, {result: 'UserExists'});
				break;
				default:
					console.log(err);
					sender.Answer(res, {result: 'UnknownError'});
				break;
			}
		}
		else{
			//showRestraunt(res, name);
			sender.Answer(res, {result: 'OK'});
			console.log('added User'); 
		}
	});
	//console.log('Adding user ' + login + ' !!!');
		
		/*users[login] = data;
		users[login].userID = ++users.count;
		users[login].money = 100;
		IDToLoginConverter[users[login].userID]= login;*/

}
/*function GetUserProfileInfoHandler ( error, response, body, res){
	
}*/

function GetTournaments (data, res){

	console.log("GetTournaments ");// + data['login']);
	var query = {};
	var queryFields = '';//'id buyIn goNext gameNameID';
	
	if (data['query']) {query = data['query'];}
	if (data['queryFields']) {queryFields = data['queryFields']; console.log('Got it!');}

	/*else{
		query = {};
	}*/

	console.log(query);
	console.log(queryFields);

	Tournament.find(query,queryFields , function (err, tournaments){
		console.log(tournaments);
		sender.Answer(res, tournaments);
	});

	
	//res.end(currTournaments);
}



var COUNT_FIXED = 1;
function AddTournament (data, res){
	var tournament = data;
	console.log('Adding tournament ');
	console.log('++++++++++++++++++++++++++++');
	console.log(JSON.stringify(tournament));
	console.log('----------------------------');
	
	
	Tournament.count({}, function (err, cnt){
		tournament.tournamentID = cnt;
		var tourn = new Tournament(tournament);
		if (!err){
			tourn.save(function (err) {
				if (err){
					switch (err.code){
						case OBJ_EXITS:
							console.log('Sorry, tournament '  + ' Exists');
							sender.Answer(res, {result: 'TournamentExists??!!!'});
						break;
						default:
							console.log(err);
							sender.Answer(res, {result: 'UnknownError'});
						break;
					}
				}
				else{
					//showRestraunt(res, name);
					sender.Answer(res, tournament);
					console.log('added Tournament'); 
				}
			});
		}
		else{
			console.log('Mario, no addition');
			sender.Answer(res, {result: 'Fail', message: 'Gaga Genius'});
		}
	});
	

	/*var tournament = data;
	var tournID = ++currentTournamentCounter;
	tournament.tournamentID = tournID;
	tournaments[tournID] = tournament;*/


	//sender.Answer(res, tournament);
}

server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
