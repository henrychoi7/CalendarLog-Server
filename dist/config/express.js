"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const userRoute_1 = require("../routes/userRoute");
const mainRoute_1 = require("../routes/mainRoute");
class Express {
    constructor() {
        this.userRoute = new userRoute_1.UserRoute();
        this.mainRoute = new mainRoute_1.MainRoute();
        this.express = express();
        this.config();
        this.userRoute.routes(this.express);
        this.mainRoute.routes(this.express);
        this.mountRoutes();
    }
    config() {
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
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello guys! This is Node.js + TypeScript + ESLint',
            });
        });
        this.express.use('/', router);
    }
}
exports.default = new Express().express;
//# sourceMappingURL=express.js.map