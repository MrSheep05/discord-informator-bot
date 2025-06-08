//TOD move discord logic here

import {
  ArticleData,
  DiscordMessageConfig,
  DiscordReplyConfig,
} from "../types/research";

export const sendMessageToChannel = async ({
  guildId,
  discordToken,
  researchResult,
}: DiscordMessageConfig) => {
  const getChannelsUrl = `https://discord.com/api/v10/guilds/${guildId}/channels`;
  console.log("getChannelsUrl", getChannelsUrl);

  const embed_object = {
    title: researchResult.title,
    description: "Today's summary of AI news",
    color: 0x00bfff,
    timestamp: new Date().toISOString(),
    fields: researchResult.fragments.map((fragment) => ({
      name: fragment.header,
      value: fragment.content,
      inline: false,
    })),
    footer: {
      text: "🤖 AI News Daily Digest",
      icon_url:
        "https://discord.com/assets/3437c10597c1526c3dbd98c737c2bcae.svg",
    },
    thumbnail: {
      url: "https://discord.com/assets/3437c10597c1526c3dbd98c737c2bcae.svg",
    },
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

export const replyToCommand = async ({
  applicationId,
  token,
  discordToken,
  researchResult,
}: DiscordReplyConfig) => {
  const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`;
  console.log("followUpUrl", followUpUrl);

  const embed_object = {
    title: researchResult.title,
    description: "Today's summary of AI news",
    color: 0x00bfff, // Deep Sky Blue - a modern tech/AI color
    timestamp: new Date().toISOString(),
    fields: researchResult.fragments.map((fragment) => ({
      name: fragment.header,
      value: fragment.content,
      inline: false,
    })),
    footer: {
      text: "🤖 AI News Daily Digest",
      icon_url: researchResult.main_image_url,
    },
    thumbnail: {
      url: researchResult.main_image_url,
    },
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
