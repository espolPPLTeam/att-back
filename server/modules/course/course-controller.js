const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * @param {Object} datosUsuario Datos del usuario que crea el paralelo
  * @param {Number} datosUsuario.id ID del usuario
  */
async function crearParalelo(datosParalelo, datosUsuario) {
  try {
    const paralelo = await db["Paralelo"].create({
      nombre: datosParalelo.nombre,
      codigo: datosParalelo.codigo,
      usuario_registro: datosUsuario.id
    });

    await paralelo.setMateria(datosParalelo.idMateria);
    await paralelo.setTermino(datosParalelo.idTermino);

    return Promise.resolve(paralelo);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * @param {Object} datosUsuario Datos del usuario que crea el paralelo
  * @param {Number} datosUsuario.id ID del usuario
  */
async function agregarUsuario(idUsuario, idParalelo) {
  try {
    const usuarioQuery = { id: idUsuario };
    const usuario = await db["Usuario"].findOne({
      where: usuarioQuery,
    });

    if (!usuario) {
      return Promise.reject("Usuario no existe");
    }

    const paraleloQuery = { id: idParalelo };
    const paralelo = await db["Paralelo"].findOne({
      where: paraleloQuery,
    });

    if (!usuario) {
      return Promise.reject("Usuario no existe");
    }

    if (!paralelo) {
      return Promise.reject("Paralelo no existe");
    }

    await usuario.addParalelo(idParalelo);

    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearParalelo,
  agregarUsuario,
};
