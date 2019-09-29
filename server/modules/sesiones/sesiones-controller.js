const { Mysql } = require("./../../../db");
const db = Mysql.db;

const usuarioConfig = require("../usuarios/usuarios-config");

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

/**
  * Crea un registro de una sesion en esato PENDIENTE
  * Una sesion pertenece a un paralelo
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idParalelo ID del paralelo al que pertenece la sesion
  * @param {String} datosSesion.nombre Nombre de la sesion a crear
  * @param {Object} datosUsuario
  * @param {Number} datosUsuario.id Id del usuario que crea la sesion
  */
async function crearSesion(datosSesion, datosUsuario) {
  try {
    const paraleloQuery = { id: datosSesion.idParalelo };
    const paralelo = await db["Paralelo"].findOne({
      where: paraleloQuery,
      attributes: ["id", "nombre"],
      include: [
        {
          model: db["Materia"],
          attributes: ["id", "nombre"],
        }
      ]
    });
    if (!paralelo) {
      return Promise.reject("Paralelo not found.");
    }

    const estadoQuery = { nombre: "PENDIENTE" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    let data = {
      nombre: datosSesion.nombre,
      activo: false,
      estado_actual_id: estado.id,
    };
    const sesion = await db["Sesion"].create(data);

    sesion.setParalelo(paralelo.id);
    sesion.setRegistrador(datosUsuario.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = Object.assign({}, sesion.dataValues);
    socketData["course"] = paralelo.dataValues.id;
    socketData["courseName"] = paralelo.dataValues.nombre;
    socketData["subject"] = paralelo.dataValues.materia.dataValues.id;
    socketData["subjectName"] = paralelo.dataValues.materia.dataValues.nombre;
    process.emit("sessionCreated", socketData);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

async function obtenerSesiones(queryData) {
  try {
    const sesionQuery = {
      paralelo_id: queryData.paralelo,
    };
    let sesiones = await db["Sesion"].findAll({
      where: sesionQuery,
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
    if (!sesiones) {
      sesiones = [];
    }

    return Promise.resolve(sesiones);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
  * Da por iniciada una sesion previamente creada
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idSesion ID de la sesion a iniciar
  */
async function iniciarSesion(datosSesion) {
  try {
    const sesionQuery = { id: datosSesion.idSesion };
    const sesion = await db["Sesion"].findOne({ where: sesionQuery });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    if (sesion.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const estadoQuery = { nombre: "ACTIVA" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    await sesion.update({
      estado_actual_id: estado.id,
      fecha_inicio: new Date(),
      activo: true,
    });

    await sesion.addActualizacionesEstado(estado.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: sesion.id,
      status: estado.id,
      paraleloId: sesion.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
  * Da por finalizada una sesion previamente creada
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idSesion ID de la sesion a iniciar
  */
async function terminarSesion(datosSesion) {
  try {
    const sesionQuery = { id: datosSesion.idSesion };
    const sesion = await db["Sesion"].findOne({ where: sesionQuery });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    if (sesion.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const estadoQuery = { nombre: "TERMINADA" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    await sesion.update({
      estado_actual_id: estado.id,
      fecha_fin: new Date(),
      activo: false,
    });

    await sesion.addActualizacionesEstado(estado.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = {
      id: sesion.id,
      status: estado.id,
      paraleloId: sesion.dataValues.paraleloId,
    };
    process.emit("updateSessionStatus", socketData);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return error;
  }
};


/**
  * Devuelve los datos de preguntas de una sesion
  *
  * @param {object} sessionData
  * @param {number} sessionData.idSesion
  * @param {object} userData
  * @param {number} userData.id ID of the user who made the request
  * @param {string} userData.rol User's role
  */
async function obtenerDatosSesion(sessionData, userData) {
  try {
    const sesionQuery = { id: sessionData.idSesion };
    const sesionProjection = ["nombre", "fecha_inicio", "fecha_fin"];
    const usuarioProjection = ["id", "nombres", "apellidos", "email"];
    const sesionPopulate = [
      {
        model: db["Paralelo"],
        attributes: ["nombre", "codigo", "id"]
      },
      {
        model: db["Usuario"],
        as: "registrador",
        attributes: usuarioProjection
      },
      {
        model: db["EstadoSesion"],
        as: "estadoActual",
        attributes: ["id", "nombre"]
      }
    ];
    const sesion = await db["Sesion"].findOne({
      where: sesionQuery,
      attributes: sesionProjection,
      include: sesionPopulate,
    });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }

    const questions = await getSessionQuestions(sessionData.idSesion, userData);

    const data = Object.assign({}, sesion.dataValues);
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

module.exports = {
  crearSesion,
  iniciarSesion,
  terminarSesion,
  obtenerDatosSesion,
  obtenerSesiones,
};
