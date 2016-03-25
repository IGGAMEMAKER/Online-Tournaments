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
	// document.write(JSON.stringify(card))
/*
	<img border="0" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt=""">
  <img class="cornerimage" border="0" src="http://www.gravatar.com/avatar/" alt="">
*/
	// $(cardField).append('<img border="0" style="background-color:blue" src="/img/topics/realmadrid/'+card.photoURL+'">')

	// $(cardField).append('<img border="0" style="background-color:blue" src="http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg">')
	// $(cardField).append('<img class="cornerimage" border="0" src="/img/topics/realmadrid/'+card.photoURL+'">')
	// $(cardField).append('<div>')
	var backgroundImage = '\'http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg\''
	var backgroundImage = '\'https://i.ytimg.com/vi/nKbQqN8sazg/maxresdefault.jpg\''
	var backgroundImage = '\'http://img15.nnm.me/3/3/c/6/f/ab1fb05250ab9dde13490a37bed.jpg\''
	var backgroundImage = '\'http://m-static.flikie.com/ImageData/WallPapers/d1b8dc2a2b424a6fbb5b55cdaee405cf.jpg\''
	var backgroundImage = '\'http://www.ujut.hu/img/back.jpg\'' // good one
	var backgroundImage = '\'http://hdoboi.net/uploads/819424_zelenyiy_fon_thumb.jpg\''  //green
	var backgroundImage = '\'http://www.pspinfo.ru/uploads/gallery/main/27/7e3bc.jpg\''  //green
	var backgroundImage = '\'http://sisadmin.justclick.ru/media/content/sisadmin/picture-10426.jpg\''  //green
	// var backgroundImage = '\'img/cardLayers/gold.jpg\''
	// var backgroundImage = '\'img/cardLayers/gold2.jpg\''
	//328 276

	var text = '<div class="col-sm-4 col-md-4 col-xs-12">'
	text+= '<img border="0" class="card img-wrapper" style="background-image:url('+backgroundImage+')" src="/img/topics/realmadrid/'+card.photoURL+'">'
	text+= '</div>';
	$(cardField).append(text);

/*	$(cardField).append('<div class="col-sm-4">')
	$(cardField).append('<img border="0" class="card img-wrapper" style="background-image:url('+backgroundImage+')" src="/img/topics/realmadrid/'+card.photoURL+'">')
	$(cardField).append('</div>')*/
	
	// $(cardField).append('<img border="0" style="background-color:purple" src="/img/topics/realmadrid/'+card.photoURL+'">')
	// $(cardField).append('<img class="cornerimage" border="0" src="http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg" />')
	// $(cardField).append('<img class="cornerimage" border="0" src="http://www.gravatar.com/avatar/" />')
}