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

  app.route("/iniciarSesion")
    .put(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const datosUsuario = authenticationService.decodeToken(token);
        const sesion = await sesionesController.iniciarSesion(req.body, datosUsuario);
        res.send({ status: 200, data: sesion });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/terminarSesion")
    .put(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const datosUsuario = authenticationService.decodeToken(token);
        const sesion = await sesionesController.terminarSesion(req.body, datosUsuario);
        res.send({ status: 200, data: sesion });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/datosSesion")
    .get(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const datosUsuario = authenticationService.decodeToken(token);
        const sesion = await sesionesController.obtenerDatosSesion(req.query, datosUsuario);
        res.send({ status: 200, data: sesion });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/sesiones")
    .get(async (req, res) => {
      try {
        const sesiones = await sesionesController.obtenerSesiones(req.query);
        res.send({ status: 200, data: sesiones });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
