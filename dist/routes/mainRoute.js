"use strict";
exports.__esModule = true;
var mainController_1 = require("../controllers/mainController");
var MainRoute = /** @class */ (function () {
    function MainRoute() {
        this.mainController = new mainController_1.MainController();
    }
    MainRoute.prototype.routes = function (express) {
        express.route('/schedule_and_feed_list')
            .get(this.mainController.getScheduleAndFeedList);
        express.route('/feed_list')
            .get(this.mainController.getFeedList);
        express.route('/feed_list_for_day')
            .get(this.mainController.getFeedListForDay);
        express.route('/feed_list_for_user_info')
            .get(this.mainController.getFeedListForUserInfo);
    };
    return MainRoute;
}());
exports.MainRoute = MainRoute;
