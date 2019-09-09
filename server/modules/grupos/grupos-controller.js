const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * @param {Object} datosUsuario Datos del usuario que crea el paralelo
  * @param {Number} datosUsuario.id ID del usuario
  */
async function crearGrupo(datosGrupo, datosUsuario) {
  try {
    const grupo = await db["Grupo"].create({
      nombre: datosGrupo.nombre,
      usuario_registro: datosUsuario.id
    });
    await grupo.setParalelo(datosGrupo.idParalelo);

    return Promise.resolve(grupo);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearGrupo,
};
