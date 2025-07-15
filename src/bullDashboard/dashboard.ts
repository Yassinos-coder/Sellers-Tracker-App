// src/dashboard/Dashboard.ts
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { Express } from "express";
import { Queue } from "bull";
import { adminChangeQueue } from "../queues/AdminChange.queue";

export class Dashboard {
  private static instance: Dashboard;
  public readonly serverAdapter: ExpressAdapter;

  private constructor(queues: Queue[]) {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath("/admin/queues");

    createBullBoard({
      queues: queues.map((queue) => new BullAdapter(queue)),
      serverAdapter: this.serverAdapter,
    });
  }

  public static getInstance(): Dashboard {
    if (!Dashboard.instance) {
      Dashboard.instance = new Dashboard([
        adminChangeQueue, // 👈 Add your queue here
      ]);
    }
    return Dashboard.instance;
  }

  public mount(app: Express): void {
    app.use("/admin/queues", this.serverAdapter.getRouter());
  }
}
