import { QueueOptions } from "bull";
import "dotenv/config";

// Safety check
if (!process.env.REDIS_URL) {
  throw new Error("❌ REDIS_URL is not defined in the environment variables");
} else {
  console.log("Got REDIS_URL");
}

// Parse Redis URL (fallback is mostly symbolic, since you throw above)
const redisURL = process.env.REDIS_URL
  ? new URL(process.env.REDIS_URL)
  : new URL("redis://default:YlAVPT568pX2Dsm6G31tCAdgd4CnVVsJ@redis-10491.c82.us-east-1-2.ec2.redns.redis-cloud.com:10491");

// Export Bull-compatible config
export const redisConfig: QueueOptions["redis"] = {
  host: redisURL.hostname,
  port: parseInt(redisURL.port || "6379"),
  username: redisURL.username || "",
  password: redisURL.password || "",
  family: 0, // IPv4
};
