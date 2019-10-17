const { Mysql } = require("./../../../db");
const db = Mysql.db;

const ProfessorQuestionModel = "PreguntaProfesor";
const AnswerModel = "Respuesta";
const UserModel = "Usuario";
/**
 * Interface with the User model in the database
 */
const ProfessorQuestionService = {
  /**
   * @param {number} sessionID
   * @return {Promise<Array>}
   */
  async getSessionQuestions(sessionID) {
    const usuarioProjection = ["id", "nombres", "apellidos", "email"];
    return await db[ProfessorQuestionModel].findAll({
      where: { sesion_id: sessionID },
      attributes: ["id", "texto", "imagen", "createdAt", "titulo", "estado"],
      include: [
        {
          model: db[AnswerModel],
          as: "respuestas",
          attributes: ["id", "texto", "calificacion", "createdAt", "imagen"],
          include: [
            {
              model: db[UserModel],
              as: "creador",
              attributes: usuarioProjection,
            }
          ]
        },
        {
          model: db[UserModel],
          as: "creador",
          attributes: usuarioProjection
        }
      ],
    })
  },
  /**
   * @param {object} questionData
   * @param {string} questionData.titulo
   * @param {string} questionData.texto
   * @param {string} questionData.imagen
   * @param {number} questionData.creador_id
   * @param {number} questionData.sesion_id
   * @param {string} questionData.estado
   */
  async createQuestion(questionData) {
    return await db[ProfessorQuestionModel].create(questionData);
  },
  /**
   * @param {number} questionID
   */
  async getQuestionByID(questionID) {
    return await db[ProfessorQuestionModel].findOne({
      where: { id: questionID },
    });
  },
  /**
   * @param {object} answerData
   * @param {string} answerData.texto
   * @param {number} answerData.creador_id
   * @param {number} answerData.questionID
   */
  async answerQuestion(answerData) {
    const answer = await db[AnswerModel].create(answerData);
    answer.setPregunta(answerData.questionID);
    return answer;
  }
};

module.exports = ProfessorQuestionService;
