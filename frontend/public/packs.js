var cardField= "#cards";


function openPack(){
	mark('openPack')
	news.hide();
}

function drawCards(cards){
	var text = '';
	for (var i=0;i<cards.length; i++){
		text += '<div class="col-sm-4 col-md-4 col-xs-12">' + drawCard(cards[i]);
		text += '<p class="card-name white">' + cards[i].description + '</p>';
		text += '</div>';
	}
	$(cardField).append(text);
}

