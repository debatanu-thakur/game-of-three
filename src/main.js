$(function () {
    var socket = io.connect();
    var room = 'New Room';
    socket.on('connect', function() {
      socket.emit('room', room);
    });
  
    $('form').submit(function(){
      var choice = $('.choice');
      var value = choice.is(':disabled');
      socket.emit('message', value ? value : choice.find('option:selected').text(), room);
      return false;
    });
    socket.on('message', function(msg){
      var choice = $('.choice');
      var send = $('.send');

      if (msg === true) {
        choice.prop('disabled', false);
        send.text('Send');
        return;
      }
      $('#messages').append($('<li>').text(msg));
    });

  });