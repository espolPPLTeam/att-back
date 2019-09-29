const { Mysql } = require("./../../../db");
const db = Mysql.db;

/**
  * Returns the user from the socket
  * @param {number} id Socket user id
  */
async function getSocketUserData(id) {
  try {
    console.log("id>>>", id)
    const userQuery = { id };
    const userProjection = ["id", "email", "rolId", "nombres", "apellidos"];
    const roleProjection = ["nombre"];
    
    const user = await db["Usuario"].findOne({
      where: userQuery,
      attributes: userProjection,
      include: [
        {
          model: db["Rol"],
          attributes: roleProjection
        },
      ]
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
 * Returns the room the user is joining or leaving
 *
 * @param {object} data Socket data
 * @param {string} data.type Type of socket room to join
 * @param {number} data.rolId Role of the user
 * @param {number} data.id ID of the room type to join/leave
 */
function getRoom(data) {
  let room = "";
  let roleName = (data.rolId === 1) ? "PROFESSOR" : (data.rolId === 2) ? "STUDENT" : ""; 
  switch (data.type) {
    case "COURSE":
      room = `COURSE-${data.id}`;
      break;
    case "SESSION":
      room = `SESSION-${data.id}-${roleName}`;
      break;
    default:
      break;
  }
  return room;
}

module.exports = {
  getSocketUserData,
  getRoom,
};
