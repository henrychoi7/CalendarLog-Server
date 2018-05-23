import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as expressSession from "express-session";
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
        this.express.use(cookieParser());
        this.express.use(expressSession({ secret: 'PenguinKey',
            name: 'PenguinEx',
            //store: sessionStorage,
            proxy: true,
            resave: true,
            saveUninitialized: true }));
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
