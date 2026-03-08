#!/bin/bash

# Deploy Text-to-Speech Lambda Function using Amazon Polly
# This script creates/updates the Lambda function and API Gateway endpoint

set -e

echo "=========================================="
echo "Deploying Text-to-Speech Lambda Function"
echo "=========================================="

# Configuration
FUNCTION_NAME="sakshamai-text-to-speech"
REGION="ap-south-1"
RUNTIME="python3.9"
HANDLER="lambda_function.lambda_handler"
ROLE_NAME="sakshamai-lambda-role"

# Create deployment package
echo "Creating deployment package..."
rm -f function.zip
zip -r function.zip lambda_function.py

# Check if Lambda function exists
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>/dev/null; then
    echo "Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://function.zip \
        --region $REGION
    
    echo "Updating function configuration..."
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --timeout 30 \
        --memory-size 256 \
        --region $REGION
else
    echo "Creating new Lambda function..."
    
    # Get IAM role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null || echo "")
    
    if [ -z "$ROLE_ARN" ]; then
        echo "Error: IAM role $ROLE_NAME not found. Please create it first."
        exit 1
    fi
    
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

# Add Polly permissions to Lambda role (if not already added)
echo "Ensuring Lambda has Polly permissions..."
POLICY_DOCUMENT='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "polly:SynthesizeSpeech",
                "polly:DescribeVoices"
            ],
            "Resource": "*"
        }
    ]
}'

aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name PollyAccess \
    --policy-document "$POLICY_DOCUMENT" \
    --region $REGION 2>/dev/null || echo "Policy already exists or error adding policy"

echo ""
echo "=========================================="
echo "Lambda function deployed successfully!"
echo "Function Name: $FUNCTION_NAME"
echo "Region: $REGION"
echo "=========================================="

# Clean up
rm -f function.zip

echo ""
echo "Next steps:"
echo "1. Create API Gateway endpoint for this function"
echo "2. Update frontend API URL with the new endpoint"
echo "3. Test the text-to-speech functionality"
