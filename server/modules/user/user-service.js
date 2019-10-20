const userConfig = require("./user-config");
const { Mysql } = require("./../../../db");
const db = Mysql.db;

const UserModel = "Usuario";
const RoleModel = "Rol";
const CourseModel = "Paralelo";
const SubjectModel = "Materia";

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
  },

  /**
   * Queries the user's information based on its email
   * Information returned from Role, Course and Subject
   * @param {string} email User's email
   */
  async getUserData(email) {
    const userProjection = ["id", "email", "rolId", "clave", "nombres", "apellidos"];
    const roleProjection = ["nombre"];
    const courseProjection = ["id", "nombre", "codigo"];
    const subjectProjection = ["id", "nombre", "codigo"];

    const user = await db[UserModel].findOne({
      where: { email, },
      attributes: userProjection,
      include: [
        {
          model: db[RoleModel],
          attributes: roleProjection
        },
        {
          model: db[CourseModel],
          attributes: courseProjection,
          include: [
            {
              model: db[SubjectModel],
              attributes: subjectProjection,
            },
          ],
        },
      ],
    });
    return user;
  },

  /**
   * @param {number} userID ID of the user to query
   */
  async getUserByID(userID) {
    return await db[UserModel].findOne({
      where: { id: userID },
    });
  }

};

module.exports = UserService;
