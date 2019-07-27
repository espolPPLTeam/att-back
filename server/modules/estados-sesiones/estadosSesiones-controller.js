const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Crea un registro de estado en la tabla estados-sesiones
  * @param {Object} datosEstado Campos requeridos
  * @param {String} datosEstado.nombre Nombre del estado
  * @param {Object} datosUsuario Datos del usuario que crea el estado
  * @param {Number} datosUsuario.id ID del usuario
  */
async function crearEstado(datosEstado, datosUsuario) {
  try {
    const data = await db["EstadoSesion"].create({
      nombre: datosEstado.nombre,
      usuario_registro: datosUsuario.id
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