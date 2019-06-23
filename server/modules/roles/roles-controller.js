const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Metodo para crear el registro de un Rol en la base de datos
  */
async function crearRol(nombre) {
  try {
    const data = { nombre };
    const rol = await db["Rol"].create(data);
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
    const roles = await db["Rol"].findAll({
      where: query,
      offset: Number(offset),
      limit: Number(limit)
    });
    return Promise.resolve(roles);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  crearRol,
  obtenerRoles
};