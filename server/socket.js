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
    socket.join(room);
    io.sockets.in(room).emit('message', 'a user joined the room');
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
}
module.exports = function(io, socket){
  socket.on('message', function(msg, room){
      const msgVal = checkMessage(io, msg, room);

      io.sockets.in(room).emit('message', msgVal);
  });
  socket.on('room', roomFn.bind(null, {io, socket}));
};