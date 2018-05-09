import { UserController } from "../controllers/userController";

export class UserRoute {
    public userController: UserController = new UserController();

    public routes(express): void {
        express.route('/login')
            .get(this.userController.getLogin)
            .post(this.userController.postLogin);

        express.route('/register')
            .post(this.userController.postRegister);
    }
}