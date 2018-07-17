import { MainController } from "../controllers/mainController";

export class MainRoute {
    public mainController: MainController = new MainController();

    public routes(express): void {
        express.route('/schedule_and_feed_list')
            .get(this.mainController.getScheduleAndFeedList);

        express.route('/feed_list')
            .get(this.mainController.getFeedList);

        express.route('/feed_list_for_day')
            .get(this.mainController.getFeedListForDay);
    }
}