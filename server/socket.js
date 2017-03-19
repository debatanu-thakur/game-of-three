const rooms = [];
const chatMsg = 'message';
const GameClass = function({room, randomCurrent, players}) {
    this.room = room;
    this.randomCurrent = randomCurrent || null;
    this.players = players || [];
};
const generateRandom = function(room) {
    const gameClass = findGameClass(room);

    gameClass.randomCurrent = Math.floor(Math.random() * 100);
};
const findGameClass = function(room) {
    return rooms.find(x => x.room === room);
}
const roomFn = function({io, socket}, room) {
    if (!rooms.includes(room)) {
        rooms.push(new GameClass({room}));
    }
    const gameClass = findGameClass(room);

    socket.join(room);
    gameClass.players.push(socket);
};
const checkMessage = function(io, msg, room) {
    const gameClass = findGameClass(room);

    switch (msg) {
        case '-1':
            gameClass.randomCurrent = (parseInt(gameClass.randomCurrent, 10) - 1) / 3
            return gameClass.randomCurrent;
        case '0':
            gameClass.randomCurrent = (parseInt(gameClass.randomCurrent, 10)) / 3
            return gameClass.randomCurrent;
        case '1':
            gameClass.randomCurrent = (parseInt(gameClass.randomCurrent, 10) + 1) / 3
            return gameClass.randomCurrent;
        case true:
            generateRandom(room);
            io.sockets.in(room).emit('message', gameClass.randomCurrent);
        default:
            return msg;
    }
};
const getNextPlayer = function(room, socket) {
    const gameClass = findGameClass(room);

    return gameClass.players.filter(player => player.id !== socket.id)[0];
};
const declareWinner = function(room, io, socket) {
    const gameClass = findGameClass(room);

    const index = gameClass.players.findIndex(player => player.id === socket.id);
    
    io.sockets.in(room).emit('winner', index + 1);
        
};
module.exports = {
connect(io, socket) {
  socket.on('message', function(msg, room){
      const msgVal = checkMessage(io, msg, room);
      
      if (msgVal === true || msgVal === 1) {
          io.sockets.in(room).emit('message', msgVal);
          if(msgVal === 1) {
              declareWinner(room, io, socket);
          }
          return;
      }
      const nextPlayer = getNextPlayer(room, socket);

      socket.to(nextPlayer.id).emit('message', msgVal);

  });
  socket.on('room', roomFn.bind(null, {io, socket}));
  socket.on('disconnect', function() {
    rooms.forEach(room => {
        let index = 0;
        while (index !== room.players.length) {
            const player = room.players[index];

            if (player.disconnected) {
                room.players.splice(index, 1);    
            }
            else {
                index++;
            }
        }
        console.log(room.players.length);
    });
  });
}
};