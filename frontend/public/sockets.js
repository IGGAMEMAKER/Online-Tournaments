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

socket.on('Tell', function (msg){
  console.log('drawServerMessage', msg);

  $('#serverMsg').html(msg.message);

  switch(msg.action){
    case 'reload':
      drawReloadButton('#ServerMessageButtonSpace');
    break;
  }

  $('#serverMessage').modal('show');
  //alert('msg');
})

socket.on('FinishTournament', function (msg) {
  var tournamentID = msg.tournamentID;
  console.log('FinishTournament ', tournamentID);

  if (userIsRegisteredIn(tournamentID)){
    showWinnerModal(msg);
    unsetFromObject('addresses', tournamentID);
    getProfile();
  }
  
  hideTournament(tournamentID);
});

function drawReloadButton(place){ $(place).html('<a onclick=reload() class="btn btn-primary">Обновить</a>'); }

function tournament_exists(ID){ return ( $("#tournamentWrapper"+ID).length ); }
function play_button_exists(ID){ return ( $("#play-btn"+ID).length ); }
function getRandomArbitary(min, max) { return Math.random() * (max - min) + min; }
function reload(time){ setTimeout(function() { location.reload(); }, time); }


function updateFrontend(frontendVersion){
  var current_frontendVersion = getCookie('frontendVersion');
  //var x = document.cookie;
  //console.log('updateFrontend', frontendVersion, current_frontendVersion);//, x);

  if (frontendVersion>current_frontendVersion){
    setTimeout(function(){
      setCookie('frontendVersion', frontendVersion, {expires:3600*24*10}) 
      reload(3000+getRandomArbitary(0, 3000));
    }, 1000);
  } else {
    setCookie('frontendVersion', frontendVersion, {expires:3600*24*10}) 
  }

  /*if (frontendVersion!=current_frontendVersion){
    if (current_frontendVersion==null || current_frontendVersion=='' || current_frontendVersion == 0){
      setCookie('frontendVersion', frontendVersion, {expires:3600*24*10})
    } else {
      setTimeout(function(){
        setCookie('frontendVersion', frontendVersion, {expires:3600*24*10}) 
        reload(3000+getRandomArbitary(0, 3000));
      }, 1000);
    }
  }*/

}



function StartTournament(tournamentID){
  console.log('StartTournament', tournamentID);

  if (isActiveTab()){
    if (userIsRegisteredIn(tournamentID)){
      // window.scrollTo(0,0); 
      
      // playAudio();
      var audio = new Audio('sounds/TOURN_START.wav'); audio.play();
      drawPopup();
    } else {
      console.log('Not registered in', tournamentID);
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

function statAttemptToStart(tournamentID){
  prt('statAttemptToStart:' + tournamentID);
  setAsync('AttemptToStart', { tournamentID: tournamentID });
}

function autoreg(){
  setAsync('autoreg', {}, function(){
    $("#winnerModal").modal('hide');
    setTimeout(function(){
      getProfile();
    }, 1500);

  });
}

function stat_noMoney(tournamentID, money){ 
  setAsync('NoMoney', {tournamentID:tournamentID, money:money}); 

  // mark('mark/NoMoney');
}

function buyAcceleratorResult(msg){
  console.log('buyAcceleratorResult', msg);
  if (msg.result==1){
    alert('Поздравляем! Вы будете набирать очки быстрее!')
    getProfile();
  } else {
    alert('Ошибка. На вашем счету недостаточно средств')
    // payment!!
  }
  // alert(msg);
}

function buyAccelerator(index){
  setAsync('buyAccelerator/'+index, { }, buyAcceleratorResult, 'GET'); // maybe you need to show success modal?
}

function getTournaments(){ return JSON.parse(getFromStorage('tournaments')); }

function setAsync(url, data, success, method){
  $.ajax({
    url: url,
    method: method || 'POST',
    data:data,
    success: success|| printer
  });
}

function mark(url, data, method){
  // console.log('mark', url, data, method);
  $.ajax({
    url:url
    , method: method || 'POST'
    , data:data
  })
}

function prt(message) {
  if (message) console.log(message);
}

function printer(msg){ prt(msg); }


function isActiveTab(){ return true; }

function userIsRegisteredIn(tournamentID){
  var tournaments = getTournaments();
  //prt("user registered in ",tournaments);

  for (var i=0; i<tournaments.length;++i){
    if (tournaments[i]==tournamentID){
      //prt('userIsRegisteredIn : ' + tournamentID);
      return true;
    }
  }
  return false;
}

//setTimeout(blinker, 1000);

function getLogin(){
  return login;
}


// LOCALSTORAGE // addresses // tournaments // playing 
/* CLIENT SIDE INFO:
  Login
  --Money
  Registered TournamentIDs

*/