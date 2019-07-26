const sesionesController = require("./sesiones-controller");

module.exports = (app) => {
  app.route("/crearSesion")
    .post(async (req, res) => {
      try {
        const sesion = await sesionesController.crearSesion(req.body);
        res.send({ status: 200, data: sesion });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
