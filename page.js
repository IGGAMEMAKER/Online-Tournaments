/*

document.write("<div class=\"col-sm-3\">");
document.write("				<h4 class=\"mg-md text-center\">");
document.write("					Ping pong");
document.write("				<\/h4><img src=\"img\/broken-img.png\" class=\"img-rd-lg\" width=\"210\" height=\"150\" \/>");
document.write("				<h3 class=\"mg-md\">");
document.write("					Free");
document.write("				<\/h3>");
document.write("				<p>");
document.write("					Playres:<br \/>Winers:<br \/>Time:<br \/>Questions:");
document.write("				<\/p>");
document.write("				<center><a href=\"index.html\" class=\"btn btn-lg btn-primary\" style=\"width:60%; border-radius:0;\">Play<\/a><\/center>");
document.write("			<\/div>");*/



function print_tournament(t, imageUrl){
	var ID=t.ID||115;
	//t.goNext = [2];
	var registered = 1;
	var gameNameID = t.gameNameID;

	var prizes = t.Prizes[0];
	
	var maxPlayers = t.goNext[0];
	var winnersPlaces = t.goNext[1];

	var buyIn = t.buyIn || 0;

	var strVar="";
	strVar += "<div class=\"col-sm-3\"><center>";
	strVar += "				<h4 class=\"mg-md text-center\"";
	strVar += get_gameName(ID, gameNameID);
	strVar += "				<\/h4>"
	strVar += "<img src=\""+imageUrl+"\" class=\"img-rd-lg\" width=\"210\" height=\"150\" \/>";

	strVar += "				<h3 class=\"mg-md\">";
	strVar += get_price_word(buyIn);
	strVar += "				<\/h3>";

	strVar += drawPrizes(ID, prizes);
	strVar += "				<h4>";
//	strVar += "					Playres:<br \/>Winers:<br \/>Time:<br \/>Questions:";
	strVar += get_winners_word(ID, winnersPlaces);
	strVar += get_players_word(ID, maxPlayers, registered);
	strVar += "				<\/h4>";
	strVar += "				<a href=\"index.html\" class=\"btn btn-lg btn-primary\" style=\"width:60%; border-radius:16px; \"> Играть <\/a>";//#2780e3
	strVar += "			<\/center><\/div>";
	
	return strVar;
}

var enter="<br ";



function get_price_word(buyIn){
	if (buyIn>0) return 'Стоимость: ' + buyIn+'$';
	return 'Бесплатно';
}

function get_players_word(ID, max, registered){
	var word = enter + "id=\"plrs-"+ID+"\"> Игроки: "+registered+"/"+max;//+"</p>";
	return word;
}

function get_gameName(ID, gameNameID){
	var gname='Questions';
	switch(gameNameID){
		case 1: gname = 'Questions'; break;
		case 2: gname = 'Ping pong'; break;
	}
	var word = "id=\"gname-"+ID+"\">"+gname;//"</p>";
	return word;
}

function get_winners_word(ID, winnersPlaces){
	var word = enter + "id=\"wnrs-"+ID+"\"> Призовых мест: "+winnersPlaces;//+"</p>";
	return word;
}


function get_prizes_word(ID, prizes){
	/*var word = "<h4 id=\"wnrs-"+ID+"\"> Выигрыш: "+prizes +"</h4>";
	return word;*/
	return "Приз: "+prizes;
}

function drawPrizes(ID, prizes){
	return "<h4 id=\"wnrs-"+ID+"\">"+get_prizes_word(ID,prizes)+"</h4>";
	//return get_prizes_word(ID,prizes);
}