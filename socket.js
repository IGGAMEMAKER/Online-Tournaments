var Message = require('./models/message');

var io;
var socket_enabled = true;

function defendText(text){
  return text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}

module.exports = function(app, server){
	io = require('socket.io')(server);

	console.log('socket loaded');
  io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
      console.log(msg);
      var login = msg.login;
      var text = msg.text;

			if (!login || !text) return;

      var def_login = defendText(login);
      var def_text = defendText(text);

      var message = { text : def_text , sender: def_login };
      io.emit('chat message', message);
      message.type = 'chat';
      io.emit('activity', message);

      // message.room = 'default';
      var room = 'default';
      Message.chat.add(room, def_login, def_text);
    });
		socket.on('support', function (msg) {
			console.log('support', msg);
			var login = msg.login;
			var text = msg.text;

			if (!login || !text) return;

			var def_login = defendText(login);
			var def_text = defendText(text);

			var room = 'support-' + login;
			Message.chat.add(room, def_login, def_text);
		});
  });
  // return io;
	return {
		io:io,
		// of: io.of(room).emit,
		emit: io.emit,
		Send: function (tag, message, force){
			if (socket_enabled || force){
				io.emit(tag, message);
			}
		},
		SendToRoom: function (room, event, msg, socket){
			if (socket_enabled) io.of(room).emit(event, msg);
		},
		forceTakingNews: function (login, delay){
			setTimeout(function() {
				io.emit('newsUpdate', {msg:login})
			}, delay||0);
		}
	}
};


  // io = require('socket.io')(server);
  // io = require('./socket')(app, server)
  /*io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);*/
  /*io.set('transports', [
      'websocket'
    , 'polling'
  ]);*/
