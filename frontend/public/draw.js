var PLAY_FIELD='#tournaments';
var PLAY_FIELD='#playButtons';
var BUTTON_FIELD="#modal-body";
var myModal = '#myModal';
var payModal = '#payModal';

//var PLAY_FIELD='#news';

/*function drawButton(host, port, tournamentID){
  var parameters = '\''+host +'\','+port+','+tournamentID; // prt(parameters);
  var text = '<button onclick="startGame(' + parameters + ')" style="width:300px;height:60px;"> PLAY '+tournamentID+'</button><br>';//"' + gameURL + '"// prt(text);
  
  $(BUTTON_FIELD).append(text);
  console.log('appended: ' + host, port, tournamentID);
}*/

function drawButton(host, port, tournamentID){
  var parameters = '\''+host +'\','+port+','+tournamentID; // prt(parameters);
  var text = '<button onclick="startGame(' + parameters + ')" style="width:300px;height:60px;"> PLAY '+tournamentID+'</button><br>';//"' + gameURL + '"// prt(text);
  

  var addr = 'http://'+host+':'+port+'/Game?tournamentID='+tournamentID;
    
  var txt = '<p>AAAAAAAA</p>';

  var onclick = "mark('mark/game/push')";//, { login:login }
  // console.log(onclick);

  txt='<form id="form1" method="post" onclick="'+ onclick + '" action="'+addr+'"  target="_blank"> '

  +'<input type="hidden" name="login" value="'+login+'" />'
  +'<input type="submit" class="btn btn-default" value="Сыграть в турнир #'+tournamentID+'" />'
  +'</form>';

  // console.log('drawButton', txt);
  
  $(BUTTON_FIELD).append(txt);
  //console.log('appended: ' + host, port, tournamentID);

  /*var wind = window.open('', 'TheWindow');
  document.getElementById('TheForm').submit();
  wind.focus();*/
}


function drawPlayButtons(){
  // console.log('------------\ndrawPlayButtons');
  runningCount=0;
  var tournaments = getTournaments();        // prt(tournaments);
  var addresses   = getObject('addresses');  // console.log('addresses',addresses);

  //$(PLAY_FIELD).html('<p onclick="closePopup(\'tournaments\');"> CLOSE </p>'); // drawHideLink
  
  if (tournaments && addresses){
    //clearButtonField();
    // console.log('clearButtonField');
    $(BUTTON_FIELD).html('<br />');

    for (var i = tournaments.length - 1; i >= 0; i--) {
      var tournamentID = tournaments[i]; // console.log(tournamentID);
      var address = getAddressFromAddrList(addresses, tournamentID);
      //var address = addresses[tournamentID];//);
      //console.log(address);
      if (address) {
        
        runningCount++;
        
        drawButton(address.host, address.port, tournamentID);

        //if (!play_button_exists(tournamentID))
      }
    }
  }

  if (runningCount==0) { 
    // console.log('no tournaments. runningCount=0');
    $(BUTTON_FIELD).append('Нет запущенных турниров'); //closePopup('tournaments');
    //drawPopup();
  } else {
    drawPopup();
  }
}

/*setTimeout(function(){
$(winnerModal).modal('show');
  
}, 2000);*/

const EVENT_TYPE_WIN_MONEY=0;
const EVENT_TYPE_WIN_RATING=1;
const EVENT_TYPE_WIN_SPECIAL_PRIZE=2;
const EVENT_TYPE_WIN_GIFT=4;

const EVENT_TYPE_LOSE = 5;

var winnerModal = "#winnerModal";
function showWinnerModal(msg){
  console.log('showWinnerModal', msg);
  var winners = msg.winners;//.scores;
  var winnerCount = msg.count;
  var prizes = msg.prizes;
  
  var tournamentID = msg.tournamentID;


  var message = "";//message
  var eventType=EVENT_TYPE_LOSE;

  for (var i = 0; i < winners.length && i<winnerCount; i++) {
    var winner = winners[i];
    //message += JSON.stringify(winner);

    if (winners[i].login==login){
      if (prizes[0]<2){
        eventType = EVENT_TYPE_WIN_RATING;
      } else {
        eventType = EVENT_TYPE_WIN_MONEY;
      }

      break;
    }
  };

  if (prizes[0] < 2 && eventType == EVENT_TYPE_LOSE){
    eventType = EVENT_TYPE_WIN_RATING;
  }

  showEvent(tournamentID, prizes, eventType);
  $(winnerModal).modal('show');

  //if (message.length<3); message = 'Увы, '
/*$(winnerModal+"Msg").html(message);*/
  //$(winnerModal+"Footer").html(getAfterGameButtons);
}

function setWinnerBody(message) { $(winnerModal+"Msg").html(message); }
function setWinnerFooter(message) { $(winnerModal+"Footer").html(message); }

function main(message){
  return '<h3>' + message + '</h3>';
}

function showEvent(tournamentID, prizes, eventType){
  console.log('showEvent', arguments);

  var body = getAfterGameBody(tournamentID, prizes, eventType);
  var footer = getAfterGameFooter(tournamentID, prizes, eventType);

  // if there will be another events, you can always rewrite body/footer variables here
  // e.g. check cookies for subscribing your group

  setWinnerBody(body);
  setWinnerFooter(footer);
}

function makeShareUrl(url, title, description, image, noparse){
  if (!url) url = "http://online-tournaments.org/";

  if (!title) title = "Онлайн турниры";
  if (!description) description = "Участвуй в викторинах и выигрывай призы!";
  if (!image) image = "http://theartmad.com/wp-content/uploads/2015/08/Football-Stars-Wallpaper-1.jpg";
  noparse = true;

  return "http://vk.com/share.php?url="+url+"&title="+title+"&description="+description+"&image="+image+"&noparse=true";
}

function shareLink(text, className, obj){
  return '<a href="'+makeShareUrl(obj.url||null, obj.title||null, obj.description||null, obj.image||null)+'" target="_blank" class="'+className+'" >' + text + '</a>';
}

function add_questions_button(){
  return '<a href="addQuestion" target="_blank" class="btn btn-lg btn-primary"> Добавить свои вопросы </a>';
}

function add_new_tournament_button(){
  //return '<a href'
}

function fast_register_button(){
  return '<a class="btn btn-lg btn-primary" onclick="autoreg()"> Задать всем жару! </a>';
}

function continue_playing_button(){
 return '<a class="btn btn-lg btn-primary" onclick="autoreg()"> Продолжить играть! </a>'; 
}

function drawAutoReg(anchor){
  $(anchor).append(autoRegButton());
}

function autoRegButton(){
 return '<a class="btn btn-primary center-block" style="margin-top:8px;" onclick="autoreg()"> Играть! </a>';  
}

function joinVk_button(){
  //return '<a '
}

function shortenizeLogin(login) { return login; }

function prizeByPlace(place, prizeList){
  if (place>=prizeList.length) return 0;

  return prizeList[place];
  /*switch(place){
    case 0:
      return 100;
    break;
    case 1:
      if (length>30) return 50;
      return 0;
    break;
    default:
      return 0;
    break;
  }*/
}

const DEFAULT_MARATHON_PRIZE = 100;

function getPrizeList(prizes, counts){
  if (prizes.length==0 || counts.length==0){
    return [DEFAULT_MARATHON_PRIZE];
  }

  var prizeList = [];
  for (var i = 0; i < prizes.length; i++) {
    var prize = prizes[i];

    for (var j = 0; j < counts[i]; j++) {
      prizeList.push(prize);
    };
  };
  // console.log('prizeList', prizeList);
  return prizeList;
}

function drawRating(msg){
  if (msg && msg.leaderboard){
    var leaders = msg.leaderboard;
    // console.log('drawRating', msg);
    var prizeList = getPrizeList(msg.prizes||[], msg.counts||[]);
    var rating = "#ratingTab";
    $(rating).html("");

    for (var i=0; i<leaders.length;i++){
      var lgn = leaders[i].login;
      var count = leaders[i].played;
      var points = leaders[i].points;
      var prize = prizeByPlace(i, prizeList);
      var number = i+1;
      var style="";

      var shortedLogin = shortenizeLogin(lgn);

      var text = '';

      if (getLogin()==lgn) { style = "color:red;"}
      var acceleratorValue = 1;
      if (leaders[i].accelerator && leaders[i].accelerator.value){
        acceleratorValue = leaders[i].accelerator.value;
      }
      text = '<tr id="'+ lgn +'">' + 
        '<td class="rating-id">' + number + '</td>' + 
        '<td class="rating-lgn" style="'+style+'">' + shortedLogin + '</td>' + 
        '<td>' + points + '</td>' + 
        '<td class="games">' + count + '</td>' + 
        '<td>' + prize + '</td>' + 
        '<td class="acceleratorValue">' + acceleratorValue + '</td>'
      '</tr>';
      $("#loading").hide();
      $(rating).append(text);
    } 
  }
}

function getAfterGameFooter(tournamentID, prizes, eventType){
  var footer;
  //a(class="btn btn-lg btn-primary" href="http://vk.com/share.php?url=http://online-tournaments.org/&title=Онлайн турниры&description=Участвуй в викторинах и выигрывай призы!&image=http://theartmad.com/wp-content/uploads/2015/08/Football-Stars-Wallpaper-1.jpg&noparse=true" target="_blank") Поделиться
  //document.getElementById('vk_share').innerHTML = VK.Share.button();
  /*var obj = {
    url: "http://online-tournaments.org/",
    title: "Онлайн турниры",
    description: "Участвуй в викторинах и выигрывай призы!",
    image: "http://theartmad.com/wp-content/uploads/2015/08/Football-Stars-Wallpaper-1.jpg",
    noparse: true
  }
  var url = "http://vk.com/share.php?url="+obj.url+"&title="+obj.title+"&description="+obj.description+"&image="+obj.image+"&noparse=true";*/
  var url = makeShareUrl();
  var share = shareLink('Поделиться', 'btn btn-lg btn-primary', {});
  


  switch(eventType){
    case EVENT_TYPE_WIN_MONEY:
      //Поделиться победой с друзьями!
      footer = shareLink('Похвастаться', 'btn btn-lg btn-primary', { 
        description:'Я выиграл ' + prizes[0] + ruble() + '! Присоединяйтесь!'
      });
    break;

    case EVENT_TYPE_WIN_RATING:
      footer = shareLink('Поделиться', 'btn btn-lg btn-primary', { 
        description:'Я участвую в еженедельной гонке за главный приз, присоединяйтесь!'
      })+continue_playing_button(); //main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a> !');
    break;
    case EVENT_TYPE_LOSE:
      footer = fast_register_button()+add_questions_button(); 
      /*shareLink('Пригласить друга', 'btn btn-lg btn-primary', { 
        description:'Я участвую в еженедельной гонке за главным призом, присоединяйтесь!' 
      });*/
    break;
    default:
      footer = shareLink('Поделиться', 'btn btn-lg btn-primary', { 
        description:'Я участвую в еженедельной гонке за главный приз, присоединяйтесь!' 
      });
    break;
  }

  return footer;//+'<button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>';
}

function modal_pic(name){
  return '<br><img width="100%" src="/img/'+name+'" />';// height="260px"
}

function winningPicture(){ return modal_pic('win_1.png'); }
function ratingPicture(){ return modal_pic('win_2.jpg'); }

function losePicture(){ return modal_pic('lose_1.jpg'); }

function getAfterGameBody(tournamentID, prizes, eventType){
  var body;

  switch(eventType){
    case EVENT_TYPE_LOSE:
      body = main('Эх, не повезло( В следующий раз точно получится!') + losePicture();
    break;
    case EVENT_TYPE_WIN_MONEY:
      body = main('Вы выиграли ' + prizes[0] + ruble() +' !! Так держать!') + winningPicture();
    break;
    case EVENT_TYPE_WIN_RATING:
      body = main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a> !') + ratingPicture();
    break;
    default:
      body = main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a> !') + ratingPicture();
    break;
  }

  return body;
}

function closePopup(name){
  //prt('closePopup');

  //document.getElementById(name).style.display='none';
  $(myModal).modal('hide');
}

function drawPopup(){
  //prt('OPEN POPUUUUUUP!!!!');
  //document.getElementById('tournaments').style.display='block';
  // console.log('StartTournament mark');
  mark('mark/game/drawPopup', { login:login }); // , 'GET'
  // console.log('StartTournament mark ended');

  $(myModal).modal('show');
  //alert("Турнир начинается");
  //prt('popup opened');
}

var runningCount=0;

//function drawProfile(money, tournaments, )

function getAddressFromAddrList(addresses, tournamentID){
  if (!tournamentID) return null;

  if (!addresses) return null;

  /*var addr1 = addresses[tournamentID]; console.log(addr1);
  if (!addr1) return null;*/

  var address = addresses[tournamentID];//.address;

  if (address && address.host && address.port && address.running==TOURN_START) return address;

  return null;
}

var USD_TO_RUR=1;

function drawPayingModal(data){
  console.log('drawPayingModal', data);

  var buyInUSD = data;
  var needToPay = (buyInUSD - getFromStorage('money')); // in USD
  needToPay = Math.ceil(needToPay*100)/100;
  
  var needToPayRU = needToPay*USD_TO_RUR;
  needToPayRU = 1+Math.ceil((needToPayRU)*100)/100;// Math.ceil((7.114)*100)/100

  //var price = data / 100;
  var tournamentPrice = needToPay + 'p';
  /*var moneyRu = price * USD_TO_RUR;*/
  var moneyNow = getFromStorage('money');

  //moneyRu = needToPay*USD_TO_RUR/100;

  $("#userLogin").attr("value", login);
  $("#targets").attr("value", login);
  $("#sumAttribute").attr("value", needToPayRU);

  $("#depositLink1").attr("value", 'Оплатить ' + needToPayRU + 'р');


  $("#moneyNow").html('Денег на счету: <b>' + moneyNow + ' p</b>');
  $("#tournamentPrice").html('Стоимость участия в турнире: <b>' + buyInUSD + 'p</b>');
  $("#needToPay").html('К оплате: <b>'+needToPay+'p</b>');

  if (needToPay>0) { 
    stat_noMoney(0, needToPayRU);
    $(payModal).modal('show');
  }
}

