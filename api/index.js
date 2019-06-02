const express = require("express");

const { wrap } = require("../lib/utils");

const router = express.Router();

router.get(
    "/ping",
    wrap((req, res) => {
        res.send("hello");
    })
);
// express-jwt
// morgan
module.exports = router;
