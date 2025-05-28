resource "aws_lambda_function_url" "discord_interactions_url" {
  function_name      = aws_lambda_function.lambda_functions["interactions_endpoint"].function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["https://discord.com"]
    allow_methods     = ["*"]
    allow_headers     = ["x-signature-timestamp", "x-signature-ed25519"]
    max_age           = 0
  }
}