const { Mysql } = require("./../../../db");
const db = Mysql.db;

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
      fecha_inicio: new Date()
    });

    await sesion.addActualizacionesEstado(estado.id);

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
      fecha_fin: new Date()
    });

    await sesion.addActualizacionesEstado(estado.id);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  crearSesion,
  iniciarSesion,
  terminarSesion
};