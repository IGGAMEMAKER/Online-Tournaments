var sender = require('./requestSender');
var configs = require('./configs');
console.log(configs);


var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var User = mongoose.model('User', { 
	login: String, password: String, money: Number, 
	email: String, activated:String, date: Date, link: String, bonus:Object, 
	salt:String, cryptVersion:Number 
});


var Game = mongoose.model('Game', { 
	gameName: String, gameNameID: Number,
	minPlayersPerGame: Number, maxPlayersPerGame:Number,
	frontendServerIP: String, frontendServerPort:Number, 
	token: String
});

var TournamentReg = mongoose.model('TournamentRegs', {	
	tournamentID: Number, userID: String, promo:String, status:Number, date:Date 
});

var Gift = mongoose.model('Gift', { 
	name: String, photoURL: String, description: String, URL: String, price: Number, sended:Object, date:Date 
});

var UserGift = mongoose.model('UserGifts', { userID: String, giftID: String });
var MoneyTransfer = mongoose.model('MoneyTransfer', {userID: String, ammount:Number, source: Object, date: Date});

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


User.find({},'', function (err, users){
	if (err){
		console.error(err);
	} else{
		console.log(users);
	}
})

Tournament.find({},'',function (err, tournaments){
	if (err) return console.error(err);
	console.log(tournaments[0]);
})