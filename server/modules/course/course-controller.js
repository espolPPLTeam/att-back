const { Mysql } = require("./../../../db");
const db = Mysql.db;

const CourseService = require("./course-service");

/**
  * @param {Object} userData Datos del usuario que crea el paralelo
  * @param {Number} userData.id ID del usuario
  */
async function createCourse(courseData, userData) {
  try {
    const data = {
      nombre: courseData.nombre,
      codigo: courseData.codigo,
      usuario_registro: userData.id,
      subjectID: courseData.idMateria,
      termID: courseData.idTermino,
    };
    const course = await CourseService.createCourse(data);
    return Promise.resolve(course);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  createCourse,
};
