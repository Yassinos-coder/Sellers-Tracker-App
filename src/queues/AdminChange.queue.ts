import Queue from "bull";
import { redisConfig } from "../config/redisConfig";

export const adminChangeQueue = new Queue("admin-change-queue", {
  redis: redisConfig,
  settings: {
    lockDuration: 60000,
    maxStalledCount: 0,
  },
  limiter: {
    max: 90,
    duration: 15000,
  },
});

