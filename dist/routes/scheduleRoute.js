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
        express.route('/comment_list')
            .get(this.scheduleController.getCommentList);
        express.route('/create_comment')
            .post(this.scheduleController.createComment);
    }
}
exports.ScheduleRoute = ScheduleRoute;
//# sourceMappingURL=scheduleRoute.js.map