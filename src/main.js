$(function () {
    var socket = io.connect();
    var room = 'New Room';
    socket.on('connect', function() {
      socket.emit('room', room);
    });
  
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });