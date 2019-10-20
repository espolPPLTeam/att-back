const { Mysql } = require("./../../../db");
const db = Mysql.db;

const TermModel = "Termino";
/**
 * Interface with the Term model in the database
 */
const TermService = {
  /**
   * @param {object} termData
   * @param {string} termData.nombre
   * @param {string} termData.fecha_inicio
   * @param {string} termData.fecha_fin
   * @param {number} termData.usuario_registro
   */
  async createTerm(termData) {
    termData["activo"] = false;
    return await db[TermModel].create(termData);
  },
  /**
   * @param {number} termID
   */
  async getTermByID(termID) {
    return await db[TermModel].findOne({
      where: {
        id: termID
      }
    });
  }
};

module.exports = TermService;
