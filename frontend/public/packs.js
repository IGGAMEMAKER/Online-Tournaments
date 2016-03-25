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
/*
	<img border="0" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt=""">
  <img class="cornerimage" border="0" src="http://www.gravatar.com/avatar/" alt="">
*/
	// $(cardField).append('<img border="0" style="background-color:blue" src="/img/topics/realmadrid/'+card.photoURL+'">')

	// $(cardField).append('<img border="0" style="background-color:blue" src="http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg">')
	// $(cardField).append('<img class="cornerimage" border="0" src="/img/topics/realmadrid/'+card.photoURL+'">')
	// $(cardField).append('<div>')
	var backgroundImage = '\'http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg\''
	// var backgroundImage = '\'img/cardLayers/gold.jpg\''
	$(cardField).append('<img border="0" style="background-image:url('+backgroundImage+')" src="/img/topics/realmadrid/'+card.photoURL+'">')
	
	// $(cardField).append('<img border="0" style="background-color:blue" src="/img/topics/realmadrid/'+card.photoURL+'">')
	// $(cardField).append('<img class="cornerimage" border="0" src="http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg" />')
	// $(cardField).append('<img class="cornerimage" border="0" src="http://www.gravatar.com/avatar/" />')
}