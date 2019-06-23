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
  * Creates a register in the table Materias
  * @param {Object} dataMateria Required fields for the table
  * @param {String} dataMateria.nombre Name of the subject
  * @param {String} dataMateria.codigo Subject's code
  */
async function crearMateria(dataMateria) {
  try {
    const data = await db["Materia"].create({
      nombre: dataMateria.nombre,
      codigo: dataMateria.codigo
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