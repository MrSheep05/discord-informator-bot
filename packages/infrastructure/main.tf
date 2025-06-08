module "random" {
  source = "./modules/random"
}

module "s3" {
  source      = "./modules/s3"
  random_name = module.random.random_name
}

module "sqs" {
  source = "./modules/sqs"
}

module "lambdas" {
  source              = "./modules/lambdas"
  random_name         = module.random.random_name
  lambdas_bucket_name = module.s3.lambda_bucket_name
  perplexity_token    = var.perplexity_token
  discord_token       = var.discord_token
  discord_public_key  = var.discord_public_key
  sqs_url             = module.sqs.researcher_queue_url
}

module "policies" {
  source             = "./modules/policies"
  lambda_functions   = module.lambdas.lambda_functions
  researcher_sqs_arn = module.sqs.researcher_queue_arn
  random_name        = module.random.random_name
}