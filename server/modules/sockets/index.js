const socketController = require("./socket-controller");

/**
 * ROOMS
 *
 * COURSE  -> COURSE-{{ courseID }}
 * SESSION -> SESSION-{{ sessionID }} 
 * GROUP   -> GROUP-{{ groupID }}
 */

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

  /**
   * When a new session is created, all the users in the COURSE ROOM must be notified
   * The data sent is the created session data
   */
  process.on("sessionCreated", data => {
    const room = `COURSE-${data.paraleloId}`;
    io.to(room).emit("sessionCreated", data);
  });

  /**
   * When a professor updates the status of a session, either by starting or ending it, 
   * all the users in the COURSE ROOM must be notified
   * @params {object} data
   * @params {number} data.status ID of the new status
   * @params {number} data.id Session ID
   * @params {number} data.paraleloId
   */
  process.on("updateSessionStatus", data => {
    const room = `COURSE-${data.paraleloId}`;
    io.to(room).emit("updateSessionStatus", data);
  });

  process.on("newStudentQuestion", async (data) => {
    data["user"] = await socketController.getSocketUserData(data.creador_id);
    io.emit("newStudentQuestion", data);
  });

  process.on("newProfessorQuestion", async (data) => {
    data["user"] = await socketController.getSocketUserData(data.creador_id);
    io.emit("newProfessorQuestion", data);
  });

  io.on("connection", (socket) => {
    let counter = 1;
    console.log(`Connected users: ${counter}`);
    counter++;

    socket.on('joinChatRoom', (data, callback) => {
      let roomID = `COURSE-${data}`;
      console.log("joinning room: ", roomID);
      socket.join(roomID);
      if (callback) {
        callback(200);
      }
    });

    socket.on('leaveChatRoom', (data, callback) => {
      let roomID = `COURSE-${data}`;
      console.log("leaving room: ", roomID);
      socket.leave(roomID);
      if (callback) {
        callback(200);
      }
    });
  });

};
