var Gifts = require('./gifts')

var c = require('../constants')

var multiplier = 1000000;

var CHANCE_RARE = 100
var CHANCE_LOW = 1000
var CHANCE_MID = 10000
var CHANCE_HIGH = 500000

	// ,RARITY_RARE: 0
	// ,RARITY_LOW: 1
	// ,RARITY_MID: 2
	// ,RARITY_HIGH: 3

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRarity(){
	var num = getRandomInt(1, multiplier);

	if (num	> CHANCE_MID) return c.RARITY_HIGH;

	if (num > CHANCE_LOW) return c.RARITY_MID;

	if (num > CHANCE_RARE) return c.RARITY_LOW;

	return c.RARITY_RARE;

	// if (num< CHANCE_RARE) return c.RARITY_RARE;

	// if (num< CHANCE_LOW) return c.RARITY_LOW;

	// if (num< CHANCE_MID) return c.RARITY_MID;

	// return c.RARITY_HIGH
}


var cardHandler = {};
cardHandler[c.RARITY_RARE] = []
cardHandler[c.RARITY_LOW] = []
cardHandler[c.RARITY_MID] = []
cardHandler[c.RARITY_HIGH] = []

// Gifts.cards()
// .then(function (cards){
// 	console.log('cards', cards);
// })
fillCardHandler();
function getCardsByRarity(rarity){
	Gifts.cards(rarity)
	.then(function (cards){
		// console.log('cards', cards);
		cardHandler[rarity] = cards;
	})
}

var stats = {0:0, 1:0, 2:0, 3:0}

function fillCardHandler(){
	getCardsByRarity(c.RARITY_RARE);
	getCardsByRarity(c.RARITY_LOW);
	getCardsByRarity(c.RARITY_MID);
	getCardsByRarity(c.RARITY_HIGH);
}

// setInterval(function(){
// 	var crd = get_random_card();

// 	// console.log(crd);
// }, 10)

// setInterval(function(){
// 	console.log('stats', stats);
// }, 3000)

function get_random_card() {
	var rarity = getRandomRarity();
	stats[rarity]++;

	var max = cardHandler[rarity].length;
	var offset = getRandomInt(0, max - 1)

	var card = cardHandler[rarity][offset];
	if (!card) {
		console.log(max, offset, cardHandler[rarity]);
	} else{
		// console.log(card.name);
	}
	return card;
}

module.exports = {
	get_random_card: get_random_card
}