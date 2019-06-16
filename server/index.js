"use strict";
const express = require("express");
const app = express();

require("./modules/materias")(app);

module.exports = app;
