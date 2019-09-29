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

  /**
   * When a student asks a question, the question must be sent to the professor of the session
   * The socket is sent to all the users in the session, the logic to only show it to the professor is handled in the front end
   *
   * @params {object} data
   * @params {number} data.status ID of the new status
   * @params {number} data.id Session ID
   * @params {number} data.paraleloId
   */
  process.on("newStudentQuestion", async (data) => {
    const room = `SESSION-${data.sesionId}-PROFESSOR`;
    data["user"] = await socketController.getSocketUserData(data.creador_id);
    io.to(room).emit("newStudentQuestion", data);
  });

  process.on("newProfessorQuestion", async (data) => {
    data["user"] = await socketController.getSocketUserData(data.creador_id);
    io.emit("newProfessorQuestion", data);
  });

  io.on("connection", (socket) => {

    socket.on('joinChatRoom', (data, callback) => {
      const room = socketController.getRoom(data);
      console.log("joinning room: ", room);
      socket.join(room);
      if (callback) {
        callback(200);
      }
    });

    socket.on('leaveChatRoom', (data, callback) => {
      const room = socketController.getRoom(data);
      console.log("leaving room: ", room);
      socket.leave(room);
      if (callback) {
        callback(200);
      }
    });

  });

};
