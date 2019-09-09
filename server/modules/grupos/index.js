const gruposController = require("./grupos-controller");

module.exports = (app) => {
  app.route("/grupos/anadirProfesor")
    .post(async (req, res) => {
      try {
        const data = await gruposController.anadirProfesorGrupo(req.body.idProfesor, req.body.idGrupo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
