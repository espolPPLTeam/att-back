const { Mysql } = require("./../../../db");
const db = Mysql.db;

const preguntasProfesorConfig = require("./preguntasProfesor-config");

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

/**
  * Creates the register of a new Professor Question
  *
  * @param {Object} questionData
  * @param {String} questionData.titulo
  * @param {String} questionData.texto
  * @param {String} questionData.imagen
  * @param {Number} questionData.idSesion
  * @param {Object} userData
  * @param {Number} userData.id
  */
async function createQuestion(questionData, userData) {
  try {
    const sessionQuery = { id: questionData.idSesion };
    const session = await db["Sesion"].findOne({ where: sessionQuery });
    if (!session) {
      return Promise.reject("Sesion no existe");
    }
    if (session.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion terminada. No se puede anadir pregunta");
    }

    const data = {
      titulo: questionData.titulo,
      texto: questionData.texto,
      imagen: questionData.imagen,
      creador_id: userData.id,
      sesion_id: questionData.idSesion,
      estado: preguntasProfesorConfig.status.PENDING,
    };
    const question = await db["PreguntaProfesor"].create(data);

    return Promise.resolve(question);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
 * Create an answer for a Professor Question
 *
 * @param {object} answerData
 * @param {string} answerData.texto
 * @param {number} answerData.idPregunta
 * @param {object} userData
 * @param {number} userData.id
 */
async function answerQuestion(answerData, userData) {
  try {
    const questionQuery = { id: answerData.idPregunta };
    const question = await db["PreguntaProfesor"].findOne({ where: questionQuery });
    if (!question) {
      return Promise.reject("Pregunta no existe");
    }
    const data = {
      texto: answerData.texto,
      creador_id: userData.id
    };
    const answer = await db["Respuesta"].create(data);
    answer.setPregunta(question.id);

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = Object.assign({}, answer.dataValues);
    socketData["sesionId"] = question.dataValues.sesionId;
    socketData["creador_id"] = userData.id;
    socketData["question"] = answerData.idPregunta;
    process.emit("answerQuestion", socketData);

    return Promise.resolve(answer);
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

    //=====================//
    //     SEND SOCKET     //
    //=====================//
    const socketData = Object.assign({},   questionData);
    socketData["sesionId"] = question.dataValues.sesionId;
    process.emit("updateProfessorQuestionStatus", socketData);

    return Promise.resolve(question);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  createQuestion,
  answerQuestion,
  updateQuestionStatus,
};
