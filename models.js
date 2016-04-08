var Promise = require('bluebird');
var helpers = require('./helpers/helper')

module.exports = function(dbAddress){
	var mongoose = require('mongoose');
	//mongoose.connect('mongodb://localhost/test');
	//mongoose.connect('mongodb://'+dbAddress+'/test');
	db = mongoose.createConnection('mongodb://'+dbAddress+'/test');
	

	return {
		Collection: db.model('Collection', { list: Array, name: String, description: String, rewardType:Number, reward: Object, colour:Number }),
		Pack: db.model('Packs', { price:Number, image:String,
			multiplier:Number,
			colours:Array, items:Array,
			packID:Number, available:Boolean,
			visible:Boolean
		}),

		User : db.model('User', { login: String, password: String, money: Number, 
			email: String, activated:String, date: Date, link: String, bonus: Object, 
			salt:String, cryptVersion:Number, social:Object, inviter:Object,
			info: Object
		}),
		Inviter : db.model('Inviter', {
			type: Number,
			landingPicture: String, //url to picture for landing page
			landingUrl: String,  // if VKgroup - groupUrl
			url: String,
			topics: Object
		}),
		Game : db.model('Game', { 
			gameName: String, gameNameID: Number,
			minPlayersPerGame: Number, maxPlayersPerGame:Number,
			frontendServerIP: String, frontendServerPort:Number, 
			token: String
		}),

		TournamentReg : db.model('TournamentRegs', { 
			tournamentID: Number, 
			userID: String, 
			promo:String, 
			status:Number, 
			date:Date 
		}),

		Gift : db.model('Gift', { 
			name: String,
			photoURL: String, 
			description: String, 
			URL: String, 
			price: Number, 
			sended:Object,
			date:Date,

			properties: Object // tags, status (bronze, silver, gold), isCard:Boolean, rarity
		}),

		UserGift : db.model('UserGifts', { userID: String, giftID: String,
			source: Object, date: Date,
			isCard:Boolean, colour:Number, actual:Boolean 
		}),
		News: db.model('News', { title: String, active: Boolean, finishTime: Date, startTime : Date, text: String, image: String, url: String }),

		MoneyTransfer : db.model('MoneyTransfer', { userID: String, ammount:Number, source: Object, date: Date }),
		Payment: db.model('Payments', { message: String, data:Object, date: Date }),
		MobilePayment: db.model('MobilePayments', { payID: String, ammount: String, date: Date, dateActivated: Date, login:String, active:Boolean }),

		Message : db.model('Message', {
			text:String, // title
			target: String,
			status: String,
			type: Number,
			data: Object, // paste here all you want
			// expect body parameter
			// type
			process: String, // if you need to give money to user only if he will press "accept" button

			date: Date,
			

			CTA: Object, // buttons -- if we grant money to user, we propose him to play paid tournaments or buy accelerators
			// if we grant an accelerator to user, we expect him to play in marathon tournaments e.t.c
			
			senderName:String,
			isPrivate: Boolean, 
			isSystem: Object
			/*
				it is in alert;
				code action code
			*/
		}),

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

			startedTime: 		Date,
			playTime: Date,
			finishTime: Date
			//tournamentServerID: String
		})
		,Marathon : db.model('Marathon', {
			MarathonID: Number,
			start: Date,
			finish: Date,
			prizes: Array, // if you want 3 prizes if 500 and 7 by 200 set [500, 200]
			counts: Array, // [3, 7]

			accelerators: Array, // value, price, sold, given upgade (index) [ {value: 4, price:20, sold:10, free:2, upgrade:0} , {value: 7, price:35, sold:10, free:3, upgrade:1} ]
			upgrades: Array, // value, price, sold, given // upgade (index) [ {value: 12, price:20, sold:10, free:2} , {value: 10, price:35, sold:10, free:3} ]

			soldAccelerators: Array,
			soldUpgrades: Array,

			freeAccelerators: Array,
			freeUpgrades: Array	
		})

		,MarathonUser : db.model('MarathonUser', {
			login: String,
			MarathonID: Number,
			accelerators: Array, // [ {value, index, buyDay, buyDate} , {value2, index2, buyDay2, buyDate2} ] // индекс 0 (4), 1 (7), день покупки

			accelerator: Object,
			points: Number,
			played: Number,
			isFree: Number,
			isSigned: Number
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

		,Statistic : db.model('Statistic', {
			// 2 types of stats:
			// personal
			// countable (daily)

			// login: String,
			date: Date,
			tag: String, // topic
			auxillaries: Object, // if personal it must be { login:login }
			attempt: Number,
			fail: Number,

		})


		,Attempt : db.model('Attempts', {
			login: String,
			date: Date,
			type: String,
			auxillaries: Object
		})

	}
}

