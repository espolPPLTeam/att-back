const { Mysql } = require("./../../../db");
const db = Mysql.db;

const CourseModel = "Paralelo";
const SubjectModel = "Materia";

const CourseService = {
  /**
   * @param {number} courseID ID of the role to search
   */
  async getCourseById(courseID) {
    const courseQuery = { id: courseID };
    return await db[CourseModel].findOne({
      where: courseQuery,
      attributes: ["id", "nombre"],
      include: [
        {
          model: db[SubjectModel],
          attributes: ["id", "nombre"],
        }
      ]
    });
  }
};

module.exports = CourseService;
