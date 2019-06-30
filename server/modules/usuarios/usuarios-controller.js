const { Mysql } = require("./../../../db");
const db = Mysql.db;

const authenticationService = require("../authentication/authentication-service");

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
      matricula: datosUsuario.matricula,
      estado: "ACTIVO",
    };
    const hashedPassword = authenticationService.hashPassword(datosUsuario.clave);
    estudiante["clave"] = hashedPassword;

    const usuario = await db["Usuario"].create(estudiante);
    // Luego anado su foreign key de rol_id
    const rolQuery = { nombre: "estudiante" };
    const rolEstudiante = await db["Rol"].findOne({
      where: rolQuery
    });
    await rolEstudiante.addUsuario(usuario);
    
    if (datosUsuario.idParalelo) {
      const paraleloQuery = { id: datosUsuario.idParalelo };
      const paralelo = await db["Paralelo"].findOne({
        where: paraleloQuery
      });
      if (paralelo) {
        await usuario.addParalelo(datosUsuario.idParalelo);
      }
    }
    
    return Promise.resolve(usuario);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Busca al usuario por su email y compara las contrasennas
  * Genera el token de autenticacion
  * @param {String} email Email ingresado por el usuario
  * @param {String} clave Clave ingresada por el uusario
  * @return {Promise<String>}
  */
async function login(email, clave) {
  try {
    // Buscar usuario
    const usuario = await getDatosUsuario(email);
    if (!usuario) {
      return Promise.reject("Usuario no encontrado");
    }
    // Comparar contrasenas
    const result = await authenticationService.comparePassword(usuario.clave, clave);
    if (!result) {
      return Promise.reject("Contrasennas no coinciden");
    }
    // Generar token
    const token = authenticationService.createToken(usuario.id, usuario.email, usuario.rol.nombre);

    let datos = Object.assign({}, usuario.dataValues);

    datos["token"] = token;
    delete datos["clave"];

    return Promise.resolve(datos);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Obtiene los datos del usuario necesarios para la primera carga de la alicacion
  * @param {String} email Email del usuario
  */
async function getDatosUsuario(email) {
  try {
    // Buscar usuario
    const usuarioQuery = { email: email };
    /** Campos a mostrar del usuario */
    const usuarioProjection = ["id", "email", "rolId", "clave"];
    /** Campos a mostrar del rol del usuario */
    const rolProjection = ["nombre"];
    /** Campos a mostrar del paralelo del usuario */
    const paraleloProjection = ["id", "nombre", "codigo"];
    const usuario = await db["Usuario"].findOne({
      where: usuarioQuery,
      attributes: usuarioProjection,
      include: [
        {
          model: db["Rol"],
          attributes: rolProjection
        },
        {
          model: db["Paralelo"],
          attributes: paraleloProjection
        }
      ]
    });
    if (!usuario) {
      return Promise.reject("Usuario no encontrado");
    }

    return Promise.resolve(usuario);
  } catch (error) {
    console.error(error);
    return Promie.reject(error);
  }
};

module.exports = {
  crearEstudiante,
  login
};