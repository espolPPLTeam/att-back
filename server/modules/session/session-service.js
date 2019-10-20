const { Mysql } = require("./../../../db");
const db = Mysql.db;

const SessionModel = "Sesion";
const CourseModel = "Paralelo";
const SubjectModel = "Materia";
const SessionStatusModel = "EstadoSesion";
const UserModel = "Usuario";
const UserSessionModel = "UsuarioSesion";
const GroupModel = "Grupo";

/**
 * Interface with the User model in the database
 */
const SessionService = {
  /**
   * Creates a Session
   *
   * @param {object} sessionData
   * @param {string} sessionData.nombre
   * @param {boolean} sessionData.activo
   * @param {number} sessionData.sesion_actual_id
   */
  async createSession(sessionData) {
    return await db[SessionModel].create(sessionData);
  },
  /**
   * Returns all the sessions matching the query
   * @param {object} query
   */
  async getSessions(query) {
    if (!query) {
      return [];
    }
    return await db[SessionModel].findAll({
      where: query,
      attributes: ["nombre", "activo", "id"],
      include: [
        {
          model: db[CourseModel],
          attributes: ["nombre", "codigo", "id"],
          include: [
            {
              model: db[SubjectModel],
              attributes: ["nombre", "codigo", "id"],
            }
          ]
        },
        {
          model: db[SessionStatusModel],
          as: "estadoActual",
          attributes: ["id", "nombre"],
        },
      ],
    });
  },
  /**
   * Queries the database for the selected session by its ID
   * @param {number} sessionID
   */
  async getSessionByID(sessionID) {
    return await db[SessionModel].findOne({
      where: {
        id: sessionID,
      },
    });
  },
  /**
   * Returns all the information related to a session
   * @description
   *   Course + User + Actual Status
   */
  async getSessionData(sessionID) {
    return await db[SessionModel].findOne({
      where: { id: sessionID },
      attributes: ["nombre", "fecha_inicio", "fecha_fin"],
      include: [
        {
          model: db[CourseModel],
          attributes: ["nombre", "codigo", "id"]
        },
        {
          model: db[UserModel],
          as: "registrador",
          attributes: ["id", "nombres", "apellidos", "email"]
        },
        {
          model: db[SessionStatusModel],
          as: "estadoActual",
          attributes: ["id", "nombre"]
        }
      ],
    });
  },
  /**
   * Returns the register of a user in a session
   * If user did not participate in session, returns null
   * @param {number} userID
   * @param {number} sessionID
   */
  async getUserInSession(userID, sessionID) {
    return await db[UserSessionModel].findOne({
      where: {
        sesion_id: sessionID,
        usuario_id: userID,
      },
    });
  }

};

module.exports = SessionService;
