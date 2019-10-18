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

  /**
   * When a professor updates the status of a question, all users in the session must be notified
   * @param {object} data
   * @param {number} data.questionID ID of the question to update
   * @param {string} data.status New status to set
   */
  process.on("updateProfessorQuestionStatus", async (data) => {
    const roomS = `SESSION-${data.sesionId}-STUDENT`;
    io.to(roomS).emit("updateProfessorQuestionStatus", data);
    const roomP = `SESSION-${data.sesionId}-PROFESSOR`;
    io.to(roomP).emit("updateProfessorQuestionStatus", data);
  });

  /**
   * When a student answers a question, the response must be sent to the professor of the session
   *
   * @params {object} data
   * @params {number} data.question ID of the question the student answered
   * @params {number} data.id ID of the answer
   * @params {number} data.creador_id Id of the student who answered
   * @params {string} data.texto Answer
   * @params {Date} data.createdAt Date the answer was created
   * @params {number} data.sesionId ID of the session the question belongs to
   */
  process.on("answerQuestion", async (data) => {
    const room = `SESSION-${data.sesionId}-PROFESSOR`;
    data["creador"] = await socketController.getSocketUserData(data.creador_id);
    io.to(room).emit("answerQuestion", data);
  });

  io.on("connection", (socket) => {

    socket.on('joinChatRoom', (data, callback) => {
      const room = socketController.getRoom(data);
      socketController.joinRoomHandler(data)
      console.log("joinning room: ", room);
      socket.join(room);
      if (callback) {
        callback(200);
      }
    });

    socket.on('leaveChatRoom', (data, callback) => {
      const room = socketController.getRoom(data);
      socketController.leaveRoomHandler(data);
      console.log("leaving room: ", room);
      socket.leave(room);
      if (callback) {
        callback(200);
      }
    });

  });

};
