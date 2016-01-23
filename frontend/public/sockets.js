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
    prt('no tournamentID');
  }
  
  var host = msg.host; var port = msg.port; var running = msg.running;
  curLogins = msg.logins;

  //setInObject('addresses', tournamentID, {host:host, port:port, running: TOURN_START } );
  
  // drawButton(host, port, tournamentID);
  
});

socket.on('FinishTournament', function (msg) {
  var tournamentID = msg.tournamentID;
  console.log('I am ', login);

  if (userIsRegisteredIn(tournamentID)){
    console.log(msg);
    showCloseTournamentModal(tournamentID, msg.places, msg.prizes);
  }

  //drawWinningModal(msg);
  //console.log('FinishTournament');
  unsetFromObject('addresses', tournamentID);
  getProfile();
  //drawPlayButtons();
});

socket.on('update', function (msg){
  var tournaments = msg;
  //console.log("---------------");
  for (var i = tournaments.length - 1; i >= 0; i--) {
    redrawTournament(tournaments[i]);
    //console.log("update-"+i, tournaments[i]);
  };
})

function showCloseTournamentModal(tournamentID, places, prizes) {
  //alert('FinishTournament ' + tournamentID);
  
  /*if(isWinner(login, places, prizes)){
    //drawWinningModal()
  }*/
}

function reload(time){
  setTimeout(function() { location.reload(); }, time);
}


function StartTournament(tournamentID){
  if (isActiveTab()){
    if (userIsRegisteredIn(tournamentID)){
      window.scrollTo(0,0); 
      
      playAudio();
      drawPopup();
    }
    /*setTimeout(drawPlayButtons, 50);
    setTimeout(drawPlayButtons, 300);
    setTimeout(drawPlayButtons, 1000);*/
  }
  
  // if (userIsRegisteredIn(tournamentID) )
  //getProfile(); ///$('#news').append($('<button>').text(JSON.stringify(msg)));
}

function startGame(gameURL, port, tournamentID){
  if (gameURL && port){
    statAttemptToStart(tournamentID);
    //drawWindowForGame(gameURL, port, tournamentID);
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

setTimeout(blinker, 1000);

// LOCALSTORAGE // addresses // tournaments // playing 
/* CLIENT SIDE INFO:
  Login
  --Money
  Registered TournamentIDs

*/