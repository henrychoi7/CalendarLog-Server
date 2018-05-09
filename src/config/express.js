"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var userRoute_1 = require("../routes/userRoute");
var Express = /** @class */ (function () {
    function Express() {
        this.userRoute = new userRoute_1.UserRoute();
        this.express = express();
        this.config();
        this.userRoute.routes(this.express);
        //this.mountRoutes();
    }
    Express.prototype.config = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    return Express;
}());
exports["default"] = new Express().express;
