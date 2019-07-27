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

module.exports = {
  crearParalelo,
};