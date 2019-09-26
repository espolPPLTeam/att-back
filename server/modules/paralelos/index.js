const paralelosController = require("./paralelos-controller");

module.exports = (app) => {
  app.route("/paralelos")
    .post(async (req, res) => {
      try {
        const paralelo = await paralelosController.crearParalelo(req.body);
        res.send({ status: 200, data: paralelo });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/paralelos/agregarUsuario")
    .put(async (req, res) => {
      try {
        const data = await paralelosController.agregarUsuario(req.body.idUsuario, req.body.idParalelo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
