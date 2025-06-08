variable "lambda_functions" {
  type = map(object({
    arn : string
    iam_role_name : string
    permissions : map(any)
  }))
}

variable "researcher_sqs_arn" {
  type = string
}

variable "random_name" {
  type = string
}

variable "lambdas_bucket_arn" {
  type = string
}