const studentQuestionController = require("./studentQuestion-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/questions/createStudentQuestion")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const question = await studentQuestionController.createQuestion(req.body, userData);
        res.send({ status: 200, data: question });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
