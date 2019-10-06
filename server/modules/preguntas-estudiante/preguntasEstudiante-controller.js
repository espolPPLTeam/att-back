const { Mysql } = require("./../../../db");
const db = Mysql.db;

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

/**
  * Crea un registro de pregunta-profesor
  *
  * @description
  * Una pregunta tiene que pertenecer a una sesion
  * Una pregunta tiene que tener un registrador
  *
  * @param {Object} questionData
  * @param {String} questionData.texto Descripcion de la pregunta
  * @param {String} questionData.imagen URL de la imagen vinculada a esta pregunta
  * @param {Number} questionData.idSesion ID de la sesion a la que pertenece esta pregunta
  * @param {Object} userData
  * @param {Number} userData.id ID del usuario que crea la pregunta
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
      texto: questionData.texto,
      imagen: questionData.imagen,
      creador_id: userData.id,
      sesion_id: questionData.idSesion
    };
    const question = await db["PreguntaEstudiante"].create(data);
    
    process.emit("newStudentQuestion", question.dataValues);

    return Promise.resolve(question);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};


module.exports = {
  createQuestion,
};
