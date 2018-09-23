import { ScheduleController } from "../controllers/scheduleController";

export class ScheduleRoute {
    public scheduleController: ScheduleController = new ScheduleController();

    public routes(express): void {
        express.route('/create_schedule')
            .post(this.scheduleController.createSchedule);

        express.route('/update_schedule')
            .post(this.scheduleController.updateSchedule);
    }
}