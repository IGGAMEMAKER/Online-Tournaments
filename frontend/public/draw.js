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

  txt='<form id="form1" method="post" onclick="'+ onclick + '" action="'+addr+'"  > '//target="_blank"

  +'<input type="hidden" name="login" value="'+login+'" />'
  +'<input type="submit" class="btn btn-primary btn-lg" value="Сыграть в турнир #'+tournamentID+'" />'
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
      if (prizes[0] < 2){
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

function main(message) { return '<h3>' + message + '</h3>'; }

function showEvent(tournamentID, prizes, eventType){
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
  var url = makeShareUrl(obj.url||null, obj.title||null, obj.description||null, obj.image||null);
  return '<a href="'+ url + '" target="_blank" class="'+className+'" >' + text + '</a>';
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
 return '<a class="btn btn-primary center-block offset-md" onclick="autoreg()"> Играть! </a>';  
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

function loadRating(){
  setTimeout(function (){
    console.log("loadRating");
    setAsync("api/mini-rating", {}, drawRating, "GET");
  }, 500);
}

function mark(url, data, method){
  // console.log('mark', url, data, method);
  $.ajax({
    url:url
    , method: method || 'POST'
    , data:data
  })
}

function sendError(err, func_name){
  mark('mark/clientError', { 
    err: err,
    where: {
      func_name: func_name,
      stack:err.stack,
      name:err.name,
      msg:err.message 
    }
  })
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
      var style = "";

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
        '<td class="rating-games">' + count + '</td>' + 
        '<td class="rating-acceleratorValue">' + acceleratorValue + '</td>' +
        '<td>' + prize + ' руб</td>' + 
      '</tr>';
      // $("#loading").hide();
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
  // var url = makeShareUrl();
  var share = shareLink('Поделиться', 'btn btn-lg btn-primary', {});
  


  switch(eventType){
    case EVENT_TYPE_WIN_MONEY:
      //Поделиться победой с друзьями!
      footer = shareLink('Похвастаться', 'btn btn-lg btn-primary', { 
        description:'Я выиграл ' + prizes[0] + ruble() + '! Присоединяйтесь!'
      });
    break;

    case EVENT_TYPE_WIN_RATING:
      footer = continue_playing_button();
      /*shareLink('Поделиться', 'btn btn-lg btn-primary', { 
        description:'Я участвую в еженедельной гонке за главный приз, присоединяйтесь!'
      }) */
      //main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a> !');
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
    // case EVENT_TYPE_WIN_RATING:
    //   body = main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a><br> !') + ratingPicture();
    // break;
    default:
      body = main('Повышение в ' + '<a href="Leaderboard" target="_blank"> Рейтинге </a><br>Наберите больше всех баллов и выиграйте главный приз!') + ratingPicture();
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

function getAcceleratorValue(index){
  switch(index) {
    case 0: return 4; break;
    case 1: return 7; break;
    case 2: return 9; break;
    default: return 1; break;
  }
}
function getAcceleratorColour(index){
  switch(index) {
    case 0: return 'rgb(0, 55, 255)'; break;
    case 1: return 'purple'; break;
    case 2: return 'gold'; break;
    default: 
      console.log(index);
      return 'gold'; 
    break;
  }
}

var USD_TO_RUR=1;

var PAYMENT_TOURNAMENT = 0;
var PAYMENT_ACCELERATOR = 1;
var PAYMENT_FULLFILL = 2;

var c = {
  NOTIFICATION_GIVE_ACCELERATOR:1 // give to user an accelerator
  ,NOTIFICATION_GIVE_MONEY:2 // give user money
  ,NOTIFICATION_ACCEPT_MONEY:3 // give money to a user if he clicks on button
  
  ,NOTIFICATION_MARATHON_PRIZE:4 // give user money
  ,NOTIFICATION_FORCE_PLAYING:5 // force playing
  ,NOTIFICATION_CUSTOM:6 // custom message. needs fields
  ,NOTIFICATION_UPDATE:7 // update page

  ,NOTIFICATION_FIRST_MESSAGE:8
  ,NOTIFICATION_MARATHON_CURRENT:9

  ,NOTIFICATION_AUTOREG:10
  ,NOTIFICATION_JOIN_VK:11

  ,NOTIFICATION_WIN_MONEY:12
  ,NOTIFICATION_LOSE_TOURNAMENT:13

  ,NOTIFICATION_ADVICE:14
  ,NOTIFICATION_CARD_GIVEN:15

  ,RARITY_RARE: 0
  ,RARITY_LOW: 1
  ,RARITY_MID: 2
  ,RARITY_HIGH: 3

  ,CARD_COLOUR_RED:1
  ,CARD_COLOUR_BLUE:2
  ,CARD_COLOUR_GREEN:3
  ,CARD_COLOUR_GRAY:4
}

// console.log(c.NOTIFICATION_AUTOREG, 'AUTOREEEG')


function drawNewsModal(data){
  try{
    // if (news.isActive) return;
    if ($('#newsModal').hasClass('in')){
      console.log('news are still showing... hold a little')
      return;
    }

    var messages = data.msg;
      // alert('News!!');
      // console.log(messages);
    var count = messages.length;
    if (count>0){
      /*for (var i = messages.length - 1; i >= 0; i--) {
        messages[i]
      };*/
      var message = messages[0];
      var info = message.data || {};
      var messageID = message._id;

      news.hide();
      var header='';
      var body='';
      var footer='';

      // var a = null;
      // a[222] = null;

      switch(message.type){
        case c.NOTIFICATION_GIVE_MONEY:
          header = 'Деньги, деньги, деньги!';
          body = 'Вы получаете ' + info.ammount + 'руб на счёт!';
          footer = news.buttons.skip('Спасибо!', messageID)
        break;
        case c.NOTIFICATION_GIVE_ACCELERATOR:
          // header = 'Вы будете набирать очки быстрее!';
          var id = parseInt(info.index);
          var value = getAcceleratorValue(id);
          var colour = getAcceleratorColour(id);
          
          header = 'Вы получаете ускоритель ' + value + '!';
          // console.log(info, id, value, colour)
          // function modal_pic(name){
          body += '<div class="col-md-6 col-sm-6 col-xs-12 killPaddings accelerator" id="accelerator"'+id+'>';
          body +=   '<center>';
          body += 'Вы будете набирать очки в ' + value + ' раза быстрее!';//Набирайте очки быстрее с помощью ускорителя
          body += '<br>';
          // body +=     '<h2 class="white text-center"> Ускоритель '+value+' </h2>';
          body +=   '<img class="acceleratorImage" width="100%" src="/img/accelerator'+value+'.png" style="background-color:'+colour+'">';
          body +=   '</center>';
          body += '</div>';

          footer = news.buttons.skip('Спасибо!', messageID)
        break;
        case c.NOTIFICATION_ACCEPT_MONEY:
          header = 'Бонус!';
          body = 'Примите ' + info.ammount + 'рублей на счёт!';

          footer = news.buttons.action(0, messageID, { text:'Спасибо!' })
        break;
        case c.NOTIFICATION_MARATHON_PRIZE:
          header = 'Победа в марафоне!'
          body = 'Вы получаете ' + info.ammount + 'руб на счёт!';

          footer = news.buttons.skip('Урра!', messageID)
        break;
        case c.NOTIFICATION_FORCE_PLAYING:
          // header = 'Настало время играть!'
          // body = '<script>alert("Поиграй со мной")</script>'

          // header = 'Настало время играть!'
          body = 'Настало время играть!'


          footer = fast_register_button();
        break;
        case c.NOTIFICATION_CUSTOM:
          header = info.header;
          body = info.text;
          if (info.imageUrl){
            body += modal_pic(info.imageUrl)
          }

          footer = news.buttons.skip('Хорошо', messageID);
        break;
        case c.NOTIFICATION_AUTOREG:
          autoreg();
          setTimeout(function (){
            getProfile();
          }, 1000);
        break;
        case c.NOTIFICATION_FIRST_MESSAGE:
          var mainPrize = info.mainPrize;
          console.log(mainPrize);

          header = 'С почином!'
          // 'Проверь свои знания, участвуй в турнирах, и выигрывай ценные призы!'
          body = 'Вы сыграли в первом турнире<br><br>'
          body += 'Продолжайте играть и выигрывайте призы благодаря своим знаниям!'
          // body += 'Получай ценные призы <br>'
          // body = 'Для этого нужно участвовать в <a href="/Tournaments">турнирах</a> и выигрывай ценные призы!';
          footer = news.CTA();
        break;
        case c.NOTIFICATION_MARATHON_CURRENT:
          var mainPrize = info.mainPrize;
          console.log(c.NOTIFICATION_MARATHON_CURRENT, info);

          var earned_points= '1 балл';
          if (info.accelerator>1 && info.accelerator<5){
            earned_points = info.accelerator + ' балла'
          } 
          if (info.accelerator>5) {
            earned_points = info.accelerator + ' баллов'
          }
          // header = 'Повышение в марафоне!'
          header = 'Вы заработали ' + earned_points;

          // 'Проверь свои знания, участвуй в турнирах, и выигрывай ценные призы!'
          body = '<b>Набери больше всех баллов и выиграй ' + info.mainPrize + ' рублей и кучу других призов!</b><br><br>'

          // body += 
          body += 'Итого баллов: ' + info.points + ' <br>';
          body += 'Место в <a href="/Leaderboard">рейтинге</a>: ' + info.place;

          footer = news.CTA();
        break;
        case c.NOTIFICATION_WIN_MONEY:
          // { 
          //   tournamentID : data.tournamentID,
          //   winners:winners,
          //   count:winnerCount,
          //   prizes:prizes 
          // }
          // alert('Win');
          header = 'Вы победили в турнире #' + info.tournamentID;

          body = main('Вы выиграли ' + info.prizes[0] + ruble() +' !! Так держать!') + winningPicture();

          footer = news.buttons.skip('Урра!', messageID)
        break;
        case c.NOTIFICATION_LOSE_TOURNAMENT:
          // alert('lose');
          header = 'Турнир #' + info.tournamentID + " завершён";
          body = main('Эх, не повезло( <br>В следующий раз точно получится!') + losePicture();

          footer = news.buttons.skip('Продолжить', messageID)
          // footer = news.skip('Продолжить')
        break;
        case c.NOTIFICATION_CARD_GIVEN:
          header = 'Вы получаете карточку!';
          var card = info;
          console.log(card);
          body = '<div >' //class="col-sm-10 col-md-10 col-xs-12"
          body += '<p class="card-name">'+card.description+'</p>';
          body += drawCard(card);
          body += '</div>';
          // footer = news.buttons.skip('Спасибо!', messageID)
          var open_more = '<button class="btn btn-primary" onclick="openPack()"> Открыть ещё! </button>'
          var close = '<button class="btn btn-default" onclick="news.hide()"> Закрыть </button>'
          footer = open_more + close;
        break;
        default:
          // header = message.text;
          // body = info.body;
          // footer = news.CTA();
        break;
      }
      if (!header && !body && !footer){
        mark('message/shown', { id : messageID , option:'default'})
        return
      }
      var title = header;
      if (count>1) title += ' (' + count + ')';

      news.title(title);
      news.body(body);
      news.footer(footer);

      news.show();
      // news.isActive = 1;

      mark('message/shown', { id : messageID })
      getProfile();
    }
  } catch(err){
    sendError(err, 'drawNewsModal');
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
  // var backgroundImage = '\'http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg\''
  // var backgroundImage = '\'https://i.ytimg.com/vi/nKbQqN8sazg/maxresdefault.jpg\''

  var backgroundImage = '\'';
  var image_card_red = 'http://www.ujut.hu/img/back.jpg';
  var image_card_gray = 'img/cardLayers/6895569-silver-abstract-wallpaper.jpg';
  var image_card_green = 'http://hdoboi.net/uploads/819424_zelenyiy_fon_thumb.jpg';
  var image_card_blue = 'http://sisadmin.justclick.ru/media/content/sisadmin/picture-10426.jpg';
  // console.log('before switch', card.colour)
  switch(card.colour){
    case c.CARD_COLOUR_GRAY: backgroundImage += image_card_gray; break;
    case c.CARD_COLOUR_BLUE: backgroundImage += image_card_blue; break;
    case c.CARD_COLOUR_GREEN: backgroundImage += image_card_green; break;
    
    // case c.CARD_COLOUR_RED: backgroundImage = image_card_red break;
    default: backgroundImage += image_card_red; break;
  }
  backgroundImage += '\'';
  console.log(backgroundImage);
  // var backgroundImage = '\'http://img15.nnm.me/3/3/c/6/f/ab1fb05250ab9dde13490a37bed.jpg\'' red bad
  // var backgroundImage = '\'http://m-static.flikie.com/ImageData/WallPapers/d1b8dc2a2b424a6fbb5b55cdaee405cf.jpg\'' //red
  // var backgroundImage = '\'http://www.ujut.hu/img/back.jpg\'' // good one RED
  // var backgroundImage = '\'http://hdoboi.net/uploads/819424_zelenyiy_fon_thumb.jpg\''  //green
  // var backgroundImage = '\'http://www.pspinfo.ru/uploads/gallery/main/27/7e3bc.jpg\''  //blue2
  
  // var backgroundImage = '\'http://sisadmin.justclick.ru/media/content/sisadmin/picture-10426.jpg\''  //blue
  
  // var backgroundImage = '\'http://img0.mxstatic.com/wallpapers/46b62e792ac6da0dac319899e2d57450_large.jpeg\''  //purple
  // var backgroundImage = '\'img/cardLayers/6895569-silver-abstract-wallpaper.jpg\''  //gray



  // var backgroundImage = '\'http://cdn.superbwallpapers.com/wallpapers/abstract/silver-blur-31345-400x250.jpg\''  //green
  // var backgroundImage = '\'img/cardLayers/gold.jpg\''
  // var backgroundImage = '\'img/cardLayers/gold2.jpg\''
  //328 276

  // var text = '<div class="col-sm-4 col-md-4 col-xs-12">'
  var text = ''
  var style = 'background-image:url('+backgroundImage+')'
  text+= '<img border="0" class="card img-wrapper" style="'+style+'" src="/img/topics/realmadrid/'+card.photoURL+'">'
  // text+= '<p class="card-name">'+card.description+'</p>';

  // text+= '</div>';
  // $(cardField).append(text);

/*  $(cardField).append('<div class="col-sm-4">')
  $(cardField).append('<img border="0" class="card img-wrapper" style="background-image:url('+backgroundImage+')" src="/img/topics/realmadrid/'+card.photoURL+'">')
  $(cardField).append('</div>')*/
  
  // $(cardField).append('<img border="0" style="background-color:purple" src="/img/topics/realmadrid/'+card.photoURL+'">')
  // $(cardField).append('<img class="cornerimage" border="0" src="http://cdn.pcwallart.com/images/gold-texture-wallpaper-1.jpg" />')
  // $(cardField).append('<img class="cornerimage" border="0" src="http://www.gravatar.com/avatar/" />')

  return text;
}

var news = {
  title :   function (msg) { $("#newsTitle").html(msg); }
  // ,isActive : 0
  // ,isActive : function (){
  //   return $('#newsModal').hasClass('in');
  // }
  ,disable: function (){
    // news.isActive = 0;
  }
  ,body  :  function (msg) { $("#newsBody").html(msg); }
  ,footer:  function (msg) { $("#newsFooter").html(msg); }

  ,show:    function () { $("#newsModal").modal('show'); }
  ,hide:    function () { $("#newsModal").modal('hide'); news.disable(); }
  ,CTA: function (ammount, buyType) {
    var onclick = "news.actions.autoreg()";
    // $("#depositLink1").attr("href", "Payment/"+login+"/"+needToPay+"')")
    return '<a class="btn btn-primary" onclick="'+onclick+'"> Продолжить играть </a>';
  }
  ,actions: {
    autoreg: function(){
      news.hide();
      // news.disable();
      autoreg();
    }
  }
  ,markRead: function (messageID){
    news.hide();
    checkNews();
    // mark('/message/read/'+messageID);
  }
  ,answer: function(code, messageID){
    mark('message/action/' + code + '/' + messageID);
    news.hide();
  }

  ,empty: function() { return ''; }
  ,buttons : {
    skip: function(text, messageID) {
      if (!text) text = 'Продолжить';
      return '<a class="btn btn-primary" onclick="news.markRead(\''+messageID+'\'); ">' + text + '</a>';
    },
    action: function(code, messageID, style){ // style.text // style.class // style.style
      return '<a class="btn btn-primary" onclick="news.answer('+code+','+messageID+');">'+ style.text + '</a>';
    },
    next: function(i){ return ''; }
  },

  // others: save other messages here
  // next: draw next message here
}

function drawPayingModal(data){
  console.log('drawPayingModal', data);

  var buyInUSD = data;
  var needToPay = (buyInUSD - getFromStorage('money')); // in USD
  needToPay = Math.ceil(needToPay*100)/100;
  
  var needToPayRU = needToPay*USD_TO_RUR;
  needToPayRU = Math.ceil((needToPayRU)*100)/100;// Math.ceil((7.114)*100)/100

  //var price = data / 100;
  var tournamentPrice = needToPay + 'p';
  /*var moneyRu = price * USD_TO_RUR;*/
  var moneyNow = getFromStorage('money');

  //moneyRu = needToPay*USD_TO_RUR/100;

  $("#userLogin").attr("value", login);
  $("#targets").attr("value", login);
  $("#sumAttribute").attr("value", needToPayRU);

  // $("#depositLink1").attr("value", 'Оплатить ' + needToPayRU + 'р');
  $("#depositLink1").html('Оплатить ' + needToPayRU + 'р');
  $("#depositLink1").attr("onclick", "mark('mark/payment/"+login+"/"+needToPay+"')")
  $("#depositLink1").attr("href", '/Payment?ammount='+ needToPayRU+'&buyType='+PAYMENT_TOURNAMENT)
  // return '<a href="Payment?ammount='+ ammount + '" class="btn btn-primary" onclick="'+onclick+'"> Оплатить </a>';
  
  // $("#depositLink1").attr("onclick", "mark('mark/payment/"+needToPay+"')" )

  $("#moneyNow").html('Денег на счету: <b>' + moneyNow + ' p</b>');
  $("#tournamentPrice").html('Стоимость участия в турнире: <b>' + buyInUSD + 'p</b>');
  $("#needToPay").html('К оплате: <b>'+needToPay+'p</b>');

  if (needToPay>0) { 
    stat_noMoney(0, needToPayRU);
    $(payModal).modal('show');
  }
}


// function drawPayingModal(data){
//   console.log('drawPayingModal', data);

//   var buyInUSD = data;
//   var needToPay = (buyInUSD - getFromStorage('money')); // in USD
//   needToPay = Math.ceil(needToPay*100)/100;
  
//   var needToPayRU = needToPay*USD_TO_RUR;
//   needToPayRU = Math.ceil((needToPayRU)*100)/100;// Math.ceil((7.114)*100)/100

//   //var price = data / 100;
//   var tournamentPrice = needToPay + 'p';
//   /*var moneyRu = price * USD_TO_RUR;*/
//   var moneyNow = getFromStorage('money');

//   //moneyRu = needToPay*USD_TO_RUR/100;

//   $("#userLogin").attr("value", login);
//   $("#targets").attr("value", login);
//   $("#sumAttribute").attr("value", needToPayRU);

//   $("#depositLink1").attr("value", 'Оплатить ' + needToPayRU + 'р');
//   $("#depositLink1").attr("onclick", "mark('mark/payment/"+login+"/"+needToPay+"')")
//   $("#depositLink1").attr("href", '/Payment?ammount='+ needToPayRU)
//   // return '<a href="Payment?ammount='+ ammount + '" class="btn btn-primary" onclick="'+onclick+'"> Оплатить </a>';
  
//   // $("#depositLink1").attr("onclick", "mark('mark/payment/"+needToPay+"')" )

//   $("#moneyNow").html('Денег на счету: <b>' + moneyNow + ' p</b>');
//   $("#tournamentPrice").html('Стоимость участия в турнире: <b>' + buyInUSD + 'p</b>');
//   $("#needToPay").html('К оплате: <b>'+needToPay+'p</b>');

//   if (needToPay>0) { 
//     stat_noMoney(0, needToPayRU);
//     $(payModal).modal('show');
//   }
// }

var modal = {
  title :   function (msg) { $("#cTitle").html(msg); }
  ,body  :  function (msg) { $("#cBody").html(msg); }
  ,footer:  function (msg) { $("#cFooter").html(msg); }

  ,show:    function () { $("#customModal").modal('show'); }
  ,hide:    function () { $("#customModal").modal('hide'); }
  ,pay_btn: function (ammount, buyType) {
    var onclick = "mark('mark/payment/"+login+"/"+ammount+"')";
    // $("#depositLink1").attr("href", "Payment/"+login+"/"+needToPay+"')")
    return '<a href="Payment?ammount='+ ammount + '&buyType='+buyType +'" class="btn btn-primary" onclick="'+onclick+'"> Оплатить '+ammount+' руб</a>';
  }
}

function drawPayingModalAccelerator(data){
  // console.log('drawPayingModalAccelerator', data);

  var sum = data;
  var moneyNow = getFromStorage('money');

  var needToPayRU = sum - moneyNow;
  console.log('needToPayRU', needToPayRU);

  // var buyInUSD = data;
  // var needToPay = (buyInUSD - getFromStorage('money')); // in USD

  // needToPay = Math.ceil(needToPay*100)/100;
  
  // var needToPayRU = needToPay*USD_TO_RUR;
  // needToPayRU = Math.ceil((needToPayRU)*100)/100;// Math.ceil((7.114)*100)/100
  //moneyRu = needToPay*USD_TO_RUR/100;


  // title
  modal.title("Вам не хватает совсем чуть чуть(");

  // body
  var body = "<b> На вашем счету : </b>" + moneyNow + " руб" + "<br>";
  body += "<b> Стоимость ускорителя: </b>" + sum + " руб" + "<br><br>";
  body += "<b> Нужно оплатить: </b>" + needToPayRU + " руб";
  modal.body(body);

  // footer
  modal.footer(modal.pay_btn(needToPayRU, PAYMENT_ACCELERATOR));

  if (needToPayRU>0) { 
    stat_noMoney(0, needToPayRU);
    modal.show();
  }

}