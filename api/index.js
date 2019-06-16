"use strict";
const express = require("express");
const app = express();

require("./materias")(app);

module.exports = app;
