"use strict";
exports.__esModule = true;
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getLogin = function (req, res) {
        console.log("get login");
    };
    UserController.prototype.postLogin = function (req, res) {
        console.log("post login");
    };
    UserController.prototype.postRegister = function (req, res) {
        console.log("post register");
    };
    return UserController;
}());
exports.UserController = UserController;
