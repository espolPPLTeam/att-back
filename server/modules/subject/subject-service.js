const { Mysql } = require("./../../../db");
const db = Mysql.db;

const SubjectModel = "Materia";
/**
 * Interface with the Term model in the database
 */
const SubjectService = {
  /**
   * @param {object} subjectData
   * @param {string} subjectData.nombre
   * @param {string} subjectData.codigo
   * @param {number} subjectData.usuario_registro
   */
  async createSubject(subjectData) {
    return await db[SubjectModel].create(subjectData);
  },
  /**
   * @param {number} termID
   */
  async getTermByID(termID) {
    return await db[SubjectModel].findOne({
      where: {
        id: termID
      }
    });
  }
};

module.exports = SubjectService;
