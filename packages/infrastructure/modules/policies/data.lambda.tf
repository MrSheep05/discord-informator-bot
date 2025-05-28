data "aws_iam_policy_document" "lambda_policies" {
  for_each = var.lambda_functions

  statement {
    sid = "RoleForLambdaLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  statement {
    sid = "RoleForVPCManagement"
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  dynamic "statement" {
    for_each = each.value.permissions.researcher_queue_access == "trigger" ? [each.key] : []

    content {
      sid = "RoleForReadingResearcherSqsRecords"
      actions = [
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes",
        "sqs:ReceiveMessage"
      ]
      effect = "Allow"
      resources = [
        var.researcher_sqs_arn
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.researcher_queue_access == "write" ? [each.key] : []

    content {
      sid = "RoleForSendingResearcherSqsRecords"
      actions = [
        "sqs:SendMessage",
      ]
      effect = "Allow"
      resources = [
        var.researcher_sqs_arn
      ]
    }
  }
}