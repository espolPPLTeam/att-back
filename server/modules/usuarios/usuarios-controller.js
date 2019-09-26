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
  * Metodo para crear un registro de profesor en la base de datos,
  * junto con todos sus registros en sus tablas asociadas
  * @param {Object} datosUsuario
  * @param {String} datosUsuario.nombres Nombres del profesor
  * @param {String} datosUsuario.apellidos Apellidos del profesor
  * @param {String} datosUsuario.email Email con el cual el profesor hara login en la app
  * @param {String} datosUsuario.clave Clave con la cual el profesor hara login en la app
  * @param {String} datosUsuario.matricula Identificacion del profesor
  */
async function crearProfesor(datosUsuario) {
  try {
    // Primero creo registro de usuario
    const profesor = {
      nombres: datosUsuario.nombres,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      matricula: datosUsuario.matricula,
      estado: "ACTIVO",
    };
    const hashedPassword = authenticationService.hashPassword(datosUsuario.clave);
    profesor["clave"] = hashedPassword;

    const usuario = await db["Usuario"].create(profesor);
    // Luego anado su foreign key de rol_id
    const rolQuery = { nombre: "profesor" };
    const rolProfesor = await db["Rol"].findOne({
      where: rolQuery
    });
    await rolProfesor.addUsuario(usuario);
    
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
  * Metodo para crear un registro de admin en la base de datos
  *
  * @param {Object} datosUsuario
  * @param {String} datosUsuario.nombres Nombres del admin
  * @param {String} datosUsuario.apellidos Apellidos del admin
  * @param {String} datosUsuario.email Email con el cual el admin hara login en la app
  * @param {String} datosUsuario.clave Clave con la cual el admin hara login en la app
  * @param {String} datosUsuario.matricula Identificacion del admin
  */
async function crearAdmin(datosUsuario) {
  try {
    // Primero creo registro de usuario
    const admin = {
      nombres: datosUsuario.nombres,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      matricula: datosUsuario.matricula,
      estado: "ACTIVO",
    };
    const hashedPassword = authenticationService.hashPassword(datosUsuario.clave);
    admin["clave"] = hashedPassword;

    const usuario = await db["Usuario"].create(admin);
    // Luego anado su foreign key de rol_id
    const rolQuery = { nombre: "admin" };
    const rolAdmin = await db["Rol"].findOne({
      where: rolQuery
    });
    await rolAdmin.addUsuario(usuario);
    
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
  * Obtiene los datos del usuario necesarios para la primera carga de la aplicacion
  * @param {String} email Email del usuario
  */
async function getDatosUsuario(email) {
  try {
    const limit = 10;
    // Buscar usuario
    const usuarioQuery = { email: email };
    /** Campos a mostrar del usuario */
    const usuarioProjection = ["id", "email", "rolId", "clave", "nombres", "apellidos"];
    /** Campos a mostrar del rol del usuario */
    const rolProjection = ["nombre"];
    /** Campos a mostrar del paralelo del usuario */
    const paraleloProjection = ["id", "nombre", "codigo"];

    const materiaProjection = ["id", "nombre", "codigo"];

    const sesionProjection = ["id", "nombre", "fecha_inicio", "fecha_fin"];
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
          attributes: paraleloProjection,
          include: [
            {
              model: db["Materia"],
              attributes: materiaProjection
            },
            /*{
              model: db["Sesion"],
              attributes: sesionProjection,
              limit: limit,
              include: [
                {
                  model: db["EstadoSesion"],
                  as: "estadoActual",
                  attributes: ["id", "nombre"]
                }
              ]
            }*/
          ]
        }
      ]
    });
    if (!usuario) {
      return Promise.reject("Usuario no encontrado");
    }

    return Promise.resolve(usuario);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
  * Obtiene los datos del usuario necesarios para la primera carga de la aplicacion
  * @param {Object} datosUsuario
  * @param {String} datosUsuario.email Email del usuario
  */
async function obtenerDatosSesion(datosUsuario) {
  try {
    // Buscar usuario
    const usuario = await getDatosUsuario(datosUsuario.email);
    if (!usuario) {
      return Promise.reject("Usuario no encontrado");
    }

    let datos = Object.assign({}, usuario.dataValues);
    delete datos["clave"];
    
    return Promise.resolve(datos);
  } catch (error) {
    console.error(error);
    return Promie.reject(error);
  }
};

module.exports = {
  crearEstudiante,
  crearProfesor,
  crearAdmin,
  login,
  obtenerDatosSesion
};
