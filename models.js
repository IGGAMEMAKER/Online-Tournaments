module.exports = function(dbAddress){
	var mongoose = require('mongoose');
	//mongoose.connect('mongodb://localhost/test');
	//mongoose.connect('mongodb://'+dbAddress+'/test');
	db = mongoose.createConnection('mongodb://'+dbAddress+'/test');
	
	return {
		User : db.model('User', { login: String, password: String, money: Number, 
			email: String, activated:String, date: Date, link: String, bonus: Object, 
			salt:String, cryptVersion:Number, social:Object, inviter:Object 
		}) ,

		Game : db.model('Game', { 
			gameName: String, gameNameID: Number,
			minPlayersPerGame: Number, maxPlayersPerGame:Number,
			frontendServerIP: String, frontendServerPort:Number, 
			token: String
		}),

		TournamentReg : db.model('TournamentRegs', { tournamentID: Number, userID: String, promo:String, status:Number, date:Date }),

		Gift : db.model('Gift', { name: String, photoURL: String, description: String, URL: String, price: Number, sended:Object, date:Date }),

		UserGift : db.model('UserGifts', { userID: String, giftID: String }),
		MoneyTransfer : db.model('MoneyTransfer', {userID: String, ammount:Number, source: Object, date: Date}),

		Message : db.model('Message', {text:String, senderName:String, date: Date, isPrivate: Boolean}),

		Configs : db.model('Configs', {name:String, value: String}),

		Tournament : db.model('Tournament', { 
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
		})

		,Action : db.model('Action', {
			login: String,
			date: Date,
			type: String,
			auxillaries: Object
		})

		,Error : db.model('Error', {
			login: String,
			date: Date,
			type: String,
			auxillaries: Object
		})

		,Attempt : db.model('Attempts', {
			login: String,
			date: Date,
			type: String,
			auxillaries: Object
		})

	}
}

