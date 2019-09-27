module.exports = (app) => {
  const io = require('socket.io').listen(app);
  io.origins("*:*");

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      io.emit("sessionExpired");
    } else {
      next();
    }
  });

  io.on("connection", (socket) => {
    let counter = 1;
    console.log(`Connected users: ${counter}`);
    counter++;

    socket.on('joinChatRoom', (data, callback) => {
      let roomID = `courseID-${data}`;
      console.log("joinning room: ", roomID);
      socket.join(roomID);
      if (callback) {
        callback(200);
      }
    });

    socket.on('leaveChatRoom', (data, callback) => {
      let roomID = `courseID-${data}`;
      console.log("leaving room: ", roomID);
      socket.leave(roomID);
      if (callback) {
        callback(200);
      }
    });
  });

};
