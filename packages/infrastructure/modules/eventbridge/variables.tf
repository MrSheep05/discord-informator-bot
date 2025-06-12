variable "random_name" {
  description = "Random name suffix for resources"
  type        = string
}

variable "lambda_functions_to_warm" {
  description = "Map of Lambda function names to their ARNs that need to be kept warm"
  type        = map(string)
} 