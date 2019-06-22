const usuariosController = require("./usuarios-controller");

module.exports = (app) => {
  app.route("/usuarios")
    .get(async (req, res) => {
      try {
        console.log(req.query);
        const data = await usuariosController.obtenerRoles(req.query.limit, req.query.offset);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/estudiantes")
    .post(async (req, res) => {
      const data = await usuariosController.crearEstudiante(req.body);
      res.send({ status: 200, data: data });
    });
};
