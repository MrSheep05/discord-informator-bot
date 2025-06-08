provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { Project = "discord-informator-bot" }
  }
}