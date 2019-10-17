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
  }
};

module.exports = ProfessorQuestionService;
