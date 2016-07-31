var Gifts = require('./gifts');

var db = require('../db');
var Packs = db.wrap('Pack');

var c = require('../constants');

var multiplier = 100;//0000;

var packs= [];

var afterGamePack = {
	packID: 0, price:0, image:'3.jpg',
	colours: [0, 0, 1, 3, 96],
	available: true, visible: false

	// multiplier:100,
	// items: Array,
};

var poorPack = {
	packID:1, price:1, image:'3.jpg',
	colours: [0, 1, 199, 300, 600],
	available:true, visible: true

	// multiplier: 100,
	// items:Array,
};

var goodPack = {
	packID:2, price:10, image:'0.jpg',
	colours: [0, 1, 29, 70, 0],
	available: true, visible: true

	// multiplier:Number,
	// items:Array,
};

var excellentPack = {
	packID:3, price:25, image:'0.jpg',
	colours: [0, 5, 30, 65, 0],
	available: true, visible: true
};


var stdPacks = [afterGamePack, poorPack, goodPack, excellentPack];

// ,CARD_COLOUR_GRAY:4

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




function addStd(){
	return add(afterGamePack)
	.then(function (result){
		return add(poorPack)
	})
	.then(function (result){
		return add(goodPack)
	})
	.then(function (result){
		return add(excellentPack)
	})
}

function add(new_pack){
	var packID = new_pack.packID;
	return Packs.find({packID: packID})
	.then(function (pack){
		// if (pack) throw 'pack with same id exists ' + packID;
		if (pack) return null

		return Packs.save(new_pack);
	})
}

// function userpacks(){ return Packs.list({ available:true, visible:true })}
function all(){ return Packs.list({ }) }
function availablePacks(){ return Packs.list({ available: true }) }
function remove(packID){ return Packs.remove({ packID: packID }) }
function removeAll(){ return Packs.remove({ }) }
function update(){ initialize(); }

function edit(packID, data){
	return Packs.update({packID: packID}, {$set: data})
}

var initialized = false;
function initialize(){
	availablePacks()
	.then(function (listOfPacks){
		if (!listOfPacks || listOfPacks.length==0){
			addStd()
			return stdPacks;
		}
		return listOfPacks;
	})
	.then(function (listOfPacks){
		packs = listOfPacks;
		// console.log(packs);

		for (var i = packs.length - 1; i >= 0; i--) {
			fillColourHandler(packs[i])
		};

		return Gifts.cards(null)
	})
	.then(function (cards){
		initialized = true;

		cardHandler = cards;
		// console.log('initialize', cardHandler);
		// console.log('', colourHandler[0].length, colourHandler[1].length, colourHandler[2].length);


		// runTests();
	})
}

var colourHandler = {}
var cardHandler = [];

function info(){
	return {
		colourHandler:colourHandler,
		cardHandler:cardHandler,
		packs:packs
	}
}

// initialize();

function fillColourHandler(pack){
	var packID = pack.packID;
	colourHandler[packID] = [];

	var colours = pack.colours; //[0, 1, 3, 96]; //
	for (var i = colours.length - 1; i >= 0; i--) {
		for (var j = 0; j < colours[i]; j++){
			colourHandler[packID].push(i)
		}
	}
	// console.log('fillColourHandler', pack, colours, colourHandler[packID].length)
}

function getCardsByRarity(rarity){
	return Gifts.cards(rarity)
	.then(function (cards){
		cardHandler = cards;
		console.log('getCardsByRarity', rarity, cardHandler);
	})
}

function getRandomCard(packID) {
	var max = cardHandler.length;
	var offset = getRandomInt(0, max - 1);

	return cardHandler[offset];
}

function getRandomColour(packID) {
	var max = colourHandler[packID].length;
	var offset = getRandomInt(0, max - 1);

	return colourHandler[packID][offset] || c.CARD_COLOUR_GRAY;
}

function cloneCard(card, colour){
	return {
		giftID: card._id,

		description: card.description,
		name: card.name,
		photoURL: card.photoURL,
		price: card.price,
		properties: card.properties,

		colour: colour
	}
}

function get_random_card(packID) {
	var card = getRandomCard(packID);
	var colour = getRandomColour(packID);

	var crd = cloneCard(card, colour);

	return crd;
}

function get_after_game_card(){
	return get_random_card(0)
}

// coloured

module.exports = {
	get: function (packID) {
		return get_random_card(packID || 0)
	},
	get_after_game_card: get_after_game_card,
	available: availablePacks,
	all: all,
	update: update,
	remove: remove,
	removeAll: removeAll,
	info:info,
	edit:edit
	// userpacks:userpacks
}

function runTests(){
	// get_random_card(0)

	// TestRandomizer()
	// showStats();
}
var stats = {
	cards:{},
	colours:{}
};

function showStats(){
	setInterval(function(){
		console.log(stats);
	}, 1000)
}

function TestRandomizer(){
	setTimeout(function(){
		setInterval(function(){
			var crd = get_after_game_card()

			if (!stats.cards[crd.name]) stats.cards[crd.name] =0;
			stats.cards[crd.name]++;

			if (!stats.colours[crd.colour]) stats.colours[crd.colour] = 0;
			stats.colours[crd.colour]++;

			// console.log(crd);
		}, 1)
	}, 3000)

}

var objects = [];
var mln = { giftID: 'a0192ej0iqjsd', colour: 2 }

function Test2(){
	console.time('start');
	for(var i=0;i< 1000000; i++){
		objects.push(mln);
	}
	console.timeEnd('start');
	console.log(objects.length);
}

// Test2();
// TestRandomizer()