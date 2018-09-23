"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheduleController_1 = require("../controllers/scheduleController");
class ScheduleRoute {
    constructor() {
        this.scheduleController = new scheduleController_1.ScheduleController();
    }
    routes(express) {
        express.route('/create_schedule')
            .post(this.scheduleController.createSchedule);
        express.route('/update_schedule')
            .post(this.scheduleController.updateSchedule);
    }
}
exports.ScheduleRoute = ScheduleRoute;
//# sourceMappingURL=scheduleRoute.js.map