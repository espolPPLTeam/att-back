const { Mysql } = require("./../../../db");
const db = Mysql.db;

const StudentQuestionModel = "PreguntaEstudiante";
const UserModel = "Usuario";
/**
 * Interface with the User model in the database
 */
const StudentQuestionService = {
  /**
   * @param {number} sessionID
   * @param {number} userID
   * @return {Promise<Array>}
   */
  async getSessionQuestions(sessionID, userID) {
    const usuarioProjection = ["id", "nombres", "apellidos", "email"];
    let studentQuestionsQuery = { sesion_id: sessionID };
    if (userID) {
      studentQuestionsQuery["creador_id"] = userID;
    }
    return await db[StudentQuestionModel].findAll({
      where: studentQuestionsQuery,
      attributes: ["id", "texto", "imagen", "createdAt"],
      include: [
        {
          model: db[UserModel],
          as: "creador",
          attributes: usuarioProjection
        }
      ],
    });
  },
  /**
   * @param {object} questionData
   * @param {string} questionData.texto
   * @param {string} questionData.imagen
   * @param {number} questionData.creador_id
   * @param {number} questionData.sesion_id
   */
  async createQuestion(questionData) {
    return await db[StudentQuestionModel].create(questionData);
  }
};

module.exports = StudentQuestionService;
