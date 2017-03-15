const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jquery = require('jquery');
const socketFn = require('./server/socket');

app.use(express.static(__dirname + '/src'));

app.get('/', function(req, res){
  res.send('/index.html');
});

//socket.io
io.on('connection', socketFn.bind(null, io));

http.listen(3000, function(){
  console.log('listening on *:3000');
});