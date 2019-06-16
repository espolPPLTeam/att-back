const mysqlService = require("../database-services/mysql-service");

async function getAll() {
  try {
    const materias = await mysqlService.findAll("Materia", {}, {}, 10, 0);
    return Promise.resolve(materias);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Crea un registro de Materia en la tabla materias
  * @param {Object} dataMateria Campos requeridos de la tabla para el registro
  * @param {String} dataMateria.nombre Nombre de la materia
  * @param {String} dataMateria.codigo Codigo de la materia
  */
async function create(dataMateria) {
  try {
    const data = await mysqlService.createRegister("Materia", dataMateria);
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  getAll,
  create
};