const userController = require("../user/user-controller");

module.exports = (app) => {
  app.route("/login")
    .post(async (req, res) => {
      try {
        const user = await userController.login(req.body.email, req.body.clave);
        res.send({ status: 200, data: user });
      } catch (error) {
        res.status(500).send({ status: 500, error });
      }
    });
};
