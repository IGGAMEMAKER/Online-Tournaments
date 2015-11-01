//alert('Sockets included');
var socket = io();

var currentTID=0;
var curLogins=[];


var windows=[];

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
  return JSON.parse(getFromStorage(arrName));
}

function setInObject(arrName, id , value){
  var array = getObject(arrName)|| [];
  array[id] = value;
  saveInStorage(arrName, array);
}

function isActiveTab(){
  return true;
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
//var PLAY_FIELD='#news';

function drawButton(host, port, tournamentID){
  //var text = '<button onclick="startGame(\''+host+'\','+port+','+tournamentID+ ')" style="width:300px;height:60px;"> PLAY ' + tournamentID + '</button><br>';//"' + gameURL + '"
  var parameters = '\''+host +'\','+port+','+tournamentID;
  console.log(parameters);
  var text = '<button onclick="startGame(' + parameters + ')" style="width:300px;height:60px;"> PLAY '+tournamentID+'</button><br>';//"' + gameURL + '"
  //console.log(text);
  $(PLAY_FIELD).html(text);
}

function drawPlayButtons(){
  var tournaments = getTournaments();
  /*for (var i = tournaments.length - 1; i >= 0; i--) {
    tournaments[i]
  };*/
}

function startGame(gameURL, port, tournamentID){

  if (gameURL && port){
    
    var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+tournamentID;
    
    var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
    $(PLAY_FIELD).append(txt);
    
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