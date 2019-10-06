const { Mysql } = require("./../../../db");
const db = Mysql.db;

const authenticationService = require("../authentication/authentication-service");
const userConfig = require("./usuarios-config");

/**
 * @param {object} studentData
 * @param {string} studentData.name
 * @param {string} studentData.lastName
 * @param {string} studentData.email
 * @param {string} studentData.password
 * @param {string} studentData.identification
 * @param {number} studentData.courseID
 */
async function registerStudent(studentData) {
  try {
    const student = {
      nombres: studentData.name,
      apellidos: studentData.lastName,
      email: studentData.email,
      matricula: studentData.identification,
      estado: userConfig.status.ACTIVE,
    };
    student["password"] = authenticationService.hashPassword(studentData.password);;

    const user = await db["Usuario"].create(student);

    const roleQuery = { nombre: "estudiante" };
    const role = await db["Rol"].findOne({
      where: roleQuery
    });
    await role.addUsuario(user);
    
    if (studentData.courseID) {
      const courseQuery = { id: studentData.courseID };
      const course = await db["Paralelo"].findOne({
        where: courseQuery
      });
      if (course) {
        await user.addParalelo(studentData.courseID);
      }
    }
    
    return Promise.resolve(user);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
 * @param {object} professorData
 * @param {string} professorData.name
 * @param {string} professorData.lastName
 * @param {string} professorData.email
 * @param {string} professorData.password
 * @param {string} professorData.identification
 */
async function registerProfessor(professorData) {
  try {
    // Primero creo registro de usuario
    const professor = {
      nombres: professorData.name,
      apellidos: professorData.lastName,
      email: professorData.email,
      matricula: professorData.identification,
      estado: userConfig.status.ACTIVE,
    };
    professor["password"] = authenticationService.hashPassword(professorData.password);;

    const user = await db["Usuario"].create(professor);

    const roleQuery = { nombre: "profesor" };
    const role = await db["Rol"].findOne({
      where: roleQuery
    });
    await role.addUsuario(user);
    
    if (professorData.courseID) {
      const courseQuery = { id: professorData.courseID };
      const course = await db["Paralelo"].findOne({
        where: courseQuery
      });
      if (course) {
        await usuario.addParalelo(professorData.courseID);
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
 * Validates the user's credentials and creates their token
 *
 * @param {String} email
 * @param {String} password
 * @return {Promise<String>}
 */
async function login(email, password) {
  try {
    const user = await getUserData(email);
    if (!user) {
      return Promise.reject("Usuario no encontrado");
    }

    const result = await authenticationService.comparePassword(user.clave, password);
    if (!result) {
      return Promise.reject("Contrasennas no coinciden");
    }

    const token = authenticationService.createToken(user.id, user.email, user.rol.nombre);

    let data = Object.assign({}, user.dataValues);

    data["token"] = token;
    delete data["clave"];

    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
 * Returns the user's data for the apps
 * @param {string} email
 */
async function getUserData(email) {
  try {
    const limit = 10;
    const usuarioQuery = { email: email };
    const usuarioProjection = ["id", "email", "rolId", "clave", "nombres", "apellidos"];
    const rolProjection = ["nombre"];
    const paraleloProjection = ["id", "nombre", "codigo"];
    const materiaProjection = ["id", "nombre", "codigo"];
    const sesionProjection = ["id", "nombre", "fecha_inicio", "fecha_fin"];

    const user = await db["Usuario"].findOne({
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
          ],
        },
      ],
    });

    if (!user) {
      return Promise.reject("Usuario no encontrado");
    }

    return Promise.resolve(user);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

/**
 * Gets the necessary user's data for the apps
 * @param {Object} userData
 * @param {String} userData.email User's email
 */
async function getSessionData(userData) {
  try {
    // Buscar usuario
    const user = await getUserData(userData.email);
    if (!user) {
      return Promise.reject("Usuario no encontrado");
    }

    let data = Object.assign({}, user.dataValues);
    delete data["clave"];
    
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promie.reject(error);
  }
};

module.exports = {
  registerStudent,
  registerProfessor,
  crearAdmin,
  login,
  getSessionData
};
