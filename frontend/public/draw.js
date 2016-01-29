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
  /*
  <form id="TheForm" method="post" action="'+addr+'" target="TheWindow">';

  '<input type="hidden" name="login" value="'+login+'" /> '+
  '<input type="submit" class="btn btn-default" value="111"> PLAY 111</input>'+
  '</form>

  */
  txt='<form id="form1" method="post" action="'+addr+'"  target="_blank"> '
  //+'<p>aaaa</p>'
  //+'<a href="http://google.com">google</a>'
  +'<input type="hidden" name="login" value="'+login+'" />'
  +'<input type="submit" class="btn btn-default" value="Сыграть в турнир #'+tournamentID+'" />'
  +'</form>';

  
  $(BUTTON_FIELD).append(txt);
  console.log('appended: ' + host, port, tournamentID);

  /*var wind = window.open('', 'TheWindow');
  document.getElementById('TheForm').submit();
  wind.focus();*/
}


function drawPlayButtons(){
  console.log('------------\ndrawPlayButtons');
  runningCount=0;
  var tournaments = getTournaments();        // prt(tournaments);
  var addresses   = getObject('addresses');  // console.log('addresses',addresses);

  //$(PLAY_FIELD).html('<p onclick="closePopup(\'tournaments\');"> CLOSE </p>'); // drawHideLink
  
  if (tournaments && addresses){
    clearButtonField();
    for (var i = tournaments.length - 1; i >= 0; i--) {
      var tournamentID = tournaments[i]; // console.log(tournamentID);
      var address = getAddressFromAddrList(addresses, tournamentID);
      //var address = addresses[tournamentID];//);
      //console.log(address);
      if (address) {
        
        runningCount++;
        drawButton(address.host, address.port, tournamentID);
      }
    }
  }

  if (runningCount==0) { 
    console.log('no tournaments. runningCount=0');
    $(BUTTON_FIELD).append('Нет запущенных турниров'); //closePopup('tournaments');
    //drawPopup();
  } else {
    drawPopup();
  }
}


function hideAllButtons(tID){
  $('#unregister' + tID).hide();
  $('#reg' + tID).hide();
  $('#auth' + tID).hide();
}

function drawUnRegButton(tID){
  $('#unregister' + tID).show();
  $('#reg' + tID).hide();
  $('#auth' + tID).hide();
}

function drawRegButton(tID){
  $('#unregister' + tID).hide();
  $('#reg' + tID).show();
  $('#auth' + tID).hide();
}

function drawAuthButton(tID){
  $('#unregister' + tID).hide();
  $('#reg' + tID).hide();
  $('#auth' + tID).show();
}

function redraw_reg_button(tournament){
  console.log('redrawRegButtons', tournament);
  var tID = tournament.tournamentID;
  //console.log('look at ', tID);
  if (login){
    if (userIsRegisteredIn(tID)){
      drawUnRegButton(tID); //console.log('userIsRegisteredIn');
    } else {
      drawRegButton(tID); //console.log('no register');
    }
  } else {

    drawAuthButton(tID); //console.log('no auth');

  }

}

function redrawRegButtons(tournaments){
  console.log('redrawRegButtons', tournaments);
  for (var i = tournaments.length - 1; i >= 0; i--) {
    redraw_reg_button(tournaments[i])
    /*
    //console.log('redrawRegButtons', tournaments[i]);
    var tID = tournaments[i].tournamentID;
    //console.log('look at ', tID);
    if (login){
      if (userIsRegisteredIn(tID)){
        drawUnRegButton(tID); //console.log('userIsRegisteredIn');
      } else {
        drawRegButton(tID); //console.log('no register');
      }
    } else {
      drawAuthButton(tID); //console.log('no auth');
    }*/

  };
  /*if (tID){
    console.log('tID: ' + tID);
  }*/
}

function clearButtonField(){
  console.log('clearButtonField');

  $(BUTTON_FIELD).html('<br />');
}

function drawWindowForGame(gameURL, port, tournamentID){
  /*var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+tournamentID;
    
  var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
  console.log(txt);
  $(PLAY_FIELD).append(txt);

  
  var wind = window.open('', 'TheWindow');
  document.getElementById('TheForm').submit();
  wind.focus();

  closePopup('tournaments');*/
}

function closePopup(name){
  //prt('closePopup');

  //document.getElementById(name).style.display='none';
  $(myModal).modal('hide');
}

function drawPopup(){
  //prt('OPEN POPUUUUUUP!!!!');
  //document.getElementById('tournaments').style.display='block';
  $(myModal).modal('show');
  //alert("Турнир начинается");
  //prt('popup opened');
}
const TOURN_STATUS_REGISTER = 1;
const TOURN_STATUS_RUNNING = 2;
const TOURN_STATUS_FINISHED = 3;
const TOURN_STATUS_PAUSED = 4;

function drawTournamentStatus(tournamentID, status){
  
}

function redrawTournament(tournament){
  var players = tournament.players;
  var maxPlayers = tournament.goNext[0];

  var tournamentID = tournament.tournamentID;
  var status = tournament.status;
  //console.log("redrawTournament", tournamentID, players, maxPlayers, status);
  $("#plrs-"+tournamentID).html("Участников : " + players + " из " + maxPlayers);

  drawTournamentStatus(tournamentID, status);
  //$("plrs-"+tournamentID).html("Участников : " + players + " из " + maxPlayers);
}

var runningCount=0;
var blinkCounter=0;

function blinker(){
  var blinkStatus = runningCount;// getFromStorage('hasRunningTournaments');
  //prt(blinkStatus);
  blinkCounter++;

  //$("#my-tournaments").css( "background-color" , defaultColour );
  var colour = 'black';
  var period;
  if (blinkStatus==1){
    if (blinkCounter%2){
      colour = 'red';
    }
    else{
      colour = 'blue';
    }
    period = 1001;
  }
  else{
    period = 3000;
  }

  $("#my-tournaments").css( "background-color" , colour );

  setTimeout(blinker , period);

}

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

  if (needToPay>0) $(payModal).modal('show');
}