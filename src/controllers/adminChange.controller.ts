import { Request, Response } from "express";
import { ClientAdminChange } from "../producers/adminChange.producer";
import { supabaseRepository } from "../repository/supabaseClient.repository";

const adminChangeProducer = new ClientAdminChange();

export class adminChange {
  private repo = new supabaseRepository();

  public CatchEvent = async (req: Request, res: Response) => {
    try {
      const eventData = req.body;
      const rawEvent = eventData?.events?.[0];

      if (!rawEvent || !rawEvent.subject) {
        return res.status(400).json({ message: "Invalid event payload" });
      }

      // ✅ Normalize data
      const client = {
        clientId: rawEvent.subject.id,
        firstname: rawEvent.subject.first_name,
        lastname: rawEvent.subject.last_name,
        actor: {
          id: rawEvent.actor.id,
          name: rawEvent.actor.name,
        },
        associated_admin: rawEvent.subject.associated_admin,
      };

      if (rawEvent.action === "CHANGED_CLIENT_ADMIN") {
        const isActorSeller = await this.repo.checkSeller(client.actor.id);

        // Check if actor is not a seller (returns false)
        if (!isActorSeller) {
          console.log(isActorSeller, client.actor.id);
          console.log(
            `✅ Received admin change event for client ${client.clientId} but actor is not a seller, ACTION IGNORED`
          );
          return res.status(200).json({
            message:
              "✅ Client admin change event handled successfully, but actor is not a seller, ACTION IGNORED",
          });
        }

        // Actor is a seller, proceed with processing
        await adminChangeProducer.produceAdminChange(client);
        console.log(
          `✅ Received admin change event for client ${client.clientId}`
        );
        return res.status(200).json({
          message: "✅ Client admin change event handled successfully",
        });
      } else {
        console.log("Event not CHANGED_CLIENT_ADMIN so ignored");
        return res
          .status(200)
          .json({ message: "Event not CHANGED_CLIENT_ADMIN so ignored" });
      }
    } catch (error) {
      console.error("❌ Unexpected error in CatchEvent:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
