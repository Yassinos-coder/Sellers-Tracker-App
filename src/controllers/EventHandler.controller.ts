import { Request, Response } from "express";

export class EventHandler {
  public CatchEvent = async (req: Request, res: Response) => {
    try {
      const EVENT = req.body;
      const CLIENT = EVENT?.events?.[0] || null;
      if (!CLIENT) {
        throw new Error("Client null");
      }
      // trigger service
      console.log(`📥 Received a client admin update ${CLIENT?.subject?.id}`);
    } catch (error) {}
  };
}
