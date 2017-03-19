const express = require('express');
const app = express();
const socketFn = require('./server/socket');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/src'));


app.get('/', function(request, response) {
  response.render('/index.html');
});

io.on('connection', socketFn.bind(null, io));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


