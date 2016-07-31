var db = require('../db');
var Gifts = db.wrap('Gift');
var UserGifts = db.wrap('UserGift');

var c = require('../constants');

function all(){
	// return db.list('Gift', query)
	return Gifts.list({})
}

function get(query) {
	return Gifts.list(query);
}

function getByID(giftID){
	// return db.findOne('Gift', { _id : giftID })
	return Gifts.findOne({ _id : giftID })
}

function add(name, photoURL, description, URL, price, sended, date, properties) {
	//: Object // tags, status (bronze, silver, gold), isCard:Boolean, rarity){

	var obj = {
		name:name,
		photoURL:photoURL,
		description:description,
		price:price,
		properties:properties
	};
	return Gifts.save(obj)
}

function addCard(name, description, photoURL, price, rarity, tags) {
	var obj = {
		name: name,
		photoURL: photoURL,
		price: price,
		description: description
	};

	var properties = {
		rarity: rarity,
		isCard: true
	};

	if (tags) properties.tags = tags;

	obj.properties = properties;
	return Gifts.save(obj);
}

function remove(id) {
	return Gifts.remove({_id: id});
}

function edit(id, newGift) {
	return Gifts.update({_id: id}, newGift);
}

function cards(rarity){
	var obj = {	'properties.isCard': true	};

	if (rarity || rarity == 0) {
		obj['properties.rarity'] = parseInt(rarity);
	}

	return Gifts.list(obj)
}


var usergifts = {
	saveGift: function (login, giftID, isCard, colour){
		var usergift = {
			userID: login,
			giftID: giftID
		};

		if (isCard) usergift.isCard = true;
		if (colour) usergift.colour = colour;

		return UserGifts.save(usergift)
	}
	,all: function (){
		return UserGifts.list({})
	}
	,cards: function (login){
		return UserGifts.list({ userID: login, isCard:true})
	}
	,usergiftsWhichFitCollection: function(login, colour, giftIDs){
		return UserGifts.list({ userID: login, colour:colour, giftID : {$in: giftIDs } })
	}
	,cardsGroup: function (login){
		var obj = [
		{
			$match: { userID: login}
		}
		,{
			$group: {
				// _id: "$giftID",
				_id: { giftID: "$giftID", colour: "$colour" },
				// colour: "$colour",
				count: { $sum: 1 }
			}
		},
		{
			$sort: { '_id.colour' :-1}
		}];
		return UserGifts.aggregate(obj)
	}
	,remove: function (id){
		return UserGifts.remove({_id:id})
	}
	,removeGroup: function (list){
		return UserGifts.remove({_id: {$in: list} })
	}
	,clearAllByUsername: function(login){
		console.log(login);
		return UserGifts.remove({ userID: login})
	}
};

module.exports = {
	all,
	getByID,
	add,
	addCard,
	cards,
	remove,
	edit,
	get
};


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
// usergifts.cardsGroup('23i03g')
// .then(console.log)
// .catch(console.error)
