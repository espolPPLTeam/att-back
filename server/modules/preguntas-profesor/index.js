const preguntasProfesorController = require("./preguntasProfesor-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/crearPreguntaProfesor")
    .post(async (req, res) => {
      try {
      	const token = req.headers["x-access-token"];
      	const datosUsuario = authenticationService.decodeToken(token);
        const pregunta = await preguntasProfesorController.crearPregunta(req.body, datosUsuario);
        res.send({ status: 200, data: pregunta });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/responderPregunta")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const answer = await preguntasProfesorController.answerQuestion(req.body, userData);
        res.send({ status: 200, data: answer });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/professorQuestion/updateStatus")
    .put(async (req, res) => {
      try {
        const data = await preguntasProfesorController.updateQuestionStatus(req.body);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
