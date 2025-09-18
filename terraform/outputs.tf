# outputs.tf

# S3 Bucket Outputs
output "text_narrator_bucket_name" {
  description = "Name of the S3 bucket for text narrator storage"
  value       = aws_s3_bucket.text-narrator.bucket
}

output "text_narrator_bucket_arn" {
  description = "ARN of the text narrator S3 bucket"
  value       = aws_s3_bucket.text-narrator.arn
}

output "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend hosting"
  value       = aws_s3_bucket.frontend_bucket.bucket
}

output "frontend_bucket_arn" {
  description = "ARN of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend_bucket.arn
}

output "frontend_website_endpoint" {
  description = "Endpoint URL for the frontend S3 static website"
  value       = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}

# Lambda Outputs
output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.text_narrator_lambda.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.text_narrator_lambda.arn
}

# IAM Role Outputs
output "lambda_iam_role_name" {
  description = "Name of the IAM role for Lambda"
  value       = aws_iam_role.lambda_role.name
}

output "lambda_iam_role_arn" {
  description = "ARN of the IAM role for Lambda"
  value       = aws_iam_role.lambda_role.arn
}

# API Gateway Outputs
output "api_gateway_id" {
  description = "ID of the API Gateway REST API"
  value       = aws_api_gateway_rest_api.text_narrator_api.id
}

output "api_gateway_endpoint" {
  description = "Full invoke URL for the API Gateway endpoint"
  value = "${aws_api_gateway_stage.text_narrator_stage.invoke_url}/${aws_api_gateway_resource.text_narrator_resource.path_part}"
}

# AWS Region Output
output "aws_region" {
  description = "AWS region used for deployment"
  value       = var.aws-region
}
