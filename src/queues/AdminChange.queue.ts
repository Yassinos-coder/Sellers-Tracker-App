import Queue from "bull";
import { redisConfig } from "../config/redisConfig";
import { ChangedAdmin } from "../services/changedAdmin.service";

export const notifySlackQueue = new Queue("notify-slack-queue", {
  redis: redisConfig,
});

const service = new ChangedAdmin();

// Define the processor - now calls the separate processing method
notifySlackQueue.process("notify-slack-queue", async (job) => {
  const client = job.data.client;
  try {
    // ✅ Call the separate processing method instead of handleAdminChange
    const result = await service.processAdminChangeJob(client);
    
    if (result.error) {
      console.log(`❌ Job processing failed: ${result.error}`);
      throw new Error(result.error);
    }
    
    console.log(`✅ Job completed successfully for client: ${client.client_id}`);
  } catch (error) {
    console.error("❌ Job failed for client:", client.client_id, error);
    throw error; // This will mark the job as failed and trigger retries
  }
});