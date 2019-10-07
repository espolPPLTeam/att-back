const { Mysql } = require("./../../../db");
const db = Mysql.db;

const socketConfig = require("./socket-config");
const sessionsController = require("../sesiones/sesiones-controller");

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
    case socketConfig.type.COURSE:
      room = `COURSE-${data.id}`;
      break;
    case socketConfig.type.SESSION:
      room = `SESSION-${data.id}-${roleName}`;
      break;
    default:
      break;
  }
  return room;
}

/**
 * @param {object} data
 * @param {string} data.type Type of socket room to join
 * @param {number} data.id ID of the room to join. If type is SESSION, this is the session ID
 * @param {number} data.userID ID of the user
 */
async function joinRoomHandler(data) {
  if (data.type === socketConfig.type.SESSION) {
    const sessionData = {
      sessionID: data.id,
    };
    const userData = {
      userID: data.userID,
    };
    await sessionsController.joinSession(sessionData, userData);
  }
}

module.exports = {
  getSocketUserData,
  getRoom,
  joinRoomHandler,
};
