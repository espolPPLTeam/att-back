const rolesController = require("./roles-controller");

module.exports = (app) => {
  app.route("/roles")
    .get(async (req, res) => {
      try {
        console.log(req.query);
        const data = await rolesController.obtenerRoles(req.query.limit, req.query.offset);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/roles")
    .post(async (req, res) => {
      const data = await rolesController.crearRol(req.body.nombre);
      res.send({ status: 200, data: data.id });
    });
};
