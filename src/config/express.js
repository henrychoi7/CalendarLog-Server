"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
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
        this.express.use(cookieParser());
        this.express.use(expressSession({ secret: 'PenguinKey',
            name: 'PenguinEx',
            store: sessionStorage,
            proxy: true,
            resave: true,
            saveUninitialized: true }));
    };
    return Express;
}());
exports["default"] = new Express().express;
