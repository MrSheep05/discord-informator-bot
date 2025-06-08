export interface ArticleFragment {
  header: string;
  content: string;
}

export interface ArticleData {
  title: string;
  fragments: ArticleFragment[];
  main_image_url: string;
}

export interface DiscordMessageConfig {
  guildId: string;
  discordToken: string;
  researchResult: ArticleData;
}

export interface DiscordReplyConfig {
  applicationId: string;
  token: string;
  discordToken: string;
  researchResult: ArticleData;
}

export interface SQSMessagePayload {
  token?: string;
  applicationId?: string;
  guildId?: string;
  [key: string]: any;
}
