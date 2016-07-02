import actions from '../actions/ProfileActions';
// console.error('SOCKET LISTENER INIT');
socket.on('StartTournament', (msg) => {
  // console.log('startTournament SocketListener', msg);
  actions.startTournament(msg);
});

socket.on('chat message', (msg) => {
  actions.appendChatMessage(msg);
});
// socket.on('Tell', Tell);
socket.on('FinishTournament', (msg) => {
  console.error('FinishTournament', msg);
  actions.finishTournament(msg);
});

socket.on('activity', (msg) => {
  // alert(JSON.stringify(msg));
});

socket.on('update', (msg) => {
  // console.log('update', msg);
  actions.updateTournaments(msg.tournaments);
});

socket.on('newsUpdate', (msg) => {
  // console.log('newsUpdate', msg);
  if (msg && msg.msg === login) {
    console.warn('newsUpdate for me', msg);
    // actions.loadNews();
    actions.update();
  }
});
