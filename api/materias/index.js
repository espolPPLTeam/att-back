const materiasController = require("./materias-controller");

module.exports = (app) => {
  app.route("/materias")
    .get(async (req, res) => {
      const data = await materiasController.getAll();
      res.send({ status: 200, data });
    });

  app.route("/materias")
    .post(async (req, res) => {
      const data = await materiasController.create(req.body);
      res.send({ status: 200, data: data.id });
    });
};
