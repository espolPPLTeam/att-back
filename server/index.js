"use strict";
const express = require("express");
const app = express();

require("./modules/materias")(app);
require("./modules/roles")(app);
require("./modules/usuarios")(app);
require("./modules/terminos")(app);

module.exports = app;
