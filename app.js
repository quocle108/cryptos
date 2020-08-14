var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cryptoRouter = require("./src/routes/crypto");
var apiResponse = require("./src/common/helpers/apiResponse");
var cors = require("cors");
const connectMongo = require("./config/mongo");

connectMongo();
var app = express();
app.set("port", process.env.PORT || 3000);
//don't show the log when it is test
if(process.env.NODE_ENV !== "dev") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//To allow cross-origin requests
app.use(cors());

app.use("/crypto/", cryptoRouter);
// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});
module.exports = app;

