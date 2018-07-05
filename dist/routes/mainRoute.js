"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainController_1 = require("../controllers/mainController");
class MainRoute {
    constructor() {
        this.mainController = new mainController_1.MainController();
    }
    routes(express) {
        express.route('/schedule_and_feed_list')
            .get(this.mainController.getScheduleAndFeedList);
        express.route('/feed_list')
            .get(this.mainController.getFeedList);
    }
}
exports.MainRoute = MainRoute;
//# sourceMappingURL=mainRoute.js.map