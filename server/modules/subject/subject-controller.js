const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Get all registers in the table Materias
  * @param {Number} limit Limite de resultados a mostrar
  * @param {Number} offset Numero de resultados a saltarse de la busqueda
  */
async function obtenerMaterias(limit, offset) {
  try {
    if (!limit) {
      limit = 10;
    }
    if (!offset) {
      offset = 0;
    }
    const materias = await db["Materia"].findAll({
      offset: Number(offset),
      limit: Number(limit)
    });
    return Promise.resolve(materias);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Crea una nueva materia en la base de datps
  * @param {Object} dataMateria Datos requeridos de la materia
  * @param {String} dataMateria.nombre Nombre de la materia
  * @param {String} dataMateria.codigo Codigo de la materia
  * @param {Object} datosUsuario Datos del usuario que crea la materia
  * @param {Number} datosUsuario.id ID del usuario
  */
async function crearMateria(dataMateria, datosUsuario) {
  try {
    const data = await db["Materia"].create({
      nombre: dataMateria.nombre,
      codigo: dataMateria.codigo,
      usuario_registro: datosUsuario.id
    });
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  obtenerMaterias,
  crearMateria
};