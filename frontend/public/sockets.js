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

  drawButton(host, port, tournamentID);
  if (userIsRegisteredIn(tournamentID) ) startGame(host, port, tID);
  ///$('#news').append($('<button>').text(JSON.stringify(msg)));
});

function getTournaments(){
  return JSON.parse(getFromStorage('tournaments')) ;
}

function addTournament(tournamentID){
  var tournaments = getTournaments();
  tournaments.push(tournamentID);
  saveInStorage('tournaments', tournaments);
}

function userIsRegisteredIn(tournamentID){
  var tournaments = getTournaments();
  console.log(tournaments);

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
  var text = '<button onclick="startGame(\''+host+'\','+port+ ')" style="width:300px;height:60px;"> PLAY '+tournamentID+'</button><br>';//"' + gameURL + '"
  console.log(text);
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