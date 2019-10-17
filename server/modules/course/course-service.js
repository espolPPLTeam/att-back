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
    const course = await db[CourseModel].findOne({
      where: courseQuery,
      attributes: ["id", "nombre"],
      include: [
        {
          model: db[SubjectModel],
          attributes: ["id", "nombre"],
        }
      ]
    });
    return course;
  },
  async createCourse(courseData) {
    const course = await db[CourseModel].create(courseData);
    await course.setMateria(courseData.subjectID);
    await course.setTermino(courseData.termID);
    return course;
  }
};

module.exports = CourseService;
