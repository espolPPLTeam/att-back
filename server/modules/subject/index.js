const subjectController = require("./subject-controller");

module.exports = (app) => {
  app.route("/subject")
    .post(async (req, res) => {
      const data = await subjectController.createSubject(req.body);
      res.send({ status: 200, data: data.id });
    });
};
