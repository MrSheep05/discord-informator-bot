data "aws_iam_policy_document" "lambdas_bucket_access_policy" {
  statement {
    sid = "S3LambdasAccess"
    actions = [
      "s3:DeleteObject",
      "s3:PutObject",
      "s3:ListBucket",
      "s3:PutObjectAcl"
    ]
    effect = "Allow"
    resources = [
      var.lambdas_bucket_arn,
      format("%s/*", var.lambdas_bucket_arn)
    ]
  }
}