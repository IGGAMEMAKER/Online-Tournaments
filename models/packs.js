var Gifts = require('./gifts');
var Promise = require('bluebird');

var db = require('../db');
var Packs = db.wrap('Pack');

var c = require('../constants');

var packs= [];

function getAvailablePacks() {
	cardHolder = {};
	return availablePacks()
		.then(packs => {
			packs.forEach(p => {
				var itemList = [];

				p.items.forEach((giftID, i) => {
					for (var j=0; j < p.probabilities[i]; j++) {
						itemList.push(giftID);
					}
				});

				cardHolder[p.packID] = itemList;
			});
			return 1;
		})
}
var allPacks = [];
function init() {
	getAvailablePacks()
		.then(result => {
			allPacks = result;
			// console.log('getAvailablePacks', result);
			return Gifts.all()
		})
		.then(giftList => {
			giftList.forEach((g, i) => {
				// console.log('giftList foreach', g._id);
				// var gift = Object.assign({}, g);
				gifts[g._id] = g;
			});
			// console.log('ALL GIFTS', gifts);
			return gifts;
		})
		.catch(err => {
			console.log('ERROR IN PACK INITIALIZATION', err);
		})
}

// ,CARD_COLOUR_GRAY:4

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addPack(pack) {
	console.log('addPack in models/packs', pack);
	return Packs
		.aggregate([
			{ $sort : { "packID": -1 } },
			{ $limit : 1 }
		])
		.then(packList => {
			var maxID = -1;
			if (packList.length === 1) {
				maxID = packList[0].packID;
			}
			console.log('addPack', pack, packList, maxID);

			pack.packID = maxID + 1;

			// return pack;
			return Packs.save(pack);
			// 	.then(resolve)
			// 	.catch(reject)
		})
}

// function userpacks(){ return Packs.list({ available:true, visible:true })}
function all(){ return Packs.list({ }) }
function availablePacks(){ return Packs.list({ available: true }) }
function remove(packID){ return Packs.remove({ packID: packID }) }
function removeAll(){ return Packs.remove({ }) }
function update(){
	// initialize();
	init();
}

function edit(packID, data){
	return Packs.update({packID: packID}, {$set: data})
}

var initialized = false;

var colourHandler = {};
var cardHandler = {};

var cardHolder = {};
var colourHolder = {};
var gifts = {};

function info(){
	return {
		colourHandler: colourHandler,
		cardHandler: cardHandler,
		packs: packs
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

function getRandomCard(packID) {
	// console.log('getRandomCard(packID)', packID);
	var max = cardHolder[packID].length;
	var offset = getRandomInt(0, max - 1);
	// console.log('randomCard is', max, offset, cardHolder[packID][offset]);
	return cardHolder[packID][offset];
}

function getRandomColour(packID) {
	var max = colourHolder[packID].length;
	var offset = getRandomInt(0, max - 1);
	// var offset = getRandomInt(c.CARD_COLOUR_RED, max - 1);


	return colourHolder[packID][offset] || c.CARD_COLOUR_GRAY;
	// return c.CARD_COLOUR_GRAY;
}

function cloneCard(giftID, colour) {
	console.log('cloneCard init...', giftID, colour);//, gifts);
	// var card = Object.assign({}, );
	var card = gifts[giftID];
	console.log('cloneCard result is: ', card);
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
	console.log('get_random_card', packID);
	var giftID = getRandomCard(packID);
	var colour = getRandomColour(packID);

	console.log('so, the card is...', giftID, colour);
	var crd = cloneCard(giftID, colour);

	return crd;
}

function get_after_game_card(){
	return get_random_card(0)
}

// coloured

module.exports = {
	get: function (packID) {
		return get_random_card(packID)
	},
	getByID: function (packID) {
		return Packs.findOne({ packID })
	},
	get_after_game_card,
	available: availablePacks,
	all,
	update,
	remove,
	removeAll,
	info,
	edit,
	add: addPack
	// userpacks:userpacks
};

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
			var crd = get_after_game_card();

			if (!stats.cards[crd.name]) stats.cards[crd.name] =0;
			stats.cards[crd.name]++;

			if (!stats.colours[crd.colour]) stats.colours[crd.colour] = 0;
			stats.colours[crd.colour]++;

			// console.log(crd);
		}, 1)
	}, 3000)

}

var objects = [];
var mln = { giftID: 'a0192ej0iqjsd', colour: 2 };

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