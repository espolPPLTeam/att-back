const groupController = require("./group-controller");

module.exports = (app) => {
  app.route("/grupos/anadirProfesor")
    .post(async (req, res) => {
      try {
        const data = await groupController.anadirProfesorGrupo(req.body.idProfesor, req.body.idGrupo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/grupos/anadirEstudiante")
    .post(async (req, res) => {
      try {
        const data = await groupController.anadirEstudianteGrupo(req.body.idEstudiante, req.body.idGrupo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
