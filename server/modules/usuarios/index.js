const usuariosController = require("./usuarios-controller");

module.exports = (app) => {
  app.route("/estudiantes")
    .post(async (req, res) => {
      try {
        const estudiante = await usuariosController.crearEstudiante(req.body);
        res.send({ status: 200, data: estudiante });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/profesores")
    .post(async (req, res) => {
      try {
        const profesor = await usuariosController.crearProfesor(req.body);
        res.send({ status: 200, data: profesor });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
