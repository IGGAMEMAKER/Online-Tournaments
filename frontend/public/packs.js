var cardField= "#cards";


function openPack(value){
	mark('openPack/'+value)
	news.hide();
}

var cardsDefault = {}

function drawCards(cards){
	var text = '';
	for (var i=0;i<cards.length; i++){
		var card = cards[i];

		cardsDefault[card._id] = card;
		// text += '<div class="col-sm-2 col-md-2 col-xs-6">' + drawCard(card);
		// text += '<p class="card-name white">' + card.description + '</p>';
		// text += '</div>';
	}
	$(cardField).append(text);
}
var collections = {}
// collections[1] = { have:1, need:10 }
// collections[2] = { have:5, need:10 }
// collections[3] = { have:7, need:10 }
// collections[4] = { have:9, need:10 }

function pickPhraseByColour(colour){
	switch(colour){
		case c.CARD_COLOUR_GRAY:
			return 'Собери "серую" команду и получи ускоритель 4!';
		break
		case c.CARD_COLOUR_GREEN:
			return 'Собери "зелёную" команду и получи 10 зелёных паков!';
		break;
		case c.CARD_COLOUR_RED:
			return 'Собери "красную" команду и получи 1000 рублей на счёт!';
		break;
		case c.CARD_COLOUR_BLUE:
			return 'Собери "синюю" команду и получи 10 синих паков!'
		break;
	}
}

function pickSameColourCards(myCards, colour){
	var list =[];
	for (var i = myCards.length - 1; i >= 0; i--) {
		if (myCards[i]._id.colour==colour){
			list.push(myCards[i])
		}
	};
	return list;
}

var CollectionList = {}

// collectionID=>{
// 	id=>1 'exists'
// }

// CollectionList[c.CARD_COLOUR_BLUE] = {}
// CollectionList[c.CARD_COLOUR_GREEN] = {}
// CollectionList[c.CARD_COLOUR_RED] = {}
// CollectionList[c.CARD_COLOUR_GRAY] = {}

function showCollections(collections, myCards){
	console.log(myCards, collections);

	for (var i=0; i < collections.length; i++) {
		var list = pickSameColourCards(myCards, collections[i].colour);
		console.log(list);
		showCollection(collections[i], list)
	}
}

function findEqualities(sameColourCardsList, collection_list){
	// two variants:
	// 	collection.length is bigger than sameColourCardsList
	// 	or is less
	var have = 0;
	for (var i = sameColourCardsList.length - 1; i >= 0; i--) {
		var giftID = sameColourCardsList[i]._id.giftID;
		if (collection_list[giftID] == 1) have++;
	};
	return have;
}

function showCollection(collection, sameColourCardsList){
	var text = '';
	var colour = collection.colour;
	var collectionID = collection.name;// must be _id!!!
	var list = collection.list;
	var need = list.length;
	
	var phrase = pickPhraseByColour(colour);


	text += '<div class="col-sm-12">';
	text += '<h1 class="mg-md text-center">' + phrase + '</h1>';
	CollectionList[collectionID] = {}
	
		for (var i=0;i<list.length; i++){
			//fillCollectionList
			var collectionGiftID = list[i];
			CollectionList[collectionID][collectionGiftID] = 1;

			// console.log('list[i]', collectionGiftID)
			var card = getCardFromDefault(collectionGiftID, colour);

			// cardsDefault[card._id] = card;
			text += '<div class="col-sm-3 col-md-3 col-xs-12">' + drawCard(card);
			text += '<p class="card-name white">' + card.description + '</p>';
			text += '</div>';
		}

	var have = findEqualities(sameColourCardsList, CollectionList[collectionID]);// 1; // have = function(sameColourCardsList, collection)
	text += '<a href="/Cards"><h3> Собрано: ' + have + '/' + need + '</h3></a>'
	var buttonStatus = 'disabled';

	if (need>0 && have==need){
		// make GIVE ME REWARD active
		buttonStatus = 'enabled'
	}
	text += '<button '+buttonStatus+ ' class="btn btn-success" onclick="rewardme('+collectionID+')">Получить награду</button>'
	text += '</div>'
	// }
	document.write(text);
	// $(cardField).append(text);
}

function rewardme(collectionID){
	mark('rewardme/'+collectionID)
}

// function showCollection(cards, colour){
// 	var text = '';
// 	var colour;
// 	// for (var j=1;j<5; j++){
// 		// colour = j;
// 		text += '<a href="/Cards"><h3> Собрано: ' + collections[colour].have + '/' + collections[colour].need + '</h3></a>'
// 		for (var i=0;i<cards.length; i++){
// 			var card = getCardFromDefault(cards[i]._id, colour);

// 			// cardsDefault[card._id] = card;
// 			text += '<div class="col-sm-2 col-md-2 col-xs-12">' + drawCard(card);
// 			text += '<p class="card-name white">' + card.description + '</p>';
// 			text += '</div>';
// 		}
// 	// }
// 	document.write(text);
// 	// $(cardField).append(text);
// }

function drawPackButton(){
	var crd = {
		photoURL: 'pack.png',
		colour: 0
	}
	
	var text = '<div style="margin:20px">';

	var pack_prices = { 1:70, 2:50, 3:30, 4:10 }
	for (var i=1; i<=4; i++) {
		crd.colour = i

		// text += '<center>'
		// text += '<div style="width:100%;" >'
		text += '<div class="col-sm-3 col-md-3 col-xs-6">' // style="margin: auto;"
		text += drawCard(crd);
		text += '<button class="btn btn-primary btn-lg full" onclick="openPack('+i+')"> Открыть ('+pack_prices[i]+'р) </button>'
		text += '</div>'
		// text += '</div>'
		// text += '</center>'
	}
	text += '</div>'
	
	document.write(text)
}

function getCardFromDefault(id, colour){
	var card = cardsDefault[id];
	var crd = {
		giftID: card._id,

		description: card.description,
		name: card.name,
		photoURL: card.photoURL,
		price: card.price,
		properties: card.properties,

		colour: colour
	}
	return crd;
}

function drawMyCards(cardInfo, myCards){
	var text = '';
	// console.log(myCards);
	console.log(cardsDefault);
	// console.log(myCards[0]._id.colour);

	for (var i = myCards.length - 1; i >= 0; i--) {//myCards.length - 1
		// var myCard = 
		var id = myCards[i]._id.giftID
		var colour = myCards[i]._id.colour
		var count = myCards[i].count;

		console.log(myCards[i]._id, myCards[i]._id.colour)

		var card = cardsDefault[id];
		if (!card) continue;
		var crd = {
			giftID: card._id,

			description: card.description,
			name: card.name,
			photoURL: card.photoURL,
			price: card.price,
			properties: card.properties,

			colour: colour
		}
		// card.colour = colour

		text += '<div class="col-sm-2 col-md-2 col-xs-6">' + drawCard(crd);
		// text += '<p class="card-name white">' + crd.description + '</p>';
		var cnt = '';
		if (count>1) cnt = ' ('+count+'x) '
		text += '<p class="card-name white">' + crd.description + cnt + '</p>';
		// text += '<p class="card-name white">' + 'Количество: ' + count + '</p>';
		text += '</div>';
	}
	$(cardField).append(text);
}

