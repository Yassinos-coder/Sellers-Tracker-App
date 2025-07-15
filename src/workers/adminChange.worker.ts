import { Job } from "bull";
import { adminChangeQueue } from "../queues/AdminChange.queue";
import { ClientAdminChange } from "../services/adminChange.service";

export class ClientAdminChangeWorker {
  private clientAdminChangeService: ClientAdminChange;

  constructor() {
    this.clientAdminChangeService = new ClientAdminChange();
    this.initializeProcessors();
  }

  private initializeProcessors(): void {
    // Make sure the job type matches what you're adding in the producer
    adminChangeQueue.process("admin-change-queue", 1, this.processAdminChange.bind(this));
    
    // Add event listeners for debugging
    adminChangeQueue.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });

    adminChangeQueue.on('failed', (job, err) => {
      console.error(`❌ Job ${job.id} failed:`, err);
    });

    adminChangeQueue.on('stalled', (job) => {
      console.warn(`⚠️ Job ${job.id} stalled`);
    });

    adminChangeQueue.on('waiting', (jobId) => {
      console.log(`⏳ Job ${jobId} is waiting`);
    });

    adminChangeQueue.on('active', (job) => {
      console.log(`🔄 Job ${job.id} is now active`);
    });
  }

  private async processAdminChange(job: Job<any>): Promise<any> {
    try {
      console.log(`🔧 Processing admin-change job ${job.id}`);
      const client = job.data.client;

      await this.clientAdminChangeService.notifySlack(client);
      await this.clientAdminChangeService.updateSupabase(client);

      console.log(`✅ Finished processing admin-change job ${job.id}`);
      return {
        processedAt: new Date().toISOString(),
        status: "success",
      };
    } catch (error) {
      console.error(`❌ Failed admin-change job ${job.id}:`, error);
      throw error;
    }
  }
}