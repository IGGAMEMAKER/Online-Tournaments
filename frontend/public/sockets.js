//alert('Sockets included');
var socket = io();

var currentTID=0;
var curLogins=[];

socket.on('StartTournament', function(msg){
  var tournamentID = msg['tournamentID'];

  //console.log('Jugadores:' + msg.logins);
  curLogins = msg.logins;
  var host = msg.host;
  var port = msg.port;


  currentTID = tournamentID;
  console.log('tID = ' + currentTID);

  drawButton(host, port);
  if (userIsRegisteredIn(tournamentID) ) startGame(host, port);
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
      return true;
    }
  }
  return false;
}

function drawButton(host, port){
  var text = '<button onclick="startGame(\''+host+'\','+port+ ')" style="width:300px;height:60px;"> PLAY </button>';//"' + gameURL + '"
  console.log(text);
  $('#news').html(text);
}

function startGame(gameURL, port){
  if (gameURL && port){
    
    var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+currentTID;
    //alert(addr);

    var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
    //console.log(txt);
    $('#news').append(txt);
    
    window.open('', 'TheWindow');
    document.getElementById('TheForm').submit();
  }
}

/* CLIENT SIDE INFO:
  Login Password
  --Money
  Registered TournamentIDs

*/