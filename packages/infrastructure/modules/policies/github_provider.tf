resource "aws_iam_openid_connect_provider" "github_provider" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list  = ["sts.amazonaws.com", "https://github.com/MrSheep05/discord-informator-bot"]
  thumbprint_list = ["d89e3bd43d5d909b47a18977aa9d5ce36cee184c"]
}