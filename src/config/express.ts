import * as express from 'express';
import * as bodyParser from "body-parser";
import { UserRoute } from "../routes/userRoute";

class Express {
  public express: express.Application;
    public userRoute: UserRoute = new UserRoute();

    constructor() {
    this.express = express();
    this.config();
    this.userRoute.routes(this.express);
    //this.mountRoutes();
  }

    private config(): void{
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
  /*private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello gays! This is Node.js + TypeScript + ESLint',
      });
    });
    this.express.use('/', router);
  }*/
}

export default new Express().express;
