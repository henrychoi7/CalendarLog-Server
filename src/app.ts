import * as express from 'express';

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello gays! This is Node.js + TypeScript + ESLint',
      });
    });
    this.express.use('/', router);
  }
}

export default new App().express;
