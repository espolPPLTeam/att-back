const mysqlService = require("../database-services/mysql-service");

/**
  * Metodo para crear un registro de estudiante en la base de datos,
  * junto con todos sus registros en sus tablas asociadas
  * @param {Object} datosUsuario
  * @param {String} datosUsuario.nombres Nombres del estudiante
  * @param {String} datosUsuario.apellidos Apellidos del estudiante
  * @param {String} datosUsuario.email Email con el cual el estudiante hara login en la app
  * @param {String} datosUsuario.clave Clave con la cual el estudiante hara login en la app
  * @param {String} datosUsuario.matricula Matricula del estudiante
  */
async function crearEstudiante(datosUsuario) {
  try {
    // Primero obtener el rol de "estudiante"
    const rolQuery = { nombre: "estudiante" };
    const rolEstudiante = await mysqlService.findOne("Rol", rolQuery, {});
    // Crear registro de usuario
    const estudiante = {
      nombres: datosUsuario.nombres,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      clave: datosUsuario.clave,
      matricula: datosUsuario.matricula,
      estado: "ACTIVO",
      rol_id: rolEstudiante.id
    };
    console.log(estudiante)
    const usuario = await mysqlService.createRegister("Usuario", estudiante);
    return Promise.resolve(usuario);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearEstudiante
};