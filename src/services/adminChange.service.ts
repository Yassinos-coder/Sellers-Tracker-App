import axios from "axios";
import { supabaseRepository } from "../repository/supabaseClient.repository";

export class ClientAdminChange {
  private repo = new supabaseRepository();

  public async notifySlack(client: {
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
    associated_admin: {
      first_name: string;
      last_name: string;
    };
  }) {
    const fullName = `${client.subject.user.first_name} ${client.subject.user.last_name}`;
    const actualSeller = `${client.associated_admin.first_name} ${client.associated_admin.last_name}`;
    const actorName = client.actor.name;

    const message = `🔄 L’agent vendeur a été changé pour le client : ${fullName} par le vendeur : ${actorName}.\n Vendeur actuelle est : ${actualSeller} `;

    try {
      const response = await axios.post(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZiMDYzZjA0MzM1MjY5NTUzMTUxMzMi_pc",
        { text: message },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`✅ Webhook message sent for ${fullName}:`, response.status);
      return { success: true };
    } catch (error) {
      console.error("❌ Error sending webhook message:", error);
      return { error: "Webhook API failed" };
    }
  }

  public async updateSupabase(client: {
    subject: {
      id: string;
    };
    actor: {
      id: string;
      name: string;
    };
    associated_admin: {
      first_name: string;
      last_name: string;
    };
  }) {
    try {
      const timestamp = new Date().toISOString();
      const adminName = `${client.associated_admin.first_name} ${client.associated_admin.last_name}`;
      const actorName = client.actor.name;

      const newEntry = {
        changed_by: actorName,
        new_admin: adminName,
        changed_at: timestamp,
      };

      const result = await this.repo.updateColumn({
        table_name: "tutorax_sales",
        client_id: client.subject.id,
        new_entry_key: timestamp,
        new_entry_value: newEntry,
      });

      console.log(`✅ Supabase updated for client ${client.subject.id}`);
      return result;
    } catch (error) {
      console.error("❌ Failed to update Supabase for admin change:", error);
      return { error: "Supabase update failed" };
    }
  }
}
