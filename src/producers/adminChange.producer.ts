import { adminChangeQueue } from "../queues/AdminChange.queue";

export class ClientAdminChange {
  constructor() {}

  public async produceAdminChange(client: {
    clientId: string;
    firstname: string;
    lastname: string;
    actor: { id: string; name: string };
    associated_admin: {
      first_name: string;
      last_name: string;
    };
  }) {
    try {
      const job = await adminChangeQueue.add(
        "admin-change-queue",
        {
          client: {
            subject: {
              id: client.clientId,
              user: {
                first_name: client.firstname,
                last_name: client.lastname,
              },
            },
            actor: client.actor,
            associated_admin: {
              first_name: client.associated_admin.first_name,
              last_name: client.associated_admin.last_name,
            },
          },
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: 100,
          removeOnFail: 100,
        }
      );
      console.log(
        `✅ Client KPI addition job queued: ${job.id} for client: ${client.clientId} (will process after 6 minutes delay)`
      );
    } catch (error) {
      console.error("❌ Error producing for adminChange");
      throw error;
    }
  }
}
