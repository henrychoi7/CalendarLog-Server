import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as expressSession from "express-session";
import { UserRoute } from "../routes/userRoute";
import { MainRoute } from "../routes/mainRoute";
import { ScheduleRoute } from "../routes/scheduleRoute";

class Express {
    public express: express.Application;
    private userRoute: UserRoute = new UserRoute();
    private mainRoute: MainRoute = new MainRoute();
    private scheduleRoute: ScheduleRoute = new ScheduleRoute();

    constructor() {
        this.express = express();
        this.config();
        this.userRoute.routes(this.express);
        this.mainRoute.routes(this.express);
        this.scheduleRoute.routes(this.express);
        this.mountRoutes();
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

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello guys! This is Node.js + TypeScript + ESLint',
            });
        });
        this.express.use('/', router);
    }
}

export default new Express().express;
