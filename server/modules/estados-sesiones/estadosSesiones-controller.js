const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Crea un registro de estado en la tabla estados-sesiones
  * @param {Object} datosEstado Campos requeridos
  * @param {String} datosEstado.nombre Nombre del estado
  */
async function crearEstado(datosEstado) {
  try {
    const data = await db["EstadoSesion"].create({
      nombre: datosEstado.nombre,
    });
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};


module.exports = {
	crearEstado
};