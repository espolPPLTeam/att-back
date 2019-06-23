const { Mysql } = require("./../../../db");
const db = Mysql.db;

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
    // Primero creo registro de usuario
    const estudiante = {
      nombres: datosUsuario.nombres,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      clave: datosUsuario.clave,
      matricula: datosUsuario.matricula,
      estado: "ACTIVO",
    };
    const usuario = await db["Usuario"].create(estudiante);
    // Luego anado su foreign key de rol_id
    const rolQuery = { nombre: "estudiante" };
    const rolEstudiante = await db["Rol"].findOne({
      where: rolQuery
    });
    await rolEstudiante.addUsuario(usuario);
    
    return Promise.resolve(usuario);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearEstudiante
};