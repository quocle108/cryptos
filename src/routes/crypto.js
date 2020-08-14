var express = require("express");
var ethRouter = require("./eth");


var crypto = express();

crypto.use("/eth/", ethRouter);

module.exports = crypto;