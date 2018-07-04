"use strict";
exports.__esModule = true;
var mainController_1 = require("../controllers/mainController");
var MainRoute = /** @class */ (function () {
    function MainRoute() {
        this.mainController = new mainController_1.MainController();
    }
    MainRoute.prototype.routes = function (express) {
        express.route('/schedule_list')
            .get(this.mainController.getScheduleList);
        express.route('/feed_list')
            .get(this.mainController.getFeedList);
    };
    return MainRoute;
}());
exports.MainRoute = MainRoute;
