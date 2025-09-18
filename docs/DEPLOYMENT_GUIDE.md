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

### 6. Setup CloudFront CDN (Optional - AWS Console)

For improved performance and global content delivery:

#### 6.1 Create CloudFront Distribution
1. Navigate to **CloudFront** in AWS Management Console
2. Click **Create Distribution**
3. Configure Origin Settings:
   - **Origin Domain**: Select your S3 frontend bucket
   - **Origin Path**: Leave empty
   - **Origin Access**: Use OAC (Origin Access Control)
   - **Create OAC**: Create new OAC for your bucket

#### 6.2 Distribution Settings
- **Default Root Object**: `index.html`
- **Error Pages**: Add custom error response
  - HTTP Error Code: `403`
  - Response Page Path: `/index.html`
  - HTTP Response Code: `200`
- **Price Class**: Use all edge locations (or select based on your needs)

#### 6.3 Update S3 Bucket Policy
After CloudFront creation, update your S3 bucket policy to allow CloudFront access:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-frontend-bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::your-account-id:distribution/your-distribution-id"
        }
      }
    }
  ]
}
```

#### 6.4 Update Frontend Configuration
Update `frontend/config.js` to use CloudFront domain:
```javascript
// Use CloudFront domain for better performance
const CLOUDFRONT_DOMAIN = "https://your-distribution-id.cloudfront.net";
const API_URL = "https://your-api-id.execute-api.region.amazonaws.com/prod/convert";
```

#### 6.5 Deploy Updated Frontend
```bash
aws s3 sync frontend/ s3://your-frontend-bucket-name/
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Testing

Test API endpoint:
```bash
curl -X POST https://your-api-endpoint/convert \
  -H "Content-Type: application/json" \
  -d '{"text": "Welcome to Azubi Africa", "voice": "Matthew"}'
```

Access frontend:
- **S3 Direct**: S3 website endpoint from Terraform outputs
- **CloudFront**: `https://your-distribution-id.cloudfront.net`

## Performance Benefits with CloudFront

- **Global CDN**: Content served from edge locations worldwide
- **Faster Load Times**: Cached static assets closer to users
- **SSL/TLS**: Automatic HTTPS with AWS Certificate Manager
- **Compression**: Automatic gzip compression for text files
- **Custom Domain**: Use your own domain with Route 53

## Cleanup

```bash
# Remove CloudFront distribution first (if created)
# Then destroy Terraform resources
cd terraform
terraform destroy
```