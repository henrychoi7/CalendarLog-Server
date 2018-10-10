import { ScheduleController } from "../controllers/scheduleController";

export class ScheduleRoute {
    public scheduleController: ScheduleController = new ScheduleController();

    public routes(express): void {
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