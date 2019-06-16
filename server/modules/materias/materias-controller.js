async function getAll() {
  try {
    //return Promise.resolve(global.mysqlDB.Materia.findAll());
    return Promise.reject("asdfg")
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
    const data = await global.mysqlDB.Materia.create(dataMateria);
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