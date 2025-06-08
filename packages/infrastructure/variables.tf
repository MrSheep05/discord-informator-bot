variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-central-1"
}
variable "perplexity_token" {
  type      = string
  sensitive = true
}

variable "discord_token" {
  type      = string
  sensitive = true
}

variable "discord_public_key" {
  type      = string
  sensitive = true
}