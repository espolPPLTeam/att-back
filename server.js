const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const { PORT } = require("./constants");
const api = require("./api");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", api);

// Error handling middleware
// app.use((err, req, res, next) => {
//     return next(err, req, res, next);
// }, handleErrors);

app.listen(PORT, function() {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
