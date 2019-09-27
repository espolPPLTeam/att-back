const usuariosController = require("./usuarios-controller");
const authenticationService = require("../authentication/authentication-service");
const socketController = require("../sockets/socket-controller");

module.exports = (app) => {
  app.route("/estudiantes")
    .post(async (req, res) => {
      try {
        const estudiante = await usuariosController.crearEstudiante(req.body);
        res.send({ status: 200, data: estudiante });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/profesores")
    .post(async (req, res) => {
      try {
        const profesor = await usuariosController.crearProfesor(req.body);
        res.send({ status: 200, data: profesor });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/obtenerDatosUsuario")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const datosUsuario = authenticationService.decodeToken(token);
        const datos = await usuariosController.obtenerDatosSesion(datosUsuario);
        res.send({ status: 200, data: datos });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/test'")
    .post(async (req, res) => {
      try {
        const estudiante = await socketController.getSocketUserData(req.body);
        res.send({ status: 200, data: estudiante });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
