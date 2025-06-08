resource "aws_sqs_queue" "researcher" {
  name                       = "ResearcherQueue"
  delay_seconds              = 0
  max_message_size           = 8192 #8KB
  message_retention_seconds  = 300  #5 min
  receive_wait_time_seconds  = 0
  visibility_timeout_seconds = 200
} 