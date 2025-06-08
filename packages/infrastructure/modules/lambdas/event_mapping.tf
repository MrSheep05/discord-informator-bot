resource "aws_lambda_event_source_mapping" "researcher_trigger" {
  event_source_arn = var.sqs_arn
  function_name    = aws_lambda_function.lambda_functions["news_researcher"].arn
}