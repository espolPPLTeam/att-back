const userController = require("./user-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/user/registerStudent")
    .post(async (req, res) => {
      try {
        const student = await userController.registerStudent(req.body);
        res.send({ status: 200, data: student });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/user/registerProfessor")
    .post(async (req, res) => {
      try {
        const professor = await userController.registerProfessor(req.body);
        res.send({ status: 200, data: professor });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/user/getUserData")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const data = await userController.getSessionData(userData);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
