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
        const datosUsuario = authenticationService.decodeToken(token);
        const respuesta = await preguntasProfesorController.responderPregunta(req.body, datosUsuario);
        res.send({ status: 200, data: respuesta });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
