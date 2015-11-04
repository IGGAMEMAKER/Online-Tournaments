//alert('Sockets included');
var socket = io();

var curLogins=[];


var windows=[];

// LOCALSTORAGE

// addresses
// tournaments
// playing

var TOURN_START=1;

//var popupOpener=OP_USER;

socket.on('StartTournament', function(msg){
  var tournamentID = msg['tournamentID'];
  console.log('StartTournament');
  //console.log('Jugadores:' + msg.logins);
  curLogins = msg.logins;
  var host = msg.host;
  var port = msg.port;
  var running = msg.running;

  setInObject('addresses', tID, {host:host, port:port, running: TOURN_START } );
  drawButton(host, port, tournamentID);
  if (userIsRegisteredIn(tournamentID) ) StartTournament(tournamentID);
  ///$('#news').append($('<button>').text(JSON.stringify(msg)));
});

function StartTournament(tournamentID){
  if (isActiveTab()){
    window.scrollTo(0,0); 
    
    var audio = new Audio('TOURN_START.wav');
    audio.play();

    openPopup();
  }
}

var blinkCounter=0;
function blinker(){
  var blinkStatus = getFromStorage('hasRunningTournaments');
  //console.log(blinkStatus);
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
    period = 1000;
  }
  else{
    period = 3000;
  }
  $("#my-tournaments").css( "background-color" , colour );
  /*setTimeout(function(){
    saveInStorage('hasRunningTournaments', 0);
  }, 3000);*/
  setTimeout(blinker , period);

}
setTimeout(blinker, 1000);

function startGame(gameURL, port, tournamentID){

  if (gameURL && port){
    
    var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+tournamentID;
    
    var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
    $(PLAY_FIELD).append(txt);

    //setInObject('playing', tournamentID, {status:STARTED_BY_PLAYER} );
    
    var wind = window.open('', 'TheWindow');
    document.getElementById('TheForm').submit();
    wind.focus();

    saveInStorage('hasRunningTournaments', 0);
    closePopup('tournaments');

    AttemptToStart(tournamentID);
  }

}

function getTournaments(){
  return JSON.parse(getFromStorage('tournaments')) ;
}

function addTournament(tournamentID){
  var tournaments = getTournaments();
  tournaments.push(tournamentID);
  saveInStorage('tournaments', tournaments);
}

function getObject(arrName){
  return JSON.parse(getFromStorage(arrName));// || [];
}

function setInObject(arrName, id , value){
  var array = getObject(arrName);
  //console.log(arrName, id, value);
  array[id] = value;
  saveInStorage(arrName, array);
}

function isActiveTab(){
  return true;
}

function removeObject(arrName){
  saveInStorage('playing',[]);
}

function userIsRegisteredIn(tournamentID){
  var tournaments = getTournaments();
  //console.log(tournaments);

  for (var i=0; i<tournaments.length;++i){
    if (tournaments[i]==tournamentID){
      console.log('userIsRegisteredIn : ' + tournamentID);
      return true;
    }
  }
  return false;
}

var PLAY_FIELD='#tournaments';
var PLAY_FIELD='#playButtons';
//var PLAY_FIELD='#news';

var STARTED_BY_PLAYER = 1;

function drawButton(host, port, tournamentID){
  //var text = '<button onclick="startGame(\''+host+'\','+port+','+tournamentID+ ')" style="width:300px;height:60px;"> PLAY ' + tournamentID + '</button><br>';//"' + gameURL + '"
  var parameters = '\''+host +'\','+port+','+tournamentID;
  //console.log(parameters);
  var text = '<button onclick="startGame(' + parameters + ')" style="width:300px;height:60px;"> PLAY '+tournamentID+'</button><br>';//"' + gameURL + '"
  //console.log(text);
  
  //$(PLAY_FIELD).html(text);
  $(PLAY_FIELD).append(text);
}

function drawPlayButtons(){
  var tournaments = getTournaments();
  var addrs = getObject('addresses');

  var playing = getObject('playing');

  $(PLAY_FIELD).html('<p onclick="closePopup(\'tournaments\');"> CLOSE </p>'); // drawHideLink

  if (tournaments.length){
    //console.log(tournaments);
    for (var i = tournaments.length - 1; i >= 0; i--) {
      var tournamentID = tournaments[i];
      var addr = addrs[tournamentID].address;
      //console.log(addr);
      if (addr && addr.host && addr.port && addr.running==TOURN_START) drawButton(addr.host, addr.port, tournamentID);
    };
  }
  else{
    $(PLAY_FIELD).append('No tournaments available'); //closePopup('tournaments');
  }
}

var buttons = setInterval(drawPlayButtons, 1000);

function UserStartedTournament(tournamentID, playing){
  return false;
  //return playing[tournamentID] && (playing[tournamentID].status==STARTED_BY_PLAYER);
}

$(document).mouseup(function (e)
{
    var container = $("#playButtons");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        //container.hide();
        $("#tournaments").hide();
    }
});

function closePopup(name){
  document.getElementById(name).style.display='none';
}

function openPopup(){
  document.getElementById('tournaments').style.display='block';
}

/* CLIENT SIDE INFO:
  Login Password
  --Money
  Registered TournamentIDs

*/