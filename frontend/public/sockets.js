//alert('Sockets included');
var socket = io();

var currentTID=0;
var curLogins=[];


var windows=[];

// LOCALSTORAGE

// addresses
// tournaments
// playing

socket.on('StartTournament', function(msg){
  var tournamentID = msg['tournamentID'];
  console.log('StartTournament');
  //console.log('Jugadores:' + msg.logins);
  curLogins = msg.logins;
  var host = msg.host;
  var port = msg.port;


  currentTID = tournamentID;
  console.log('tID = ' + currentTID);
  setInObject('addresses', tID, {host:host, port:port} );
  drawButton(host, port, tournamentID);
  if (userIsRegisteredIn(tournamentID) ) StartTournament(tournamentID);
  ///$('#news').append($('<button>').text(JSON.stringify(msg)));
});

function StartTournament(tournamentID){
  if (isActiveTab()){
    window.scrollTo(0,0); 
    
    var audio = new Audio('TOURN_START.wav');
    audio.play();

    var address = getAddress(tournamentID);
    //startGame(host, port, tournamentID);
    //startGame(address.host, address.port, tournamentID);
  }
}




function getAddress(tournamentID){
  var address = getObject('addresses')[tournamentID];
  return address;
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

function setPlayingTournament(){

}

setTimeout(function(){removeObject('playing');} , 1000);

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
  var addresses = getObject('addresses');

  var playing = getObject('playing');

  //closePopup(PLAY_FIELD);
  ////closePopup('tournaments');
  
  //$(PLAY_FIELD).html('<p>'+ tournaments.length + '__' + JSON.stringify(playing)+'</p>');
  //console.log(playing);

  $(PLAY_FIELD).html(tournaments.length + '__' + JSON.stringify(playing));
  
  if (tournaments.length){
    for (var i = tournaments.length - 1; i >= 0; i--) {

      var tournamentID = tournaments[i];
      var host = addresses[tournamentID].host;
      var port = addresses[tournamentID].port;
      //if (!playing[tournamentID].status)
      //if (!UserStartedTournament(tournamentID, playing)) 
      drawButton(host, port, tournamentID);
    };
  }
  else{
    closePopup('tournaments');
  }

  /*if (tournaments.length > playing.length){
    //$(PLAY_FIELD).html('');
    for (var i = tournaments.length - 1; i >= 0; i--) {

      var tournamentID = tournaments[i];
      var host = addresses[tournamentID].host;
      var port = addresses[tournamentID].port;
      //if (!playing[tournamentID].status)
      //if (!UserStartedTournament(tournamentID, playing)) 
      drawButton(host, port, tournamentID);
    };
  }
  else{
    $(PLAY_FIELD).html(tournaments.length + '__' + JSON.stringify(playing));
  }*/
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

var buttons = setInterval(drawPlayButtons, 1000);

function UserStartedTournament(tournamentID, playing){
  return false;
  //return playing[tournamentID] && (playing[tournamentID].status==STARTED_BY_PLAYER);
}

function startGame(gameURL, port, tournamentID){

  if (gameURL && port){
    
    var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+tournamentID;
    
    var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
    $(PLAY_FIELD).append(txt);

    //setInObject('playing', tournamentID, {status:STARTED_BY_PLAYER} );
    
    window.open('', 'TheWindow');
    document.getElementById('TheForm').submit();

    /*var win = window.open(addr, 'Tournament'+tournamentID);
    win.login = login;*/

  }

}

/* CLIENT SIDE INFO:
  Login Password
  --Money
  Registered TournamentIDs

*/