const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.SERVER_PORT;

const initServer = async() => {
  try {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false,
      limit   : '10mb'
    }));

    // Database connection
    const databases = require("./db");
    const mysqlDB = await databases.Mysql.connect();
    global.mysqlDB = mysqlDB;

    // API routes registration is handled in the api index 
    const api = require("./api");
    app.use("/api/att", api);

    // Error handling middleware
    // app.use((err, req, res, next) => {
    //     return next(err, req, res, next);
    // }, handleErrors);

    app.listen(PORT, function() {
      console.log(`Server listening on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server", error);
  }
};

initServer();