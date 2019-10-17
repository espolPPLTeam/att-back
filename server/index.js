"use strict";
const express = require("express");
const app = express();

require("./modules/authentication")(app);

require("./modules/subject")(app);
require("./modules/role")(app);
require("./modules/user")(app);
require("./modules/term")(app);
require("./modules/course")(app);
require("./modules/session")(app);
require("./modules/professor-question")(app);
require("./modules/student-question")(app);
require("./modules/group")(app);

module.exports = app;
