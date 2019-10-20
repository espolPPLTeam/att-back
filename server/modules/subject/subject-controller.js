const SubjectService = require("./subject-service");

/**
  * Crea una nueva materia en la base de datps
  * @param {Object} subjectData Datos requeridos de la materia
  * @param {String} subjectData.nombre Nombre de la materia
  * @param {String} subjectData.codigo Codigo de la materia
  * @param {Object} userData Datos del usuario que crea la materia
  * @param {Number} userData.id ID del usuario
  */
async function createSubject(subjectData, userData) {
  try {
    const data = {
      nombre: subjectData.nombre,
      codigo: subjectData.codigo,
      usuario_registro: userData.id
    };
    const subject = await SubjectService.createSubject(data);
    return Promise.resolve(subject);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  createSubject,
};
