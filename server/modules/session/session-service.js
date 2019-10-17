const { Mysql } = require("./../../../db");
const db = Mysql.db;

const SessionModel = "Sesion";

/**
 * Interface with the User model in the database
 */
const SessionService = {
  /**
   * Creates a User
   *
   * @param {object} sessionData
   * @param {string} sessionData.nombre
   * @param {boolean} sessionData.activo
   * @param {number} sessionData.sesion_actual_id
   */
  async createSession(sessionData) {
    return await db[SessionModel].create(sessionData);
  },

};

module.exports = SessionService;
