# Voiceify Deployment Guide

## Prerequisites

- AWS Account with programmatic access
- Terraform v1.0+ installed
- AWS CLI configured
- Python 3.9+ (for Lambda development)

## Quick Deployment

### 1. Prepare Lambda Package
```bash
cd lambda
zip lambda_function.zip lambda_function.py
mv lambda_function.zip ../terraform/
```

### 2. Configure Variables
Create `terraform/terraform.tfvars`:
```hcl
access_key = "your-aws-access-key"
secret_key = "your-aws-secret-key"
aws-region = "us-east-1"
s3-bucket-name = "voiceify-audio-unique-name"
frontend_bucket_name = "voiceify-frontend-unique-name"
```

### 3. Deploy Infrastructure
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. Update Frontend Config
Copy API Gateway URL from Terraform output to `frontend/config.js`:
```javascript
const API_URL = "https://your-api-id.execute-api.region.amazonaws.com/prod/convert";
```

### 5. Deploy Frontend
```bash
aws s3 sync frontend/ s3://your-frontend-bucket-name/
```

## Testing

Test API endpoint:
```bash
curl -X POST https://your-api-endpoint/convert \
  -H "Content-Type: application/json" \
  -d '{"text": "Welcome to Azubi Africa", "voice": "Matthew"}'
```

Access frontend at the S3 website endpoint provided in Terraform outputs.

## Cleanup

```bash
cd terraform
terraform destroy
```