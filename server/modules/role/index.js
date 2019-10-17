const roleController = require("./role-controller");

module.exports = (app) => {
  app.route("/roles")
    .post(async (req, res) => {
      const data = await roleController.createRole(req.body.nombre);
      res.send({ status: 200, data: data.id });
    });
};
