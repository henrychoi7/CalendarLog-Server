"use strict";
exports.__esModule = true;
var userController_1 = require("../controllers/userController");
var UserRoute = /** @class */ (function () {
    function UserRoute() {
        this.userController = new userController_1.UserController();
    }
    UserRoute.prototype.routes = function (express) {
        express.route('/login')
            .get(this.userController.getLogin)
            .post(this.userController.postLogin);
        express.route('/register')
            .post(this.userController.postRegister);
    };
    return UserRoute;
}());
exports.UserRoute = UserRoute;
