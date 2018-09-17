"use strict";
exports.__esModule = true;
var scheduleController_1 = require("../controllers/scheduleController");
var ScheduleRoute = /** @class */ (function () {
    function ScheduleRoute() {
        this.scheduleController = new scheduleController_1.ScheduleController();
    }
    ScheduleRoute.prototype.routes = function (express) {
        express.route('/create_schedule')
            .post(this.scheduleController.createSchedule);
        express.route('/modify_schedule')
            .post(this.scheduleController.modifySchedule);
    };
    return ScheduleRoute;
}());
exports.ScheduleRoute = ScheduleRoute;
