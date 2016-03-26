var Gifts = require('./gifts')

var c = require('../constants')

var multiplier = 100;//0000;

// var CHANCE_RARE = 1000
// var CHANCE_LOW = 50000
// var CHANCE_MID = 100000
// var CHANCE_HIGH = 500000

var CHANCE_RARE = 10
var CHANCE_LOW = 30
var CHANCE_MID = 60
// var CHANCE_HIGH = 60

//10

var CARD_COLOUR_CHANCE_RED = 5; //5%
var CARD_COLOUR_CHANCE_BLUE = 20; // 15%
var CARD_COLOUR_CHANCE_GREEN = 50; // 30%
// var CARD_COLOUR_CHANCE_GRAY = 100; //50%

	// ,CARD_COLOUR_RED:1
	// ,CARD_COLOUR_BLUE:2
	// ,CARD_COLOUR_GREEN:3
	// ,CARD_COLOUR_GRAY:4

	// ,RARITY_RARE: 0
	// ,RARITY_LOW: 1
	// ,RARITY_MID: 2
	// ,RARITY_HIGH: 3

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRarity(){
	var num = getRandomInt(0, multiplier);

	if (num	> CHANCE_MID) return c.RARITY_HIGH;

	if (num > CHANCE_LOW) return c.RARITY_MID;

	if (num > CHANCE_RARE) return c.RARITY_LOW;

	return c.RARITY_RARE;

	// if (num< CHANCE_RARE) return c.RARITY_RARE;
	// if (num< CHANCE_LOW) return c.RARITY_LOW;
	// if (num< CHANCE_MID) return c.RARITY_MID;
	// return c.RARITY_HIGH
}
function getRandomColour(colour_chance){
	// var num = getRandomInt(1, 100);
	// if (num	> CARD_COLOUR_CHANCE_GREEN) return c.CARD_COLOUR_GRAY;
	// if (num > CARD_COLOUR_CHANCE_BLUE) return c.CARD_COLOUR_GREEN;
	// if (num > CARD_COLOUR_CHANCE_RED) return c.CARD_COLOUR_BLUE;
	// return c.CARD_COLOUR_RED;
	if (!colour_chance) colour_chance = {}
	var colour_multiplier = colour_chance.multiplier||100,
		chance_red = colour_chance.red||CARD_COLOUR_CHANCE_RED,
		chance_blue = colour_chance.blue||CARD_COLOUR_CHANCE_BLUE,
		chance_green = colour_chance.green||CARD_COLOUR_CHANCE_GREEN;
	var num = getRandomInt(0, colour_multiplier);

	if (num	> chance_green) return c.CARD_COLOUR_GRAY;

	if (num > chance_blue) return c.CARD_COLOUR_GREEN;

	if (num > chance_red) return c.CARD_COLOUR_BLUE;

	return c.CARD_COLOUR_RED;
}


var cardHandler = {};

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

var stats = { counter: 0 }
for (var i = 0; i < 5; i++) {	stats[i] = 0; };

function fillCardHandler(){
	cardHandler[c.RARITY_RARE] = []
	cardHandler[c.RARITY_LOW] = []
	cardHandler[c.RARITY_MID] = []
	cardHandler[c.RARITY_HIGH] = []

	getCardsByRarity(c.RARITY_RARE);
	getCardsByRarity(c.RARITY_LOW);
	getCardsByRarity(c.RARITY_MID);
	getCardsByRarity(c.RARITY_HIGH);
}

function TestRandimizer(){
	setTimeout(function(){
		setInterval(function(){
			var crd = get_random_card();

			// console.log(crd);
		}, 10)
	}, 3000)

	setInterval(function(){
		var sum = stats[0] + stats[1]+ stats[2]+ stats[3]+ stats[4]+1;
		console.log('stats',sum, stats[0]/sum, stats[1]/sum, stats[2]/sum, stats[3]/sum, stats[4]/sum);
	}, 3000)
}
// TestRandimizer()

function get_random_card(colour_chance) {
	var rarity = getRandomRarity();

	var max = cardHandler[rarity].length;
	var offset = getRandomInt(0, max - 1)

	var card = cardHandler[rarity][offset];

	var colour = getRandomColour(colour_chance||null);
	// card.colour = colour;

	var crd = {
		giftID: card._id,

		description: card.description,
		name: card.name,
		photoURL: card.photoURL,
		price: card.price,
		properties: card.properties,

		colour: colour
	}
	// console.log(card, crd);
	stats[colour]++;
	stats.counter++;

	// if (!card) {
	// 	console.log(max, offset, cardHandler[rarity]);
	// } else{
	// 	// console.log(card.name);
	// }
	return crd;
}

module.exports = {
	get_random_card: get_random_card
}