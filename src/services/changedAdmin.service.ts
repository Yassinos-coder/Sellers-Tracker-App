import axios from "axios";
import { slackAgent } from "../config/slackConfig";
import { supabaseRepository } from "../repository/supabaseClient.repository";
import { enqueueNotifySlack } from "../producers/notifySlack.producer";

export class ChangedAdmin {
  private readonly CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
  private readonly repo = new supabaseRepository();

  // Enqueues the job for async handling
  public handleAdminChange = async (CLIENT: {
    client_id: string;
    firstname: string;
    lastname: string;
    actor: { id: string; name: string };
  }): Promise<{ error?: string }> => {
    try {
      await enqueueNotifySlack(CLIENT);
      return {};
    } catch (error) {
      console.error("❌ Error enqueuing admin change job:", error);
      return { error: "Failed to enqueue job" };
    }
  };

  // Runs inside the Bull queue — handles Slack + DB update
  public processAdminChangeJob = async (CLIENT: {
    subject: {
      id: string;
      user: {
        first_name: string;
        last_name: string;
      };
    };
    actor: {
      id: string;
      name: string;
    };
  }): Promise<{ error?: string }> => {
    const fullName = `${CLIENT.subject.user.first_name} ${CLIENT.subject.user.last_name}`;
    const actorName = CLIENT.actor.name;

    const message = `🔄 Seller agent was changed for client: ${fullName} by seller: ${actorName}.`;

    // ✅ Send webhook message
    try {
      const response = await axios.post(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZiMDYzZjA0MzM1MjY5NTUzMTUxMzMi_pc",
        { text: message },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Webhook message sent:", response.status);
    } catch (error) {
      console.error("❌ Error sending webhook message:", error);
      return { error: "Webhook API failed" };
    }

    // ✅ Update Supabase
    try {
      const timestamp = Date.now().toString();
      const newEntry = {
        seller_id: CLIENT.actor.id,
        seller_name: CLIENT.actor.name,
        changed_at: new Date().toISOString(),
      };

      const result = await this.repo.updateColumn({
        table_name: "tutorax_sales", // Hardcoded as requested
        client_id: CLIENT.subject.id,
        new_entry_key: timestamp,
        new_entry_value: newEntry,
      });

      console.log("✅ Supabase updated successfully:", result);
      return {};
    } catch (error) {
      console.error("❌ Error updating Supabase via repository:", error);
      return { error: "Supabase update failed" };
    }
  };
}
