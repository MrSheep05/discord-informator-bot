output "researcher_queue_url" {
  value = aws_sqs_queue.researcher.url
}

output "researcher_queue_arn" {
  value = aws_sqs_queue.researcher.arn
}