const UserService = require("./user-service");
const RoleService = require("../role/role-service");
const CourseService = require("../course/course-service");
const GroupService = require("../group/group-service");

const authenticationService = require("../authentication/authentication-service");
const userConfig = require("./user-config");

/**
 * Creates a student if email does not exist. Enrolls the student to the course selected
 *
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
    const userExists = await UserService.getUserByEmail(studentData.email);
    if (userExists) {
      return Promise.reject("User already exists");
    }

    const student = {
      nombres: studentData.name,
      apellidos: studentData.lastName,
      email: studentData.email,
      matricula: studentData.identification,
      clave: authenticationService.hashPassword(studentData.password),
    };
    const user = await UserService.createUser(student);
    
    const role = await RoleService.getRoleByName(userConfig.role.STUDENT.text);
    await role.addUsuario(user);
    
    if (studentData.courseID) {
      const course = await CourseService.getCourseById(studentData.courseID);
      if (course) {
        await user.addParalelo(studentData.courseID);
      }
      if (studentData.groupID) {
        const group = await GroupService.getGroupByID(studentData.groupID);
        if (group) {
          if (group.get("paralelo_id") == studentData.courseID) {
            await user.addGrupo(group.get("id"));
          }
        }
      }
    }

    return Promise.resolve(user);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * @param {object} professorData
 * @param {string} professorData.name
 * @param {string} professorData.lastName
 * @param {string} professorData.email
 * @param {string} professorData.password
 * @param {string} professorData.identification
 * @param {number} professorData.courseID
 */
async function registerProfessor(professorData) {
  try {
    const userExists = await UserService.getUserByEmail(professorData.email);
    if (userExists) {
      return Promise.reject("User already exists");
    }

    const professor = {
      nombres: professorData.name,
      apellidos: professorData.lastName,
      email: professorData.email,
      matricula: professorData.identification,
      estado: userConfig.status.ACTIVE,
      clave: authenticationService.hashPassword(professorData.password),
    };

    const user = await UserService.createUser(professor);

    const role = await RoleService.getRoleByName(userConfig.role.PROFESSOR.text);
    await role.addUsuario(user);

    if (professorData.courseID) {
      const course = await CourseService.getCourseById(professorData.courseID);
      if (course) {
        await user.addParalelo(professorData.courseID);
      }
    }
    
    return Promise.resolve(user);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * Metodo para crear un registro de admin en la base de datos
 *
 * @param {Object} userData
 * @param {String} userData.name Nombres del admin
 * @param {String} userData.lastName Apellidos del admin
 * @param {String} userData.email Email con el cual el admin hara login en la app
 * @param {String} userData.password Clave con la cual el admin hara login en la app
 * @param {String} userData.identification Identificacion del admin
 */
async function registerAdmin(userData) {
  try {
    const userExists = await UserService.getUserByEmail(userData.email);
    if (userExists) {
      return Promise.reject("User already exists");
    }

    const admin = {
      nombres: userData.name,
      apellidos: userData.lastName,
      email: userData.email,
      matricula: userData.identification,
      clave: authenticationService.hashPassword(userData.password),
    };
    const user = await UserService.createUser(admin);
    
    const role = await RoleService.getRoleByName(userConfig.role.ADMIN.text);
    await role.addUsuario(user);

    return Promise.resolve(user);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
 * Validates the user's credentials and creates their token
 *
 * @param {String} email
 * @param {String} password
 * @return {Promise<String>}
 */
async function login(email, password) {
  try {
    const user = await UserService.getUserData(email);
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
}

/**
 * Gets the necessary user's data for the apps
 * @param {Object} userData
 * @param {String} userData.email User's email
 */
async function getSessionData(userData) {
  try {
    const user = await UserService.getUserData(userData.email);
    if (!user) {
      return Promise.reject("Usuario no encontrado");
    }

    let data = Object.assign({}, user.dataValues);
    delete data["clave"];
    
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  registerStudent,
  registerProfessor,
  registerAdmin,
  login,
  getSessionData
};
