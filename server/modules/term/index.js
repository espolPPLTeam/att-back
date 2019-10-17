const termController = require("./term-controller");

module.exports = (app) => {
  app.route("/term")
    .post(async (req, res) => {
      try {
        const term = await termController.createTerm(req.body);
        res.send({ status: 200, term });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/term/start")
    .put(async (req, res) => {
      try {
        const term = await termController.startTerm(req.body.id);
        res.send({ status: 200, term });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/term/end")
    .put(async (req, res) => {
      try {
        const term = await termController.endTerm(req.body.id);
        res.send({ status: 200, term });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
