import actions from '../actions/ProfileActions';
socket.on('StartTournament', (msg) => {
  // console.log('startTournament SocketListener', msg);
  actions.startTournament(msg);
});

socket.on('chat message', (msg) => {
  actions.appendChatMessage(msg);
});
// socket.on('Tell', Tell);
socket.on('FinishTournament', actions.finishTournament);

socket.on('activity', (msg) => {
  // alert(JSON.stringify(msg));
});

socket.on('newsUpdate', (msg) => {
  console.log('newsUpdate', msg);
  if (msg && msg.msg === login) {
    actions.loadNews();
  }
});
