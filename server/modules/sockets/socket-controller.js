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

module.exports = {
  getSocketUserData,
};
