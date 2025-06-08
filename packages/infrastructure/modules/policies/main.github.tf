resource "aws_iam_role" "github_assume_role" {
  name               = format("github-role-%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.github_iam_policy_document.json
}