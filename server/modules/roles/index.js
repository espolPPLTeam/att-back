const rolesController = require("./roles-controller");

module.exports = (app) => {
  app.route("/roles")
    .post(async (req, res) => {
      const data = await rolesController.createRole(req.body.nombre);
      res.send({ status: 200, data: data.id });
    });
};
