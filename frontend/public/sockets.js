//alert('Sockets included');
var socket = io();
/*$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});*/

socket.on('chat message', function(msg){
  alert(JSON.stringify(msg));
  //$('#messages').append($('<li>').text(JSON.stringify(msg)));
});
var currentTID=0;
var curLogins=[];

socket.on('StartTournament', function(msg){
  //alert('StartTournament with ID: ' + JSON.stringify(msg));
  //alert('StartTournament socket works!!');
  var tournamentID = msg['tournamentID'];
  alert('StartTournament with ID: ' + tournamentID);
  console.log('Jugadores:' + msg.logins);
  curLogins = msg.logins;



  currentTID = tournamentID;
  console.log('tID = ' + currentTID);
  //var gameURL = 'PingPong';
  var text = '<button onclick="startGame()" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
  $('#news').append(text);
  startGame();
  ///$('#news').append($('<button>').text(JSON.stringify(msg)));
});

socket.on('update', function(msg){
  alert.stringify(JSON.stringify(msg));
} )

function startGame(gameURL){
  var a = window.open(gameURL? gameURL:'/Game?tournamentID='+currentTID);
  a.logins= curLogins;
  a.login = login;
}

/* CLIENT SIDE INFO:
  Login Password
  --Money
  Registered TournamentIDs

*/