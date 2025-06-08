variable "perplexity_token" {
  sensitive = true
  type      = string
}

variable "discord_token" {
  sensitive = true
  type      = string
}

variable "discord_public_key" {
  sensitive = true
  type      = string
}

variable "sqs_url" {
  type = string
}


variable "guild_id" {
  type    = string
  default = null
}

variable "lambdas_bucket_name" {
  type = string
}

variable "random_name" {
  type = string
}

variable "sqs_arn" {
  type = string
}