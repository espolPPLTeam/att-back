const terminosController = require("./terminos-controller");

module.exports = (app) => {
  app.route("/terminos")
    .post(async (req, res) => {
      try {
        const termino = await terminosController.crearTermino(req.body);
        res.send({ status: 200, termino });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/terminos/iniciar")
    .put(async (req, res) => {
      try {
        const termino = await terminosController.iniciarTermino(req.body.id);
        res.send({ status: 200, termino });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/terminos/finalizar")
    .put(async (req, res) => {
      try {
        const termino = await terminosController.finalizarTermino(req.body.id);
        res.send({ status: 200, termino });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};