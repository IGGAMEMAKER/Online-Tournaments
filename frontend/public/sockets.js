var TOURN_START=1;

var socket = io();
var curLogins=[];



//var buttons = setInterval(drawPlayButtons, 1000);

$(document).mouseup(function (e)
{
    var container = $("#playButtons");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        //container.hide(); //$("#tournaments").hide();
        closePopup('tournaments');
    }
});


socket.on('StartTournament', function (msg){
  prt('StartTournament');
  var tournamentID = msg.tournamentID;
  if (tournamentID) {
    StartTournament(tournamentID);
  } else {
    prt('StartTournament, but no tournamentID');
  }
  
  var host = msg.host; var port = msg.port; var running = msg.running;
  curLogins = msg.logins;

  //setInObject('addresses', tournamentID, {host:host, port:port, running: TOURN_START } );
  
  // drawButton(host, port, tournamentID);
  
});


function StartTournament(tournamentID){
  if (isActiveTab()){
    window.scrollTo(0,0); 
    
    playAudio();
    drawPopup();
    setTimeout(drawPlayButtons, 1000);
  }
  
  // if (userIsRegisteredIn(tournamentID) )
  getProfile(); ///$('#news').append($('<button>').text(JSON.stringify(msg)));
}

function startGame(gameURL, port, tournamentID){
  if (gameURL && port){
    statAttemptToStart(tournamentID);
    drawWindowForGame(gameURL, port, tournamentID);
    //saveInStorage('hasRunningTournaments', 0);
  }
}

function playAudio(){
  var audio = new Audio('sounds/TOURN_START.wav');
  audio.play();
}



function statAttemptToStart(tournamentID){
  prt('statAttemptToStart:'+tournamentID);
  setAsync('AttemptToStart', { tournamentID: tournamentID });
}


function getTournaments(){
  return JSON.parse(getFromStorage('tournaments')) ;
}

function setAsync(url, data, success){
  $.ajax({
    url: url,
    method: 'POST',
    data:data,
    success: success|| printer
  });
}

function prt(message) {
  if (message) console.log(message);
}

function printer(msg){ prt(msg); }


function isActiveTab(){ return true; }

function userIsRegisteredIn(tournamentID){
  var tournaments = getTournaments();
  //prt(tournaments);

  for (var i=0; i<tournaments.length;++i){
    if (tournaments[i]==tournamentID){
      prt('userIsRegisteredIn : ' + tournamentID);
      return true;
    }
  }
  return false;
}

function addTournament(tournamentID){
  var tournaments = getTournaments();
  tournaments.push(tournamentID);
  saveInStorage('tournaments', tournaments);
}

var blinkCounter=0;
function blinker(){
  var blinkStatus = getFromStorage('hasRunningTournaments');
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
//setTimeout(blinker, 1000);

// LOCALSTORAGE // addresses // tournaments // playing 
/* CLIENT SIDE INFO:
  Login Password
  --Money
  Registered TournamentIDs

*/