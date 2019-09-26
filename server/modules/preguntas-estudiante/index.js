const preguntasEstudianteController = require("./preguntasEstudiante-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/crearPreguntaEstudiante")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const datosUsuario = authenticationService.decodeToken(token);
        const pregunta = await preguntasEstudianteController.crearPregunta(req.body, datosUsuario);
        res.send({ status: 200, data: pregunta });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
