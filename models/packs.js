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
// var CARD_COLOUR_CHANCE_GRAY = 100; //5

var CARD_COLOUR_P_RED = 5; //5%
var CARD_COLOUR_P_BLUE = 15; // 15%
var CARD_COLOUR_P_GREEN = 30; // 30%
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
	var colour_multiplier = colour_chance.multiplier || 100

	var chance_red   = colour_chance.red   || CARD_COLOUR_P_RED
	var chance_blue  = colour_chance.blue  || CARD_COLOUR_P_BLUE
	var chance_green = colour_chance.green || CARD_COLOUR_P_GREEN

	var num = getRandomInt(0, colour_multiplier);

	if (num	> chance_green + chance_blue + chance_red) return c.CARD_COLOUR_GRAY;
	if (num > chance_blue + chance_red) return c.CARD_COLOUR_GREEN;
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

var packGenerator = {
	standard: { multiplier:100, red:5, blue:15, green: 30 }
	,equal: { multiplier:100, red:25, blue:25, green: 25 }
	,afterTournament: { multiplier:10000, red:10, blue:100, green: 2000	}

	,lucky: { multiplier:100, red:70, blue:22, green: 5 }
	,blue:  { multiplier:100, red:20, blue:75, green: 4 }
	,green: { multiplier:100, red:7, blue:15, green: 75 }
}

function TestRandomizer(){
	setTimeout(function(){
		setInterval(function(){
			// var crd = get_random_card({
			// 	multiplier:100,
			// 	red:70,
			// 	blue:15,
			// 	green: 5
			// });
			var crd = get_after_game_card()

			// console.log(crd);
		}, 1)
	}, 3000)

	setInterval(function(){
		var sum = 1;//stats[0] + stats[1]+ stats[2]+ stats[3]+ stats[4]+1;
		console.log('stats',sum, stats[0]/sum, stats[1]/sum, stats[2]/sum, stats[3]/sum, stats[4]/sum);
	}, 3000)
}
// TestRandomizer()

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

function get_standard_pack_card(){
	return get_random_card(packGenerator.standard)
}
function get_lucky_card(){
	return get_random_card(packGenerator.lucky)
}
function get_uniform_card(){
	return get_random_card(packGenerator.equal)
}
function get_after_game_card(){
	return get_random_card(packGenerator.afterTournament)
}

// coloured

function get_red_pack(){
	return get_random_card(packGenerator.lucky)
}

function get_gray_pack(){
	return get_random_card(packGenerator.standard)
}

function get_blue_pack(){
	return get_random_card(packGenerator.blue)
}

function get_green_pack(){
	return get_random_card(packGenerator.green)
}



module.exports = {
	get: function (value){
		switch(value){
			case c.CARD_COLOUR_GRAY: return get_gray_pack(); break;
			case c.CARD_COLOUR_GREEN: return get_green_pack(); break;
			case c.CARD_COLOUR_BLUE: return get_blue_pack(); break;
			case c.CARD_COLOUR_RED: return get_red_pack(); break;
			default: return get_gray_pack(); break;
		}
	},
	get_random_card: get_random_card,
	get_lucky_card: get_lucky_card,
	get_after_game_card: get_after_game_card,
	get_standard_pack_card: get_standard_pack_card,
	get_uniform_card: get_uniform_card,
}