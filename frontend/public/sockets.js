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
  var host = msg.host;
  var port = msg.port;


  currentTID = tournamentID;
  console.log('tID = ' + currentTID);

  //var gameURL = 'PingPong';
  var text = '<button onclick="startGame('+host+','+port+ ')" style="width:300px;height:60px;"> Play in Tournament</button>';//"' + gameURL + '"
  $('#news').append(text);
  startGame(host, port);
  ///$('#news').append($('<button>').text(JSON.stringify(msg)));
});

/*socket.on('update', function(msg){
  alert.stringify(JSON.stringify(msg));
} )*/

function startGame(gameURL, port){
  if (gameURL && port){
    //alert(login);
    //var a = window.open(gameURL? gameURL:'/Game?tournamentID='+currentTID);
    var addr = 'http://'+gameURL+':'+port+'/Game?tournamentID='+currentTID;
    /*var a = window.open();
    //var a = window.open('http://'+gameURL+':'+80+'/Game?tournamentID='+currentTID);//80=port
    
    a.logins= curLogins;
    a.login = login;*/
    var txt = '<form id="TheForm" method="post" action="'+addr+'" target="TheWindow"><input type="hidden" name="login" value="'+login+'" /> </form>';
    console.log(txt);
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