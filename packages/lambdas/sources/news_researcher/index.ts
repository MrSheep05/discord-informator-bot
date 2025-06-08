import { SQSHandler } from "aws-lambda";
import { researchTopic } from "../../libs/perplexity";
import { processRecord } from "../../libs/sqs";

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
      event.Records.map(async (record) => {
        return await processRecord({
          record,
          guildId: GUILD_ID,
          discordToken: DISCORD_TOKEN,
          researchResult: researchResult,
        });
      })
    );
  } catch (e) {
    console.error("ERROR", e);
  }
};
