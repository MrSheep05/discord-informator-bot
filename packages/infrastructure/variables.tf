variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-central-1"
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "GitHub repository owner/organization"
  type        = string
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