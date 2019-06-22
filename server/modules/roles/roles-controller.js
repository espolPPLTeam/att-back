const mysqlService = require("../database-services/mysql-service");


/**
  * Metodo para crear el registro de un Rol en la base de datos
  */
async function crearRol(nombre) {
  try {
    const data = { nombre };
    const rol = await mysqlService.createRegister("Rol", data);
    return Promise.resolve(rol);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
  * Metodo para obtener todos los roles de la base de datos
  * @param {Number} limit Limite de resultados a mostrar
  * @param {Number} offset Numero de resultados a saltarse de la busqueda
  */
async function obtenerRoles(limit, offset, query) {
  try {
    if (!limit) {
      limit = 10;
    }
    if (!offset) {
      offset = 0;
    }
    const roles = await mysqlService.findAll("Rol", query, {}, limit, offset);
    return Promise.resolve(roles);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  crearRol,
  obtenerRoles
};