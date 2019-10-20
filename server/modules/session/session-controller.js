const CourseService = require("../course/course-service");
const SessionService = require("./session-service");
const ProfessorQuestionService = require("../professor-question/professorQuestion-service");
const StudentQuestionService = require("../student-question/studentQuestion-service");

const userConfig = require("../user/user-config");
const sessionConfig = require("./session-config");

/**
 * Creates the register of a new session in a course
 *
 * @param {Object} sessionData
 * @param {Number} sessionData.idParalelo ID of the course the session belongs to
 * @param {String} sessionData.nombre Name of the session
 * @param {Object} userData
 * @param {Number} userData.id ID of the user who creates the session
 */
async function createSession(sessionData, userData) {
  try {
    const course = await CourseService.getCourseById(sessionData.idParalelo);
    if (!course) {
      return Promise.reject("Paralelo not found.");
    }

    let data = {
      nombre: sessionData.nombre,
      activo: false,
      estado_actual_id: sessionConfig.status.PENDING.id,
    };
    const session = await SessionService.createSession(data);

    session.setParalelo(course.id);
    session.setRegistrador(userData.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = Object.assign({}, session.dataValues);
    socketData["course"] = course.dataValues.id;
    socketData["courseName"] = course.dataValues.nombre;
    socketData["subject"] = course.dataValues.materia.dataValues.id;
    socketData["subjectName"] = course.dataValues.materia.dataValues.nombre;
    process.emit("sessionCreated", socketData);

    return Promise.resolve(session);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * Queries all the registers in the Sesion table. Filters by the fields in queryData
 * @param {object} queryData
 * @param {number} queryData.paralelo ID of the course to filter the sessions
 * @return {Array}
 */
async function getSessions(queryData) {
  try {
    const sessionQuery = {
      paralelo_id: queryData.paralelo,
    };
    let sessions = await SessionService.getSessions(sessionQuery);
    if (!sessions) {
      sessions = [];
    }

    return Promise.resolve(sessions);
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * Starts a session and sends the socket to all users in the course room
 *
 * @param {Object} sessionData
 * @param {Number} sessionData.idSesion ID de la sesion a iniciar
 */
async function start(sessionData) {
  try {
    const session = await SessionService.getSessionByID(sessionData.idSesion);
    if (!session) {
      return Promise.reject("Sesion no existe");
    }
    if (session.get("estado_actual_id") == sessionConfig.status.TERMINATED.id) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    await session.update({
      estado_actual_id: sessionConfig.status.ACTIVE.id,
      fecha_inicio: new Date(),
      activo: true,
    });

    await session.addActualizacionesEstado(sessionConfig.status.ACTIVE.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: session.id,
      status: sessionConfig.status.ACTIVE.id,
      paraleloId: session.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(session);
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
  * Terminates an ACTIVE session and sends the socket to all users in the course room
  *
  * @param {Object} sessionData
  * @param {Number} sessionData.idSesion ID de la sesion a iniciar
  */
async function end(sessionData) {
  try {
    const session = await SessionService.getSessionByID(sessionData.idSesion);
    if (!session) {
      return Promise.reject("Sesion no existe");
    }
    if (session.get("estado_actual_id") == sessionConfig.status.TERMINATED.id) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    await session.update({
      estado_actual_id: sessionConfig.status.TERMINATED.id,
      fecha_fin: new Date(),
      activo: false,
    });

    await session.addActualizacionesEstado(sessionConfig.status.TERMINATED.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: session.id,
      status: sessionConfig.status.TERMINATED.id,
      paraleloId: session.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(session);
  } catch (error) {
    console.error(error);
    return error;
  }
}


/**
 * Returns all the questions from one particular session
 *
 * @param {object} sessionData
 * @param {number} sessionData.idSesion
 * @param {object} userData
 * @param {number} userData.id ID of the user who made the request
 * @param {string} userData.rol User's role
 */
async function getSessionData(sessionData, userData) {
  try {
    const session = await SessionService.getSessionData(sessionData.idSesion);
    if (!session) {
      return Promise.reject("Sesion no existe");
    }

    const questions = await getSessionQuestions(sessionData.idSesion, userData);

    const data = Object.assign({}, session.dataValues);
    data["preguntasProfesor"] = questions.preguntasProfesor;
    data["preguntasEstudiante"] = questions.preguntasEstudiante;

    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * Returns the corresponding questions based on the role of the user making the request
 *
 * @description
 * All professor questions are always returned
 * If user is a professor, all student questions of the session are returned
 * If user is a student, only his/her questions are returned
 *
 * @param {number} sessionID ID of the session the questions belong to
 * @param {object} userData
 * @param {number} userData.id ID of the user who made the request
 * @param {string} userData.rol User's role
 */
async function getSessionQuestions(sessionID, userData) {
  try {
    const professorQuestions = await ProfessorQuestionService.getSessionQuestions(sessionID);

    let userID = null;
    if (userData.rol === userConfig.role.STUDENT.text) {
      userID = userData.id;
    }
    const studentQuestions = await StudentQuestionService.getSessionQuestions(sessionID, userID);

    const data = {
      preguntasProfesor: professorQuestions.map(question => question.dataValues),
      preguntasEstudiante: studentQuestions.map(question => question.dataValues),
    };
    return Promise.resolve(data);
  } catch(error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * If the session is PENDING or ACTIVE, joins the user to the session
 * @param {object} sessionData
 * @param {number} sessionData.sessionID
 * @param {object} userData
 * @param {number} userData.userID
 */
async function joinSession(sessionData, userData) {
  try {
    const session = await SessionService.getSessionByID(sessionData.sessionID);
    if (!session) {
      console.error("Session doesn't exists");
      return false;
    }
    if (session.estado_actual_id === sessionConfig.status.TERMINATED.id) {
      return false;
    }
    const userSession = await SessionService.getUserInSession(userData.userID, sessionData.sessionID);
    if (userSession) {
      await userSession.update({
        activo: true,
      });
    } else {
      await session.addUsuario(userData.userID);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * If the session is PENDING or ACTIVE, sets the user as not in the session
 * @param {object} sessionData
 * @param {number} sessionData.sessionID
 * @param {object} userData
 * @param {number} userData.userID
 */
async function leaveSession(sessionData, userData) {
  try {
    const session = await SessionService.getSessionByID(sessionData.sessionID);
    if (!session) {
      console.error("Session doesn't exists");
      return false;
    }
    if (session.estado_actual_id === sessionConfig.status.TERMINATED.id) {
      console.error("Session is terminated");
      return false;
    }

    const userSession = await SessionService.getUserInSession(userData.userID, sessionData.sessionID);
    if (userSession) {
      await userSession.update({
        activo: false,
      });
    }

  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createSession,
  start,
  end,
  getSessionData,
  getSessions,
  joinSession,
  leaveSession,
};
