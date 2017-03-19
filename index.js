const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jquery = require('jquery');

app.use(express.static(__dirname + '/src'));

app.get('/', function(req, res){
  res.send('/index.html');
});

//socket.io
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});