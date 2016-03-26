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
		// text += '<div class="col-sm-4 col-md-4 col-xs-12">' + drawCard(card);
		// text += '<p class="card-name white">' + card.description + '</p>';
		// text += '</div>';
	}
	$(cardField).append(text);
}

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
		text += '<div class="col-sm-3 col-md-3 col-xs-12">' // style="margin: auto;"
		text += drawCard(crd);
		text += '<button class="btn btn-primary btn-lg full" onclick="openPack('+i+')"> Открыть ('+pack_prices[i]+'р) </button>'
		text += '</div>'
		// text += '</div>'
		// text += '</center>'
	}
	text += '</div>'
	
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
		// text += '<p class="card-name white">' + crd.description + '</p>';
		var cnt = '';
		if (count>1) cnt = ' ('+count+'x) '
		text += '<p class="card-name white">' + crd.description + cnt + '</p>';
		// text += '<p class="card-name white">' + 'Количество: ' + count + '</p>';
		text += '</div>';
	}
	$(cardField).append(text);
}

