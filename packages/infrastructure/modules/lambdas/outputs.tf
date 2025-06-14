output "discord_interactions_endpoint" {
  sensitive = true
  value     = aws_lambda_function_url.discord_interactions_url.function_url
}

output "lambda_functions" {
  value = {
    for lambda_name, value in local.lambda_functions_data :
    lambda_name => {
      arn           = aws_lambda_function.lambda_functions[lambda_name].arn
      iam_role_name = aws_iam_role.lambda_roles[lambda_name].name
      function_name = aws_lambda_function.lambda_functions[lambda_name].function_name
      permissions   = value.permissions
    }
  }
}

output "functions_to_warm" {
  description = "Map of function name to ARN for functions with keep_warm = true"
  value = {
    for lambda_name, data in local.lambda_functions_data :
    aws_lambda_function.lambda_functions[lambda_name].function_name => aws_lambda_function.lambda_functions[lambda_name].arn
    if data.keep_warm
  }
}