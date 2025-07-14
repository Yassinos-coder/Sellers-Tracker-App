import { slackAgent } from "../config/slackConfig";

export class ChangedAdmin {
  private readonly CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
  // send notification to slack channel
  public notifySlack = async (CLIENT: any) => {
    if (!this.CHANNEL_ID) {
      console.error("SLACK_CHANNEL_ID is not defined");
      return;
    }

    try {
      const result = await slackAgent.chat.postMessage({
        channel: this.CHANNEL_ID,
        text: `🔄 Seller agent was changed for client: ${
          CLIENT.firstname + CLIENT.lastname
        } by seller: ${CLIENT.actor.name}.`,
      });
      console.log("Slack message sent:", result.ts);
    } catch (error) {
      console.error("Error sending Slack message:", error);
    }
  };
  // Update Supabase table
  public updateTable = async(CLIENT: any) => {
    try {
        
    } catch (error) {
        
    }
  }
}
