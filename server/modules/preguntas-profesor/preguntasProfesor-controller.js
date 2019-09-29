const { Mysql } = require("./../../../db");
const db = Mysql.db;

const preguntasProfesorConfig = require("./preguntasProfesor-config");

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

/**
  * Crea un registro de pregunta-profesor
  *
  * @description
  * Una pregunta tiene que pertenecer a una sesion
  * Una pregunta tiene que tener un registrador
  *
  * @param {Object} datosPregunta
  * @param {String} datosPregunta.texto Descripcion de la pregunta
  * @param {String} datosPregunta.imagen URL de la imagen vinculada a esta pregunta
  * @param {Number} datosPregunta.idSesion ID de la sesion a la que pertenece esta pregunta
  * @param {Object} datosUsuario
  * @param {Number} datosUsuario.id ID del usuario que crea la pregunta
  */
async function crearPregunta(datosPregunta, datosUsuario) {
  try {
    const sesionQuery = { id: datosPregunta.idSesion };
    const sesion = await db["Sesion"].findOne({ where: sesionQuery });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    if (sesion.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion terminada. No se puede anadir pregunta");
    }

    const data = {
      titulo: datosPregunta.titulo,
      texto: datosPregunta.texto,
      imagen: datosPregunta.imagen,
      creador_id: datosUsuario.id,
      sesion_id: datosPregunta.idSesion,
      estado: preguntasProfesorConfig.status.PENDING,
    };
    const pregunta = await db["PreguntaProfesor"].create(data);

    return Promise.resolve(pregunta);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

async function responderPregunta(datosRespuesta, datosUsuario) {
  try {
    const preguntaQuery = { id: datosRespuesta.idPregunta };
    const pregunta = await db["PreguntaProfesor"].findOne({ where: preguntaQuery });
    if (!pregunta) {
      return Promise.reject("Pregunta no existe");
    }
    const data = {
      texto: datosRespuesta.texto,
      creador_id: datosUsuario.id
    };
    const respuesta = await db["Respuesta"].create(data);
    respuesta.setPregunta(pregunta.id);

    return Promise.resolve(respuesta);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
 * Updates the status of an existing question
 *
 * @param {object} questionData
 * @param {number} questionData.questionID ID of the question to update
 * @param {string} questionData.status New status to set
 */
async function updateQuestionStatus(questionData) {
  try {
    const questionQuery = { id: questionData.questionID };
    const question = await db["PreguntaProfesor"].findOne({ where: questionQuery });
    if (!question) {
      return Promise.reject("Pregunta no existe");
    }

    await question.update({
      estado: questionData.status,
    });

    return Promise.resolve(question);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearPregunta,
  responderPregunta,
  updateQuestionStatus,
};
