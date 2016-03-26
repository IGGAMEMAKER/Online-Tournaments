var db = require('../db');
var Gifts = db.wrap('Gift');
var UserGifts = db.wrap('UserGift');

var c = require('../constants')
// var await = require('await')

function all(query){
	// return db.list('Gift', query)
	return Gifts.list(query)
}

function getByID(giftID){
	// return db.findOne('Gift', { _id : giftID })
	return Gifts.findOne({ _id : giftID })
}

function addCard(name, description, photoURL, price, rarity, tags){
	var obj = {
		name:name,
		photoURL:photoURL,
		price:price,
		description:description
	}
	var properties = {
		rarity:rarity,
		isCard:true,
	}
	if (tags) properties.tags = tags

	obj.properties = properties;
	return Gifts.save(obj);
}

function remove(id){
	return Gifts.remove({_id: id})
}

function add(name, photoURL, description, URL, price, sended, date, properties){
	//: Object // tags, status (bronze, silver, gold), isCard:Boolean, rarity){

	// return db.save('Gift', data)

	/*
		name: String,
		photoURL: String, 
		description: String, 
		URL: String, 
		price: Number, 
		sended:Object,
		date:Date,

		properties: Object // tags, status (bronze, silver, gold), isCard:Boolean, rarity
	*/
	var obj = {
		name:name,
		photoURL:photoURL,
		description:description,
		price:price,
		properties:properties
	};
	return Gifts.save(obj)
}

function cards(rarity){
	var obj = {	'properties.isCard': true	}
	if (rarity || rarity==0) obj['properties.rarity'] = parseInt(rarity);

	// var obj = {	
	// 	properties: { 
	// 		isCard: true
	// 	}
	// }
	// if (rarity || rarity==0){
	// 	obj.properties.rarity = parseInt(rarity);
	// } //obj['properties.rarity'] = rarity;

	return Gifts.list(obj)
}

function remove(id){
	return Gifts.remove({_id:id})
}

var usergifts = {
	saveGift: function (login, giftID, isCard, colour){
		var usergift = {
			userID: login,
			giftID: giftID
		}
		if (isCard) usergift.isCard = true;
		if (colour) usergift.colour = colour;
		// console.log(arguments, usergift);

		return UserGifts.save(usergift)
	},
	cards: function (login){
		return UserGifts.list({ userID: login, isCard:true})
	},
	remove: function (id){
		return UserGifts.remove({_id:id})
	},
	clearAllByUsername: function(login){
		console.log(login);
		return UserGifts.remove({ userID: login})
	}
}
// addCard()
// add({})

// Tests

// addCard('CR7', 'C. Ronaldo', '7.png', 100, c.RARITY_RARE, {})
// addCard('Luka', 'L. Modric', '19.png', 100, c.RARITY_MID, {})
// addCard('NachoFernandez', 'Nacho', '6.png', 100, c.RARITY_HIGH, {})

// addCard('Navas', 'K. Navas', '1.png', 100, c.RARITY_RARE, {})
// addCard('Kroos', 'T. Kroos', '8.png', 100, c.RARITY_LOW, {})
// addCard('Ramos', 'S. Ramos', '4.png', 100, c.RARITY_MID, {})
// addCard('Pepe', 'Pepe', '3.png', 100, c.RARITY_HIGH, {})

// addCard('Navas', 'K. Navas', '1.png', 100, c.RARITY_RARE, {})
// addCard('Kroos', 'T. Kroos', '8.png', 100, c.RARITY_LOW, {})
// addCard('Ramos', 'S. Ramos', '4.png', 100, c.RARITY_MID, {})
// addCard('Pepe', 'Pepe', '3.png', 100, c.RARITY_HIGH, {})

// Gifts.remove('56f441619ad2d41e16ed5deb')
// Gifts.remove('56f4417e5b045a36164cacf1')
// Gifts.remove('56f441b96503456116047c9c')
// Gifts.remove('56f441cc7fda106f16e70c6c')

// all({})
// // getByID('5622b320ecdf83f91ef09036')
// Gifts.update()
// .then(console.log)
// .catch(console.error)

module.exports = {
	all: all,
	getByID: getByID,
	add: add,
	addCard: addCard,
	cards: cards,
	remove: remove,

	user: usergifts
}