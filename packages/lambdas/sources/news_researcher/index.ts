import { SQSHandler } from "aws-lambda";
import { sendMessageToChannel, replyToCommand } from "../../libs/discord";
import { researchTopic } from "../../libs/perplexity";
import { parseSQSRecord, isSlashCommandMessage } from "../../libs/sqs";

export const handler: SQSHandler = async (event) => {
  console.log("Recieved given event", event);
  try {
    const GUILD_ID = process.env.GUILD_ID;
    const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
    const PERPLEXITY_TOKEN = process.env.PERPLEXITY_TOKEN;
    if (!DISCORD_TOKEN) {
      console.error("DISCORD_TOKEN environment variable is not set");
      return;
    }
    if (!PERPLEXITY_TOKEN) {
      console.error("PERPLEXITY_TOKEN environment variable is not set");
      return;
    }

    console.log("Recieved records", event.Records);

    const researchResult = await researchTopic(PERPLEXITY_TOKEN);
    if (!researchResult) return;
    await Promise.all(
      event.Records.map(async (record: { body: string }) => {
        try {
          console.log(record);
          const message = parseSQSRecord(record);

          if (!isSlashCommandMessage(message)) {
            if (!GUILD_ID) {
              console.error("GUILD_ID environment variable is not set");
              return;
            }
            return await sendMessageToChannel({
              guildId: GUILD_ID,
              discordToken: DISCORD_TOKEN,
              researchResult: researchResult,
            });
          } else {
            return await replyToCommand({
              token: message.token!,
              applicationId: message.applicationId!,
              discordToken: DISCORD_TOKEN,
              researchResult: researchResult,
            });
          }
        } catch (e) {
          console.error("ERROR processing record:", e);
          throw e; // Re-throw to ensure Promise.all fails if any record fails
        }
      })
    );
  } catch (e) {
    console.error("ERROR", e);
  }
};
