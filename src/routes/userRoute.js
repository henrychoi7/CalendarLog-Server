"use strict";
exports.__esModule = true;
var userController_1 = require("../controllers/userController");
//import {Request, Response} from "express";
var UserRoute = /** @class */ (function () {
    function UserRoute() {
        this.userController = new userController_1.UserController();
    }
    UserRoute.prototype.routes = function (express) {
        express.route('/login')
            .get(this.userController.getLogin);
    };
    return UserRoute;
}());
exports.UserRoute = UserRoute;
