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
      studentQuestionsQuery["creador_id"] = userID
    }
    return await db[StudentQuestionModel].findAll({
      where: studentQuestionsQuery,
      attributes: ["id", "texto", "imagen", "createdAt", "estado"],
      include: [
        {
          model: db[UserModel],
          as: "creador",
          attributes: usuarioProjection
        }
      ],
    })
  }
};

module.exports = StudentQuestionService;
