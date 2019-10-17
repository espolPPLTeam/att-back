const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Metodo para crear un registro de terminos en la base de datos
  * @param {Object} datosTermino
  * @param {String} datosTermino.nombre
  * @param {Date} datosTermino.fecha_inicio
  * @param {Date} datosTermino.fecha_fin
  */
async function crearTermino(datosTermino, datosUsuario) {
  try {
    const termino = await db["Termino"].create({
      nombre: datosTermino.nombre,
      fecha_inicio: new Date(datosTermino.fecha_inicio),
      fecha_fin: new Date(datosTermino.fecha_fin),
      activo: false,
      usuario_registro: datosUsuario.id
    });
    return Promise.resolve(termino);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Metodo para dar por iniciado un termino
  * @param {Number} idTermino ID del termino a iniciar
  */
async function iniciarTermino(idTermino) {
  try {
    const termino = await db["Termino"].findOne({
      where: {
        id: idTermino
      }
    });
    await termino.update({
      activo: true
    });
    return Promise.resolve(termino);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Metodo para dar por finalizado un termino
  * @param {Number} idTermino ID del termino a finalizar
  */
async function finalizarTermino(idTermino) {
  try {
    const termino = await db["Termino"].findOne({
      where: {
        id: idTermino
      }
    });
    await termino.update({
      activo: false
    });
    return Promise.resolve(termino);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearTermino,
  iniciarTermino,
  finalizarTermino
};