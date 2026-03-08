#!/bin/bash

# Currency Detector Lambda Deployment Script
# Deploys currency detection Lambda function with Rekognition integration

set -e

echo "🚀 Deploying Currency Detector Lambda Function..."

# Configuration
FUNCTION_NAME="sakshamai-currency-detector"
REGION="ap-south-1"
RUNTIME="python3.11"
HANDLER="lambda_function.lambda_handler"
ROLE_NAME="sakshamai-lambda-role"

# Create deployment package
echo "📦 Creating deployment package..."
cd "$(dirname "$0")"
pip install -r requirements.txt -t .
zip -r function.zip . -x "*.sh" "*.md" "deploy.sh"

# Check if Lambda function exists
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>/dev/null; then
  echo "♻️  Updating existing Lambda function..."
  aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://function.zip \
    --region $REGION
else
  echo "✨ Creating new Lambda function..."
  
  # Get or create IAM role
  ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null || echo "")
  
  if [ -z "$ROLE_ARN" ]; then
    echo "Creating IAM role..."
    aws iam create-role \
      --role-name $ROLE_NAME \
      --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
          "Effect": "Allow",
          "Principal": {"Service": "lambda.amazonaws.com"},
          "Action": "sts:AssumeRole"
        }]
      }' \
      --region $REGION
    
    # Attach policies
    aws iam attach-role-policy \
      --role-name $ROLE_NAME \
      --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    aws iam attach-role-policy \
      --role-name $ROLE_NAME \
      --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionReadOnlyAccess
    
    # Wait for role to be ready
    echo "Waiting for IAM role to be ready..."
    sleep 10
    
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
  fi
  
  # Create Lambda function
  aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime $RUNTIME \
    --role $ROLE_ARN \
    --handler $HANDLER \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 \
    --region $REGION
fi

# Update function configuration
echo "⚙️  Updating function configuration..."
aws lambda update-function-configuration \
  --function-name $FUNCTION_NAME \
  --timeout 30 \
  --memory-size 256 \
  --region $REGION

echo "✅ Deployment complete!"
echo "Function ARN: $(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)"

# Cleanup
rm -f function.zip

echo ""
echo "📝 Next steps:"
echo "1. Create API Gateway endpoint: POST /detect-currency"
echo "2. Integrate with Lambda function: $FUNCTION_NAME"
echo "3. Update frontend API_ENDPOINT environment variable"
