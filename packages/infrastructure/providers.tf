provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { Project = "discord-informator-bot" }
  }
}

provider "github" {
  token = var.github_token
  owner = var.github_owner
}