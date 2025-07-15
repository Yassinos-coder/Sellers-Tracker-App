import { Router as ExpressRouter } from "express";
import { EventHandler } from "../controllers/EventHandler.controller";

const handler = new EventHandler();

class AppRouter {
  private router: ExpressRouter;
  private basePath: string;

  constructor(basePath: string = "") {
    this.router = ExpressRouter();
    this.basePath = basePath;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/changedAdminEvent", handler.CatchEvent);


  }

  getRouter() {
    return this.router;
  }
}

export default AppRouter;
