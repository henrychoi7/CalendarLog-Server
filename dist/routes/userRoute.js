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
        express.route('/update_note_status')
            .put(this.userController.updateNoteStatus);
        express.route('/delete_user_info')["delete"](this.userController.deleteUserInfo);
        express.route('/user_info_for_edit')
            .get(this.userController.getUserInfoForEdit);
    };
    return UserRoute;
}());
exports.UserRoute = UserRoute;
