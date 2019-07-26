const { Mysql } = require("./../../../db");
const db = Mysql.db;

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
    const paralelo = await db["Paralelo"].findOne({ where: paraleloQuery });
    if (!paralelo) {
      return Promise.reject("Paralelo not found.");
    }

    const estadoQuery = { nombre: "PENDIENTE" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    let data = {
      nombre: datosSesion.nombre,
      activo: false,
    };
    const sesion = await db["Sesion"].create(data);

    sesion.setParalelo(paralelo.id);
    sesion.setActual(estado.id);
    sesion.setRegistrador(datosUsuario.id);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

async function obtenerSesiones() {

};

async function iniciarSesion() {};

async function terminarSesion() {};

module.exports = {
  crearSesion,
};