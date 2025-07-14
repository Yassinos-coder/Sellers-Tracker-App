import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN; 

if (!token) {
    throw new Error('Bot token required!')
}

export const slackAgent = new WebClient(token);

