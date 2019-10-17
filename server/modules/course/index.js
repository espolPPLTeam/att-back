const courseController = require("./course-controller");

module.exports = (app) => {
  app.route("/course")
    .post(async (req, res) => {
      try {
        const course = await courseController.createCourse(req.body);
        res.send({ status: 200, data: course });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
