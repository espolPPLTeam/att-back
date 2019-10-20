const GroupService = require("./group-service");
const UserService = require("../user/user-service");

/**
  * @param {Object} userData Datos del usuario que crea el paralelo
  * @param {Number} userData.id ID del usuario
  */
async function createGroup(groupData, userData) {
  try {
    const data = {
      nombre: groupData.nombre,
      usuario_registro: userData.id,
      courseID: groupData.idParalelo,
    };
    const group = await GroupService.createGroup(data);

    return Promise.resolve(group);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function addProfessorToGroup(professorID, groupID) {
  try {
    const group = await GroupService.getGroupByID(groupID);
    if (!group) {
      return Promise.reject("Grupo no existe");
    }
    const professor = await UserService.getUserByID(professorID);
    if (!professor) {
      return Promise.reject("Usuario no existe");
    }

    await group.addProfesor(professor.id);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function addStudentToGroup(studentID, groupID) {
  try {
    const group = await GroupService.getGroupByID(groupID);
    if (!group) {
      return Promise.reject("Grupo no existe");
    }
    const student = await UserService.getUserByID(studentID);
    if (!student) {
      return Promise.reject("Usuario no existe");
    }

    await group.addEstudiante(student.id);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  createGroup,
  addProfessorToGroup,
  addStudentToGroup,
};
