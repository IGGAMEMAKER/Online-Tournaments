var cardField= "#cards";


function openPack(){
	mark('openPack')
	news.hide();
}

var cardsDefault = {}

function drawCards(cards){
	var text = '';
	for (var i=0;i<cards.length; i++){
		var card = cards[i];

		cardsDefault[card._id] = card;
		// text += '<div class="col-sm-4 col-md-4 col-xs-12">' + drawCard(card);
		// text += '<p class="card-name white">' + card.description + '</p>';
		// text += '</div>';
	}
	$(cardField).append(text);
}

function drawPackButton(){
	var crd = {
		// description: card.description,
		// name: card.name,
		photoURL: 'pack.png',
		// properties: card.properties,

		colour: 0
	}
	var text = '';
	text += '<center>'
	// text += '<div style="width:100%;" >'
	text += '<div class="col-sm-4 col-md-4 col-xs-12">' // style="margin: auto;"
	text += drawCard(crd);
	text += '<button class="btn btn-primary btn-lg" onclick="openPack()"> Открыть пак за 10 руб </button>'
	text += '</div>'
	// text += '</div>'
	text += '</center>'
	document.write(text)
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

		text += '<div class="col-sm-4 col-md-4 col-xs-12">' + drawCard(crd);
		text += '<p class="card-name white">' + crd.description + '</p>';
		text += '<p class="card-name white">' + 'Количество: ' + count + '</p>';
		text += '</div>';
	}
	$(cardField).append(text);
}

