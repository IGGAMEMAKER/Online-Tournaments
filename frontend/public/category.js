var room;

var wanna_play = true;

function joinStream(topic){
	if (wanna_play)	setAsync('/Category/register/'+topic, null, function (msg){
		// alert(JSON.stringify(msg))
	})
}

function drawFrame(msg){
	var gamePort = msg.gamePort;
	var gameHost = msg.gameHost;
	var tournamentID = msg.tournamentID;

	// reconnect(tournamentID, gameHost, gamePort)
	var src = 'http://'+gameHost+':'+gamePort+'/Game?tournamentID='+tournamentID;
	// if (tournamentID) {
	// 	var reg_button = '<a onclick="join('+topic+')" class="btn btn-primary"> Играть </a>'
	// }
	var form = '<form style="display:none;" name="playForm" target="myIframe" action="'+ src + '" method="post">'
	form += '<input type="hidden" name="login" value='+login+' />'
	form += '<input type="submit">'
	form += '</form>'
	/*
<form target="myIframe" action="http://localhost/post.php" method="post">
    <input type="hidden" value="someval" />
    <input type="submit">
</form>
	*/
	var iframe = form + '<div style="background:white" width="100%">'//style="height: 500;"
		// iframe += '<iframe name="myIframe" width="100%" height=600 frameborder=0 src="'+src+'" />'
		iframe += '<iframe name="myIframe" width="100%" height=600 frameborder=0 src="" />'
		iframe += ' </div>'
	$("#play").html(iframe);

	// $("#playForm").submit()
	document.playForm.submit();
}

function addQuestion(){
	var question = $("#question").val();
  var correct = $("#correct").val();//data.correct;

  //
  //data.answer1;
  var answer1 = $("#answer1").val();
  var answer2 = $("#answer2").val();
  var answer3 = $("#answer3").val();
  var answer4 = $("#answer4").val();

  var topic = $("#topic").val();//data.topic;

  var obj = {
  	question:question,
  	correct:correct,

  	answer1:answer1,
  	answer2:answer2,
  	answer3:answer3,
  	answer4:answer4,

  	// topic: topic
  }
  if (topic!="default") obj.topic = topic;
  console.log(obj);
  setAsync("/addQuestion", obj, function (answer){
  	alert(JSON.stringify(answer.msg));
  })
}

function connect(topic){
	room = io('/topic/'+topic)
	
	room.on('wakeUp', function (msg){
		console.log('wakeUp', msg)
		drawFrame(msg)
	})

	room.on('online', function (msg){
		console.log('online', msg)
		joinStream(topic);
	})

	room.on('onliners', drawOnliners)
}

function drawOnliners(msg){
	console.log('drawOnliners', msg)
	var players = msg;
	$("#onliners").html('<b>Сейчас играют </b><br>');

	for (var i = players.length - 1; i >= 0; i--) {
		var login = players[i]
		$("#onliners").append(login+'<br>');
	};
}

function join(topic){

}

function drawCategory(name, href, image){
	var text = '';
			text += '<div class="col-sm-3 white img-wrapper">';
			text += '<center>'
				text += '<a href="'+ href + '">'; ///Category/'+category.name+'
					text += '<img class="img-responsive circle-md" src="'+image+'" />'
					text += '<p>' + name + '</p>'
				text+= '</a>'
			text+= '</center>'
		text+= '</div>'
		return text;
}

function getCategories(){
	setAsync("/api/categories/available", {}, function (msg){
		var categories = msg.msg;
		var text = '<h1 class="white text-center"> Темы </h1>'
		// console.log(categories)
		for (var i=0; i < categories.length && i < 3; i++){
				var category = categories[i];
				// console.log('category', category)
				text += drawCategory(category.draw.name, '/Category/'+ category.name ,category.draw.imgSmall)
		}
		text += drawCategory('Все темы', '/Categories', '/img/topics/default.jpg')
		console.log(text)
		// text = JSON.stringify(categories);
		// $("#categories").html(JSON.stringify(categories))
		$("#categories").html(text)
	}, 'GET')
}

function reconnect(tournamentID, gameHost, gamePort){
	con = 'http://' + gameHost+':' + gamePort + '/'+tournamentID;

	console.log(con)
	room = io.connect(con);
}