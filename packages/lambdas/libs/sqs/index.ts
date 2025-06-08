import {
  replyToCommand,
  sendMessageToChannel,
} from "@discord-bot-libs/discord";
import { ArticleData, SQSMessagePayload } from "@discord-bot-libs/types";
import { SQSRecord } from "aws-lambda";

export interface ProcessRecordConfig {
  record: SQSRecord;
  guildId?: string;
  discordToken: string;
  researchResult: ArticleData;
}

export const processRecord = async ({
  record,
  guildId,
  discordToken,
  researchResult,
}: ProcessRecordConfig) => {
  try {
    console.log(record);
    const message: SQSMessagePayload = JSON.parse(record.body);
    const { token, applicationId } = message;

    if (!token || !applicationId) {
      if (!guildId) {
        console.error("GUILD_ID environment variable is not set");
        return;
      }
      return await sendMessageToChannel({
        guildId: guildId,
        discordToken: discordToken,
        researchResult: researchResult,
      });
    } else {
      return await replyToCommand({
        token: token,
        applicationId: applicationId,
        discordToken: discordToken,
        researchResult: researchResult,
      });
    }
  } catch (e) {
    console.error("ERROR processing record:", e);
    throw e; // Re-throw to ensure Promise.all fails if any record fails
  }
};
