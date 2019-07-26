const sesionesController = require("./sesiones-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/crearSesion")
    .post(async (req, res) => {
      try {
      	const token = req.headers["x-access-token"];
      	const datosUsuario = authenticationService.decodeToken(token);
        const sesion = await sesionesController.crearSesion(req.body, datosUsuario);
        res.send({ status: 200, data: sesion });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
