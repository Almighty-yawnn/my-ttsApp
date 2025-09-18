# Set up the AWS Provider
provider "aws" {
  region     = var.aws-region
  access_key = var.access_key
  secret_key = var.secret_key
}

# Fetch the identity of whoever is running Terraform
data "aws_caller_identity" "current" {}