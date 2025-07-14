import { Request, Response } from "express";
import { ChangedAdmin } from "../services/changedAdmin.service";

export class EventHandler {
  private service = new ChangedAdmin();

  public CatchEvent = async (req: Request, res: Response) => {
    try {
      const EVENT = req.body;
      const clientEvent = EVENT?.events?.[0];

      if (!clientEvent || !clientEvent.subject?.id || !clientEvent.actor?.id) {
        console.warn("❌ Invalid or missing event structure");
        return res.status(400).json({ error: "Invalid client event data" });
      }

      const clientPayload: any = {
        client_id: clientEvent.subject.id,
        firstname: clientEvent.subject.user?.first_name || "Unknown",
        lastname: clientEvent.subject.user?.last_name || "Unknown",
        actor: {
          id: clientEvent.actor.id,
          name: clientEvent.actor.name,
        },
      };

      // Enqueue the job for async Slack + Supabase handling
      const result = await this.service.handleAdminChange(clientPayload);

      if (result.error) {
        return res.status(500).json({ success: false, error: result.error });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Unexpected error in CatchEvent:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
