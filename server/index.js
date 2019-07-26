"use strict";
const express = require("express");
const app = express();

require("./modules/authentication")(app);

require("./modules/materias")(app);
require("./modules/roles")(app);
require("./modules/usuarios")(app);
require("./modules/terminos")(app);
require("./modules/paralelos")(app);
require("./modules/sesiones")(app);

module.exports = app;
