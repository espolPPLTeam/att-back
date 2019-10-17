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

async function anadirProfesorGrupo(idProfesor, idGrupo) {
  try {
    const grupoQuery = { id: idGrupo };
    const grupo = await db["Grupo"].findOne({ where: grupoQuery });
    if (!grupo) {
      return Promise.reject("Grupo no existe");
    }
    const profesorQuery = { id: idProfesor };
    const profesor = await db["Usuario"].findOne({ where: profesorQuery });
    if (!profesor) {
      return Promise.reject("Usuario no existe");
    }

    const resultado = await grupo.addProfesor(profesor.id);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function anadirEstudianteGrupo(idEstudiante, idGrupo) {
  try {
    const grupoQuery = { id: idGrupo };
    const grupo = await db["Grupo"].findOne({ where: grupoQuery });
    if (!grupo) {
      return Promise.reject("Grupo no existe");
    }
    const estudianteQuery = { id: idEstudiante };
    const estudiante = await db["Usuario"].findOne({ where: estudianteQuery });
    if (!estudiante) {
      return Promise.reject("Usuario no existe");
    }

    const resultado = await grupo.addEstudiante(estudiante.id);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  crearGrupo,
  anadirProfesorGrupo,
  anadirEstudianteGrupo,
};
