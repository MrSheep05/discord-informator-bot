output "event_rule_arn" {
  description = "ARN of the EventBridge rule for Lambda warming"
  value       = aws_cloudwatch_event_rule.lambda_warmer_rule.arn
} 