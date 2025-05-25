import { SQSHandler } from "aws-lambda";

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
          const message = JSON.parse(record.body);
          const { token, applicationId } = message;

          if (!token || !applicationId) {
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
              token: token,
              applicationId: applicationId,
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

interface ArticleFragment {
  header: string;
  content: string;
}
interface ArticleData {
  title: string;
  fragments: ArticleFragment[];
}

const sendMessageToChannel = async ({
  guildId,
  discordToken,
  researchResult,
}: {
  guildId: string;
  discordToken: string;
  researchResult: ArticleData;
}) => {
  const getChannelsUrl = `https://discord.com/api/v10/guilds/${guildId}/channels`;
  console.log("getChannelsUrl", getChannelsUrl);

  const embed_object = {
    title: researchResult.title,
    description: "Today's summary of AI news",
    timestamp: new Date().toLocaleDateString(),
    fields: researchResult.fragments.map((fragment) => ({
      name: fragment.header,
      value: fragment.content,
      inline: false,
    })),
  };

  const response = await fetch(getChannelsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bot ${discordToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: 4, embeds: [embed_object] }),
  });

  console.log("response", response);
};

const replyToCommand = async ({
  applicationId,
  token,
  discordToken,
  researchResult,
}: {
  applicationId: string;
  token: string;
  discordToken: string;
  researchResult: ArticleData;
}) => {
  const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`;
  console.log("followUpUrl", followUpUrl);

  const embed_object = {
    title: researchResult.title,
    description: "Today's summary of AI news",
    timestamp: new Date().toISOString(),
    fields: researchResult.fragments.map((fragment) => ({
      name: fragment.header,
      value: fragment.content,
      inline: false,
    })),
  };
  const response = await fetch(followUpUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bot ${discordToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ embeds: [embed_object] }),
  });

  console.log("response", response);
};

const researchTopic = async (apiKey: string): Promise<ArticleData | null> => {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: `
                  ---
    
                  You are a knowledgeable and reliable assistant designed to provide accurate, detailed, and up‑to‑date information in response to user queries. Your responses should be:
    
                  ## 1. Thorough and Well‑Organized
                  - Break down complex topics step by step.
                  - **ALWAYS** use "## Header" for headings and  "### Subheader / ### 1. Item number 1" for subheadings or numeric list items.
    
                  ## 2. Contextually Relevant and Direct
                  - Avoid vague or generic statements.
                  - Always ensure your answers directly address the user's request.
    
                  ## 3. Factual and Up‑to‑Date
                  - Prioritize factual accuracy and completeness.
                  - If you reference external sources, provide at least three high‑quality citations for simple queries or at least ten for in‑depth queries.
    
                  ## 4. Inline Author–Year Citations Only
                  - **Do not** use any bracketed numbers (e.g., "1") or superscripts to point to sources.
                  - Whenever you draw on a source, integrate it directly into the text using author–year style, for example:
                    > According to the International Energy Agency (2024), renewable power capacity has doubled in the last decade.
                  - **Do not** hyperlink any text. All citations remain plain text.
    
                  ## 5. Plain‑Text Reference List
                  - At the end of your answer, include an unnumbered bulleted list of all works cited, in this format:
                    - International Energy Agency. (2024). *World Energy Outlook 2024*. IEA Publications.
                    - Smith, J. (2023). *Global Renewables Status Report*. Renewable Energy Press.
    
                  ## 6. Human‑Like Tone
                  - Use natural, conversational language.
                  - Maintain a professional, helpful tone.
    
                  ## 7. News within user's date range
                  - Provide only the informations from the user's specified date range.
    
                  ---
    
                  **Example of proper inline citation**:
    
                  > Solar and wind together contributed more than 15% of global electricity last year, marking a significant rise over the past decade, according to the International Energy Agency (2024). The adoption rate has been bolstered by falling technology costs and supportive policies, as noted by Smith (2023).
    
                  **References:**
                  - International Energy Agency. (2024). *World Energy Outlook 2024*. IEA Publications.
                  - Smith, J. (2023). *Global Renewables Status Report*. Renewable Energy Press.`,
          },
          {
            role: "user",
            content: `What are the latest developments in AI technology from today or yesterday? Focus on significant breakthroughs, new releases, and important industry news. Today's date is ${new Date().toLocaleDateString()}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description:
                    "A short title for this article. For example, 'AI Breakthroughs Today', 'New AI Model Released', 'AI in Healthcare Advances'",
                },
                fragments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      header: {
                        type: "string",
                        description: "The title of the article fragment",
                      },
                      content: {
                        type: "string",
                        description:
                          "The detailed description of given article fragment",
                      },
                    },
                    required: ["header", "content"],
                  },
                },
              },
              required: ["title", "fragments"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error(
          "Invalid API key. Please check your Perplexity AI API key in settings."
        );
      }
      console.error("INVALID RESPONSE", response);
      return null;
    }

    const data = await response.json();
    console.log("Response from perplexity", data);
    const content = JSON.parse(data.choices[0].message.content);
    const { title, fragments } = content;
    //TODO verify if the object is valid
    if (!title || !fragments) {
      return null;
    }
    return content;
  } catch (error) {
    console.error("Error fetching AI news:", error);
    return null;
  }
};
