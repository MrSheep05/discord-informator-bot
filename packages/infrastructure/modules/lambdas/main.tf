resource "aws_iam_role" "lambda_roles" {
  for_each = local.lambda_functions_data

  name               = format("%s-lambda-role-%s", each.key, var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "lambda_functions" {
  for_each = local.lambda_functions_data

  function_name = format("%s_%s", each.key, var.random_name)
  role          = aws_iam_role.lambda_roles[each.key].arn
  runtime       = "nodejs22.x"
  timeout       = each.value.timeout
  memory_size   = 128
  publish       = true

  handler   = "index.handler"
  s3_bucket = var.lambdas_bucket_name
  s3_key    = data.aws_s3_object.object[each.key].key

  source_code_hash = data.aws_s3_object.object[each.key].etag

  dynamic "environment" {
    for_each = length(keys(each.value.env)) > 0 ? [each.value.env] : []
    content {
      variables = environment.value
    }
  }
}