module.exports = {
	SOURCE_TYPE_BUY_IN : 'BuyIn'
	,SOURCE_TYPE_WIN : 'Win'
	,SOURCE_TYPE_PROMO : 'Promo'
	,SOURCE_TYPE_CANCEL_REG : 'Cancel'
	,SOURCE_TYPE_CASHOUT : 'Cashout'
	,SOURCE_TYPE_DEPOSIT : 'Deposit'
	,SOURCE_TYPE_ACCELERATOR_BUY: 'BuyAccelerator'
	,SOURCE_TYPE_POINTS_BUY: 'BuyPoints'
	,SOURCE_TYPE_GRANT: 'Grant'
	,SOURCE_TYPE_SET: 'Set'
	,SOURCE_TYPE_OPEN_PACK: 'OpenPack'

	,INVITER_HUMAN:0
	,INVITER_GROUP:1 // groups in VK (maybe need another for FB groups)
	,INVITER_SITE:2 // partner sites
	,INVITER_VIDEO:3 // youtube

	,PAYMENT_TOURNAMENT:0
	,PAYMENT_ACCELERATOR:1
	,PAYMENT_FULLFILL:2
	,PAYMENT_PACK:3

	,MESSAGE_READ:1

	,NOTIFICATION_GIVE_ACCELERATOR:1 // give to user an accelerator
	,NOTIFICATION_GIVE_MONEY:2 // give user money
	,NOTIFICATION_ACCEPT_MONEY:3 // give money to a user if he clicks on button
	
	,NOTIFICATION_MARATHON_PRIZE:4 // give user money
	,NOTIFICATION_FORCE_PLAYING:5 // force playing
	,NOTIFICATION_CUSTOM:6 // custom message. needs fields
	,NOTIFICATION_UPDATE:7 // update page
	,NOTIFICATION_FIRST_MESSAGE:8

	,NOTIFICATION_MARATHON_CURRENT:9
	
	,NOTIFICATION_AUTOREG:10
	,NOTIFICATION_JOIN_VK:11

	,NOTIFICATION_WIN_MONEY:12
	,NOTIFICATION_LOSE_TOURNAMENT:13
	,NOTIFICATION_ADVICE:14
	,NOTIFICATION_CARD_GIVEN:15
	,NOTIFICATION_GIVE_PACK:16

	,USER_STATUS_NEWBIE: 1
	,USER_STATUS_READ_FIRST_MESSAGE: 2

	,RARITY_RARE: 0
	,RARITY_LOW: 1
	,RARITY_MID: 2
	,RARITY_HIGH: 3

	,CARD_COLOUR_RED:1
	,CARD_COLOUR_BLUE:2
	,CARD_COLOUR_GREEN:3
	,CARD_COLOUR_GRAY:4

	,REWARD_ACCELERATOR:1
	,REWARD_PACKS:2
	,REWARD_MONEY:3

	,TOURN_STATUS_REGISTER : 1
	,TOURN_STATUS_RUNNING : 2
	,TOURN_STATUS_FINISHED : 3
	,TOURN_STATUS_PAUSED : 4

	,PROMO_COMISSION : 5


	,GET_TOURNAMENTS_USER : 1
	,GET_TOURNAMENTS_BALANCE : 2
	,GET_TOURNAMENTS_GAMESERVER : 3
	,GET_TOURNAMENTS_INFO : 4
	,GET_TOURNAMENTS_RUNNING : 5
	,GET_TOURNAMENTS_UPDATE : 6

	,STREAM_ERROR : 'Err'
	,STREAM_TOURNAMENTS : 'Tournaments'
	,STREAM_USERS : 'Users'
	,STREAM_SHIT : 'shitCode'
	,STREAM_WARN : 'WARN'
	,STREAM_STATS : 'stats'
	,STREAM_GAMES : 'Games'

	,CURRENT_CRYPT_VERSION : 2
	
	,REGULARITY_NONE : 0
	,REGULARITY_REGULAR : 1
	,REGULARITY_STREAM : 2

	,SPECIALITY_SPECIAL : 1

	,TREG_NO_MONEY: 'TREG_NO_MONEY'
	,TREG_FULL: 'TREG_FULL'
	,TREG_ALREADY: 'Registered'

	// ,COLLECTION_PRIZE_

	// ,MESSAGE_TYPE_
};
