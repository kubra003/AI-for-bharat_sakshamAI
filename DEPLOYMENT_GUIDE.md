# SakshamAI Rural - Complete Deployment Guide

## Overview
This guide will help you deploy the complete SakshamAI Rural application on AWS, including frontend, backend Lambda functions, and all necessary AWS services.

## Prerequisites

1. **AWS Account** with $100 credits activated
2. **AWS CLI** installed and configured
3. **Node.js** (v18 or higher) and npm installed
4. **Python** 3.11 installed
5. **Git** installed

## Architecture Summary

```
Frontend (React) → S3 + CloudFront
    ↓
API Gateway (REST + WebSocket)
    ↓
Lambda Functions (Python 3.11)
    ↓
AI Services (Rekognition, Textract, Polly, Transcribe, Bedrock)
    ↓
Storage (S3 + DynamoDB)
```

---

## Part 1: AWS Infrastructure Setup

### Step 1: Create S3 Buckets

```bash
# Frontend hosting bucket
aws s3 mb s3://sakshamai-rural-frontend --region ap-south-1

# Media storage bucket
aws s3 mb s3://sakshamai-rural-media --region ap-south-1

# Enable static website hosting for frontend
aws s3 website s3://sakshamai-rural-frontend \
  --index-document index.html \
  --error-document index.html
```

### Step 2: Create DynamoDB Tables

```bash
# Users table
aws dynamodb create-table \
  --table-name SakshamAI-Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Emergency Contacts table
aws dynamodb create-table \
  --table-name SakshamAI-EmergencyContacts \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=contactId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=contactId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Usage History table
aws dynamodb create-table \
  --table-name SakshamAI-UsageHistory \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

### Step 3: Create IAM Role for Lambda

Create a file `lambda-trust-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Create the role:
```bash
aws iam create-role \
  --role-name SakshamAI-Lambda-Role \
  --assume-role-policy-document file://lambda-trust-policy.json
```

Attach policies:
```bash
# Basic Lambda execution
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Rekognition access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionFullAccess

# Textract access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonTextractFullAccess

# Polly access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonPollyFullAccess

# Transcribe access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonTranscribeFullAccess

# S3 access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# DynamoDB access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# SNS access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess

# Bedrock access
aws iam attach-role-policy \
  --role-name SakshamAI-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

---

## Part 2: Backend Lambda Functions

### Lambda Function Structure

Create the following directory structure:
```
backend/
├── vision_orchestrator/
│   ├── lambda_function.py
│   └── requirements.txt
├── communication_handler/
│   ├── lambda_function.py
│   └── requirements.txt
├── healthcare_handler/
│   ├── lambda_function.py
│   └── requirements.txt
├── information_handler/
│   ├── lambda_function.py
│   └── requirements.txt
└── emergency_handler/
    ├── lambda_function.py
    └── requirements.txt
```

### Vision Orchestrator Lambda

Create `backend/vision_orchestrator/lambda_function.py`:
```python
import json
import boto3
import base64
from datetime import datetime

rekognition = boto3.client('rekognition', region_name='ap-south-1')
textract = boto3.client('textract', region_name='ap-south-1')
polly = boto3.client('polly', region_name='ap-south-1')
s3 = boto3.client('s3', region_name='ap-south-1')

BUCKET_NAME = 'sakshamai-rural-media'

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        image_base64 = body['image']
        language = body.get('language', 'en')
        mode = body.get('mode', 'object')  # 'object' or 'text'
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_base64.split(',')[1])
        
        # Upload to S3
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        s3_key = f"uploads/{timestamp}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=s3_key, Body=image_bytes)
        
        if mode == 'object':
            result = detect_objects(image_bytes, language)
        else:
            result = extract_text(image_bytes, language)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

def detect_objects(image_bytes, language):
    # Call Rekognition
    response = rekognition.detect_labels(
        Image={'Bytes': image_bytes},
        MaxLabels=10,
        MinConfidence=70
    )
    
    objects = []
    for label in response['Labels']:
        objects.append({
            'name': label['Name'],
            'confidence': label['Confidence']
        })
    
    # Create description
    if language == 'hi':
        description = create_hindi_description(objects)
    else:
        description = create_english_description(objects)
    
    # Convert to speech
    audio_url = text_to_speech(description, language)
    
    return {
        'objects': objects,
        'description': description,
        'audioUrl': audio_url
    }

def extract_text(image_bytes, language):
    # Call Textract
    response = textract.detect_document_text(
        Document={'Bytes': image_bytes}
    )
    
    # Extract text
    text_lines = []
    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            text_lines.append(item['Text'])
    
    extracted_text = '\n'.join(text_lines)
    
    # Create description
    if language == 'hi':
        description = f"पाठ मिला: {extracted_text}"
    else:
        description = f"Text found: {extracted_text}"
    
    # Convert to speech
    audio_url = text_to_speech(description, language)
    
    return {
        'text': extracted_text,
        'description': description,
        'audioUrl': audio_url
    }

def create_english_description(objects):
    if not objects:
        return "No objects detected"
    
    obj_names = [obj['name'] for obj in objects[:3]]
    return f"I can see {', '.join(obj_names)}"

def create_hindi_description(objects):
    if not objects:
        return "कोई वस्तु नहीं मिली"
    
    obj_names = [obj['name'] for obj in objects[:3]]
    return f"मुझे दिख रहा है {', '.join(obj_names)}"

def text_to_speech(text, language):
    voice_id = 'Aditi' if language == 'hi' else 'Joanna'
    
    response = polly.synthesize_speech(
        Text=text,
        OutputFormat='mp3',
        VoiceId=voice_id,
        Engine='neural'
    )
    
    # Save audio to S3
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    audio_key = f"audio/{timestamp}.mp3"
    
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=audio_key,
        Body=response['AudioStream'].read(),
        ContentType='audio/mpeg'
    )
    
    # Generate presigned URL
    audio_url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': BUCKET_NAME, 'Key': audio_key},
        ExpiresIn=3600
    )
    
    return audio_url
```

Create `backend/vision_orchestrator/requirements.txt`:
```
boto3==1.34.0
```

### Deploy Lambda Function

```bash
cd backend/vision_orchestrator

# Install dependencies
pip install -r requirements.txt -t .

# Create deployment package
zip -r function.zip .

# Create Lambda function
aws lambda create-function \
  --function-name SakshamAI-VisionOrchestrator \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/SakshamAI-Lambda-Role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --region ap-south-1
```

---

## Part 3: API Gateway Setup

### Create REST API

```bash
# Create API
aws apigateway create-rest-api \
  --name SakshamAI-API \
  --description "SakshamAI Rural API" \
  --region ap-south-1
```

### Create Resources and Methods

Use AWS Console or CLI to create:
- `/vision/detect-objects` (POST)
- `/vision/extract-text` (POST)
- `/communication/text-to-speech` (POST)
- `/healthcare/simplify-report` (POST)
- `/information/ask` (POST)
- `/emergency/alert` (POST)

Enable CORS for all endpoints.

---

## Part 4: Frontend Deployment

### Build Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set API URL
echo "REACT_APP_API_URL=https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/prod" > .env

# Build
npm run build
```

### Deploy to S3

```bash
# Upload build files
aws s3 sync build/ s3://sakshamai-rural-frontend --delete

# Make bucket public
aws s3api put-bucket-policy \
  --bucket sakshamai-rural-frontend \
  --policy file://bucket-policy.json
```

Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sakshamai-rural-frontend/*"
    }
  ]
}
```

### Set up CloudFront (Optional but Recommended)

```bash
aws cloudfront create-distribution \
  --origin-domain-name sakshamai-rural-frontend.s3-website.ap-south-1.amazonaws.com \
  --default-root-object index.html
```

---

## Part 5: Testing

### Test Vision API

```bash
curl -X POST https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/prod/vision/detect-objects \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,YOUR_BASE64_IMAGE",
    "language": "en"
  }'
```

### Access Frontend

Visit: `http://sakshamai-rural-frontend.s3-website.ap-south-1.amazonaws.com`

Or CloudFront URL if configured.

---

## Part 6: Monitoring & Cost Tracking

### Set up CloudWatch Dashboard

```bash
aws cloudwatch put-dashboard \
  --dashboard-name SakshamAI-Dashboard \
  --dashboard-body file://dashboard.json
```

### Set up Budget Alerts

```bash
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

---

## Estimated Costs (First Month)

- Lambda: $0.50
- Rekognition: $5.00 (500 images)
- Textract: $2.00 (200 documents)
- Polly: $0.20 (100 requests)
- Bedrock: $10.00 (usage-based)
- S3: $0.50
- DynamoDB: $0.30
- API Gateway: $0.50
- **Total: ~$19.00** (well within $100 budget)

---

## Next Steps

1. Enable Amazon Bedrock models (Claude 3 Haiku, Claude 3.5 Sonnet)
2. Implement remaining Lambda functions
3. Add authentication (Amazon Cognito)
4. Set up CI/CD pipeline
5. Conduct user testing
6. Optimize costs

---

## Support

For issues or questions:
- Check CloudWatch Logs
- Review API Gateway execution logs
- Test Lambda functions individually

## Security Checklist

- [ ] Enable encryption for S3 buckets
- [ ] Enable encryption for DynamoDB tables
- [ ] Set up WAF for API Gateway
- [ ] Implement rate limiting
- [ ] Add authentication
- [ ] Review IAM policies (least privilege)
- [ ] Enable CloudTrail logging
- [ ] Set up backup policies

---

**Congratulations!** Your SakshamAI Rural application is now deployed on AWS!
