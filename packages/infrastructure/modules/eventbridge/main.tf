resource "aws_cloudwatch_event_rule" "lambda_warmer_rule" {
  name                = "lambda-warmer-rule-${var.random_name}"
  description         = "Trigger Lambda function every 5 minutes to keep it warm"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "lambda_warmer_target" {
  for_each = var.lambda_functions_to_warm

  rule      = aws_cloudwatch_event_rule.lambda_warmer_rule.name
  target_id = "lambda-warmer-${each.key}"
  arn       = each.value
  
  input = jsonencode({
    warmer = true
    source = "eventbridge-warmer"
  })
}

resource "aws_lambda_permission" "allow_eventbridge" {
  for_each = var.lambda_functions_to_warm

  statement_id  = "AllowExecutionFromEventBridge-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.key
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_warmer_rule.arn
} 