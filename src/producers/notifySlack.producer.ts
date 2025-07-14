import { notifySlackQueue } from "../queues/AdminChange.queue";

export const enqueueNotifySlack = async (client: {
  client_id: string;
  firstname: string;
  lastname: string;
  actor: { id: string; name: string };
}) => {
  try {
    await notifySlackQueue.add(
      "notify-slack-queue",
      {
        client: {
          subject: {
            id: client.client_id,
            user: {
              first_name: client.firstname,
              last_name: client.lastname,
            },
          },
          actor: client.actor,
        },
      },
      {
        backoff: {
          type: "exponential",
          delay: 5000, // 5s exponential backoff
        },
        removeOnComplete: 5,
        removeOnFail: 10,
      }
    );

    console.log(`✅ Job enqueued for client_id: ${client.client_id}`);
  } catch (error) {
    console.error("❌ Failed to enqueue notifySlack job:", error);
    throw error;
  }
};
