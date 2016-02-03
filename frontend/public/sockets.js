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

function drawServerMessage(msg){
  console.log('drawServerMessage', msg);
  $('#serverMsg').html(msg.message);

  switch(msg.action){
    case 'reload':
      /*setTimeout(function(){
        reload();
      }, 2000);*/
      drawReloadButton('#ServerMessageButtonSpace');
      //$('#ServerMessageButtonSpace')html(',')
    break;
  }

  $('#serverMessage').modal('show');
}

function drawReloadButton(place){
  $(place).html('<a onclick=reload() class="btn btn-primary">Обновить</a>');
}

socket.on('Tell', function (msg){
  drawServerMessage(msg);
  //alert('msg');
})

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
  if (login) getProfile();

  hideTournament(tournamentID);
  //drawPlayButtons();
});

function drawNewTournament(tournament){
  parseAndDrawTournament(tournament);
  /*var id=tournament.tournamentID
  , img= "/img/quiz.png"
  , prize= "Случайный"
  , winPlaces= 1
  , players= 0
  , Max= 1

  drawTournament(id, img, prize, winPlaces, players, Max);*/
}

function tournament_exists(ID){
  return ( $("#tournamentWrapper"+ID).length );
}

socket.on('update', function (msg){
  var tournaments = msg.tournaments;
  var frontendVersion = msg.frontendVersion.value;
  //console.log('msg.frontendVersion', frontendVersion);
  //console.log("---------------");
  for (var i = tournaments.length - 1; i >= 0; i--) {
    var tournament = tournaments[i];
    var ID = tournament.tournamentID;

    if ( !tournament_exists(ID) ) {
      //var tLikeObject = JSON.parse(JSON.stringify(tournament));
      //console.log("new tournament", tournament.tournamentID, JSON.stringify(tournament) );
      drawNewTournament(tournament);
      //parseAndDrawTournament(tournament);
    } else {
      redrawTournament(tournament);
    }

    //console.log("update-"+i, tournaments[i]);
  };

  if (frontendVersion) {
    updateFrontend(frontendVersion);
  }
});

function getRandomArbitary(min, max)
{
  return Math.random() * (max - min) + min;
}


function updateFrontend(frontendVersion){
  var current_frontendVersion = getCookie('frontendVersion');
  //var x = document.cookie;
  console.log('updateFrontend', frontendVersion, current_frontendVersion);//, x);

  if (frontendVersion!=current_frontendVersion){
    setTimeout(function(){
      setCookie('frontendVersion', frontendVersion, {expires:3600*24*10}) 
      reload(3000+getRandomArbitary(0, 3000));
    }, 1000);
  }

}

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
  }
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
  prt('statAttemptToStart:' + tournamentID);
  setAsync('AttemptToStart', { tournamentID: tournamentID });
}

function stat_noMoney(tournamentID, money){
  setAsync('NoMoney', {tournamentID:tournamentID, money:money});
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
  prt("user registered in ",tournaments);

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

function deleteTournament(tournamentID){
  var tournaments = getTournaments();
  for (var i = tournaments.length - 1; i >= 0; i--) {
    if (tournaments[i]== tournamentID){
      var a = tournaments.splice(i,1);
      return saveInStorage('tournaments', a);
    }
  };
}

setTimeout(blinker, 1000);

function getLogin(){
  return login;
}


// LOCALSTORAGE // addresses // tournaments // playing 
/* CLIENT SIDE INFO:
  Login
  --Money
  Registered TournamentIDs

*/