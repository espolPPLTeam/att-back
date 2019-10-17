const professorQuestionController = require("./professorQuestion-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/questions/createProfessorQuestion")
    .post(async (req, res) => {
      try {
      	const token = req.headers["x-access-token"];
      	const userData = authenticationService.decodeToken(token);
        const question = await professorQuestionController.createQuestion(req.body, userData);
        res.send({ status: 200, data: question });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/questions/answer")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const answer = await professorQuestionController.answerQuestion(req.body, userData);
        res.send({ status: 200, data: answer });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/questions/updateStatus")
    .put(async (req, res) => {
      try {
        const data = await professorQuestionController.updateQuestionStatus(req.body);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
