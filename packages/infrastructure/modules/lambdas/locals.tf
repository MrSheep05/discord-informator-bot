locals {
  lambda_functions_data = {
    "interactions_endpoint" = {
      timeout = 5
      permissions = {
        researcher_queue_access = "write"
      }
      env = {
        DISCORD_PUBLIC_KEY = var.discord_public_key
        SQS_URL            = var.sqs_url
      }
    },
    "news_researcher" = {
      timeout = 180
      permissions = {
        researcher_queue_access = "trigger"
      }
      env = {
        PERPLEXITY_TOKEN = var.perplexity_token
        DISCORD_TOKEN    = var.discord_token
        GUILD_ID         = var.guild_id
      }
    }
  }
}