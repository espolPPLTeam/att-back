const mysqlService = require("../database-services/mysql-service");

/**
  * Get all registers in the table Materias
  */
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
  * Creates a register in the table Materias
  * @param {Object} dataMateria Required fields for the table
  * @param {String} dataMateria.nombre Name of the subject
  * @param {String} dataMateria.codigo Subject's code
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