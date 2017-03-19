$(function () {
    var socket = io.connect();
    var room = 'New Room';
    socket.on('connect', function() {
      socket.emit('room', room);
    });
  
    $('form').on('submit', function(){
      var choice = $('.choice');
      var value = choice.is(':disabled');
      var send = $('.send');
      socket.emit('message', value ? value : choice.find('option:selected').text(), room);
      toggleFormEnable();
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

      if (msg.toString() === '1') {
        $('form').hide();
        $('.win').show();
      }
      $('#messages').append($('<li>').text(msg));
      toggleFormEnable(true);
    });

    socket.on('winner', function(msg) {
      $('.player').text(msg);
    });

    function toggleFormEnable(option) {
      var disable = option || true;
      var send = $('.send');

      if (option || send.prop('disabled') === true) {
        disable = false;
      }

      send.prop('disabled', disable);
    }

  });