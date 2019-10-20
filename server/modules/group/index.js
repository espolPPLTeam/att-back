const groupController = require("./group-controller");

module.exports = (app) => {
  app.route("/group/addProfessor")
    .post(async (req, res) => {
      try {
        const data = await groupController.addProfessorToGroup(req.body.idProfesor, req.body.idGrupo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/group/addStudent")
    .post(async (req, res) => {
      try {
        const data = await groupController.addStudentToGroup(req.body.idEstudiante, req.body.idGrupo);
        res.send({ status: 200, data });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
