"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var userRoute_1 = require("../routes/userRoute");
var mainRoute_1 = require("../routes/mainRoute");
var Express = /** @class */ (function () {
    function Express() {
        this.userRoute = new userRoute_1.UserRoute();
        this.mainRoute = new mainRoute_1.MainRoute();
        this.express = express();
        this.config();
        this.userRoute.routes(this.express);
        this.mainRoute.routes(this.express);
        this.mountRoutes();
    }
    Express.prototype.config = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(expressSession({ secret: 'PenguinKey',
            name: 'PenguinEx',
            //store: sessionStorage,
            proxy: true,
            resave: true,
            saveUninitialized: true }));
    };
    Express.prototype.mountRoutes = function () {
        var router = express.Router();
        router.get('/', function (req, res) {
            res.json({
                message: 'Hello guys! This is Node.js + TypeScript + ESLint'
            });
        });
        this.express.use('/', router);
    };
    return Express;
}());
exports["default"] = new Express().express;
