const { Mysql } = require("./../../../db");
const db = Mysql.db;

const usuarioConfig = require("../usuarios/usuarios-config");
const sessionsConfig = require("./sessions-config");

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

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
    const courseQuery = { id: sessionData.idParalelo };
    const course = await db["Paralelo"].findOne({
      where: courseQuery,
      attributes: ["id", "nombre"],
      include: [
        {
          model: db["Materia"],
          attributes: ["id", "nombre"],
        }
      ]
    });
    if (!course) {
      return Promise.reject("Paralelo not found.");
    }

    const statusQuery = { nombre: "PENDIENTE" };
    const status = await db["EstadoSesion"].findOne({ where: statusQuery });

    let data = {
      nombre: sessionData.nombre,
      activo: false,
      estado_actual_id: status.id,
    };
    const session = await db["Sesion"].create(data);

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
};

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
    let sessions = await db["Sesion"].findAll({
      where: sessionQuery,
      attributes: ["nombre", "activo", "id"],
      include: [
        {
          model: db["Paralelo"],
          attributes: ["nombre", "codigo", "id"],
          include: [
            {
              model: db["Materia"],
              attributes: ["nombre", "codigo", "id"],
            }
          ]
        },
        {
          model: db["EstadoSesion"],
          as: "estadoActual",
          attributes: ["id", "nombre"]
        }
      ]
    });
    if (!sessions) {
      sessions = [];
    }

    return Promise.resolve(sessions);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
 * Starts a session and sends the socket to all users in the course room
 *
 * @param {Object} sessionData
 * @param {Number} sessionData.idSesion ID de la sesion a iniciar
 */
async function start(sessionData) {
  try {
    const sessionQuery = { id: sessionData.idSesion };
    const session = await db["Sesion"].findOne({ where: sessionQuery });
    if (!session) {
      return Promise.reject("Sesion no existe");
    }
    if (session.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const statusQuery = { nombre: "ACTIVA" };
    const status = await db["EstadoSesion"].findOne({ where: statusQuery });

    await session.update({
      estado_actual_id: status.id,
      fecha_inicio: new Date(),
      activo: true,
    });

    await session.addActualizacionesEstado(status.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: session.id,
      status: status.id,
      paraleloId: session.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(session);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
  * Terminates an ACTIVE session and sends the socket to all users in the course room
  *
  * @param {Object} sessionData
  * @param {Number} sessionData.idSesion ID de la sesion a iniciar
  */
async function end(sessionData) {
  try {
    const sessionQuery = { id: sessionData.idSesion };
    const session = await db["Sesion"].findOne({ where: sessionQuery });
    if (!session) {
      return Promise.reject("Sesion no existe");
    }
    if (session.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const statusQuery = { nombre: "TERMINADA" };
    const status = await db["EstadoSesion"].findOne({ where: statusQuery });

    await session.update({
      estado_actual_id: status.id,
      fecha_fin: new Date(),
      activo: false,
    });

    await session.addActualizacionesEstado(status.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: session.id,
      status: status.id,
      paraleloId: session.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(session);
  } catch (error) {
    console.error(error);
    return error;
  }
};


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
    const sessionQuery = { id: sessionData.idSesion };
    const sessionProjection = ["nombre", "fecha_inicio", "fecha_fin"];
    const userProjection = ["id", "nombres", "apellidos", "email"];
    const sessionPopulate = [
      {
        model: db["Paralelo"],
        attributes: ["nombre", "codigo", "id"]
      },
      {
        model: db["Usuario"],
        as: "registrador",
        attributes: userProjection
      },
      {
        model: db["EstadoSesion"],
        as: "estadoActual",
        attributes: ["id", "nombre"]
      }
    ];
    const session = await db["Sesion"].findOne({
      where: sessionQuery,
      attributes: sessionProjection,
      include: sessionPopulate,
    });
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
};

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
    const professorQuestionsQuery = { sesion_id: sessionID };
    const usuarioProjection = ["id", "nombres", "apellidos", "email"];
    /** @type {Array} */
    const professorQuestions = await db["PreguntaProfesor"].findAll({
      where: professorQuestionsQuery,
      attributes: ["id", "texto", "imagen", "createdAt", "titulo", "estado"],
      include: [
        {
          model: db["Respuesta"],
          as: "respuestas",
          attributes: ["id", "texto", "calificacion", "createdAt", "imagen"],
          include: [
            {
              model: db["Usuario"],
              as: "creador",
              attributes: usuarioProjection,
            }
          ]
        },
        {
          model: db["Usuario"],
          as: "creador",
          attributes: usuarioProjection
        }
      ],
    });

    let studentQuestionsQuery = { sesion_id: sessionID };
    if (userData.rol === usuarioConfig.role.STUDENT.text) {
      studentQuestionsQuery["creador_id"] = userData.id;
    }
    /** @type {Array} */
    const studentQuestions = await db["PreguntaEstudiante"].findAll({
      where: studentQuestionsQuery,
      attributes: ["id", "texto", "imagen", "createdAt"],
      include: [
        {
          model: db["Usuario"],
          as: "creador",
          attributes: usuarioProjection,
        },
      ],
    });

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
    const sessionQuery = { id: sessionData.sessionID };
    const session = await db["Sesion"].findOne({ where: sessionQuery });
    if (!session) {
      console.error("Session doesn't exists");
      return false;
    }
    if (session.estado_actual_id === sessionsConfig.status.TERMINATED.id) {
      return false;
    }

    const userSession = await db["UsuarioSesion"].findOne({
      where: {
        sesion_id: sessionData.sessionID,
        usuario_id: userData.userID,
      }
    });
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

module.exports = {
  createSession,
  start,
  end,
  getSessionData,
  getSessions,
  joinSession,
};
