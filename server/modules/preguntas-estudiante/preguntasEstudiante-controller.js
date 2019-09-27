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
      texto: datosPregunta.texto,
      imagen: datosPregunta.imagen,
      creador_id: datosUsuario.id,
      sesion_id: datosPregunta.idSesion
    };
    const pregunta = await db["PreguntaEstudiante"].create(data);

    return Promise.resolve(pregunta);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};


module.exports = {
  crearPregunta,
};
