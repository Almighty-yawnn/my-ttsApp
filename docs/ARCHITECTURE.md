# Voiceify Architecture Documentation

## System Overview

Voiceify implements a serverless architecture using AWS managed services for scalable text-to-speech conversion.

## Architecture Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│ API Gateway  │───▶│   Lambda    │───▶│   Polly     │    │     S3      │
│   (S3)      │    │              │    │  Function   │    │             │    │   Audio     │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘    │   Storage   │
                                              │                               │             │
                                              └───────────────────────────────▶│             │
                                                                              └─────────────┘
```

## Component Details

### Frontend (S3 Static Website)
- **Purpose**: User interface for text input and audio playback
- **Technology**: HTML5, CSS3, Vanilla JavaScript
- **Hosting**: S3 bucket with static website configuration
- **Features**: Responsive design, real-time feedback, audio controls

### API Gateway
- **Purpose**: RESTful API endpoint for frontend-backend communication
- **Configuration**: POST /convert endpoint with CORS enabled
- **Integration**: AWS_PROXY integration with Lambda function
- **Security**: Public endpoint with request validation

### Lambda Function
- **Purpose**: Process text-to-speech requests
- **Runtime**: Python 3.9
- **Triggers**: API Gateway POST requests
- **Processing Flow**:
  1. Parse request payload (text, voice)
  2. Call Amazon Polly for speech synthesis
  3. Store audio file in S3
  4. Generate pre-signed URL
  5. Return response to frontend

### Amazon Polly
- **Purpose**: AI-powered text-to-speech synthesis
- **Engine**: Neural engine for natural speech
- **Voices**: Multiple options (Joanna, Matthew, Amy, etc.)
- **Output**: MP3 format audio files

### S3 Storage
- **Audio Bucket**: Stores generated MP3 files
- **Frontend Bucket**: Hosts static website files
- **Security**: Pre-signed URLs for temporary audio access
- **Lifecycle**: Audio files can be configured for automatic cleanup

### IAM Security
- **Lambda Role**: Minimal permissions for Polly and S3 access
- **Policies**: AmazonPollyFullAccess, AmazonS3FullAccess
- **Principle**: Least privilege access control

## Data Flow

1. User enters text and selects voice in frontend
2. Frontend sends POST request to API Gateway
3. API Gateway triggers Lambda function
4. Lambda validates input and calls Polly
5. Polly generates audio and returns stream
6. Lambda uploads audio to S3 bucket
7. Lambda generates pre-signed URL for audio access
8. Response returns to frontend with audio URL
9. Frontend plays audio using HTML5 audio element

## Security Considerations

- **CORS**: Configured for cross-origin requests
- **IAM Roles**: Service-specific permissions only
- **Pre-signed URLs**: Temporary access with expiration
- **Input Validation**: Text length and content sanitization
- **No Credentials**: Environment variables for configuration

## Scalability Features

- **Auto-scaling**: Lambda scales automatically with demand
- **Stateless**: No server state management required
- **Concurrent**: Multiple requests processed simultaneously
- **Global**: Can be deployed in multiple AWS regions

## Cost Optimization

- **Pay-per-use**: No idle resource costs
- **Efficient Storage**: S3 lifecycle policies for cleanup
- **Minimal Compute**: Lambda execution time optimization
- **Caching**: Browser caching for static assets