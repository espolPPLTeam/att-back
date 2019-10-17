const subjectController = require("./subject-controller");

module.exports = (app) => {
  app.route("/materias")
    .get(async (req, res) => {
      try {
        const data = await subjectController.obtenerMaterias(req.query.limit, req.query.offset);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/materias")
    .post(async (req, res) => {
      const data = await subjectController.crearMateria(req.body);
      res.send({ status: 200, data: data.id });
    });
};
