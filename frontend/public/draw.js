var PLAY_FIELD='#tournaments';
var PLAY_FIELD='#playButtons';
var BUTTON_FIELD="#modal-body";
var myModal = '#myModal';

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

  //prt('popup opened');
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