const usuariosController = require("../usuarios/usuarios-controller");

module.exports = (app) => {
  app.route("/login")
    .post(async (req, res) => {
      try {
        const estudiante = await usuariosController.login(req.body.email, req.body.clave);
        res.send({ status: 200, data: estudiante });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
