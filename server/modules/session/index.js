const sessionController = require("./session-controller");
const authenticationService = require("../authentication/authentication-service");

module.exports = (app) => {
  app.route("/sessions/createSession")
    .post(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const session = await sessionController.createSession(req.body, userData);
        res.send({ status: 200, data: session });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/sessions/start")
    .put(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const session = await sessionController.start(req.body, userData);
        res.send({ status: 200, data: session });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/sessions/end")
    .put(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const session = await sessionController.end(req.body, userData);
        res.send({ status: 200, data: session });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/sessions/getSessionData")
    .get(async (req, res) => {
      try {
        const token = req.headers["x-access-token"];
        const userData = authenticationService.decodeToken(token);
        const session = await sessionController.getSessionData(req.query, userData);
        res.send({ status: 200, data: session });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

  app.route("/sessions")
    .get(async (req, res) => {
      try {
        const sessions = await sessionController.getSessions(req.query);
        res.send({ status: 200, data: sessions });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });

};
