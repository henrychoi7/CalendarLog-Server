"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
class UserRoute {
    constructor() {
        this.userController = new userController_1.UserController();
    }
    routes(express) {
        express.route('/login')
            .get(this.userController.getLogin)
            .post(this.userController.postLogin);
        express.route('/register')
            .post(this.userController.postRegister);
        express.route('/update_note_status')
            .put(this.userController.updateNoteStatus);
        express.route('/delete_user_info')
            .delete(this.userController.deleteUserInfo);
    }
}
exports.UserRoute = UserRoute;
//# sourceMappingURL=userRoute.js.map