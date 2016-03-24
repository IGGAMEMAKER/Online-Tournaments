var cardField= "#cards";


function openPack(){
	mark('openPack')
}

function drawCards(cards){
	for (var i=0;i<cards.length; i++){
		drawCard(cards[i]);
	}
}

function drawCard(card){
	document.write(JSON.stringify(card))

	$(cardField).append('<img src="/img/topics/realmadrid/'+card.photoURL+'">')
}