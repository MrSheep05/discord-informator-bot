terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "aethera-dev-team"
    workspaces {
      name = "discord-informator-bot"
    }
  }
}