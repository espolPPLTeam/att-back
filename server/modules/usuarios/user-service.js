const userConfig = require("./usuarios-config");
const { Mysql } = require("./../../../db");
const db = Mysql.db;

const UserModel = "Usuario";

/**
 * Interface with the User model in the database
 */
const UserService = {
  /**
   * Creates a User
   *
   * @param {object} userData
   * @param {string} userData.nombres
   * @param {string} userData.apellidos
   * @param {string} userData.email
   * @param {string} userData.matricula
   * @param {string} userData.clave
   */
  async createUser(userData) {
    userData["estado"] = userConfig.status.ACTIVE;
    const user = await db[UserModel].create(userData);
    return user;
  },

  /**
   * Queries the database for a user by its email
   * @param {string} email Email to search in the database
   */
  async getUserByEmail(email) {
    const user = await db[UserModel].findOne({
      where: {
        email,
      },
    });
    return user;
  }

};

module.exports = UserService;
