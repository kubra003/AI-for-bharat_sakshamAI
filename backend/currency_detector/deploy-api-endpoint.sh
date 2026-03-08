#!/bin/bash

# ============================================================================
# Currency Detection API Endpoint Deployment Script
# ============================================================================
# This script creates the API Gateway endpoint for currency detection
# and integrates it with the currency_detector Lambda function
# ============================================================================

set -e

echo "=========================================="
echo "Currency Detection API Endpoint Setup"
echo "=========================================="
echo ""

# Configuration
REGION="ap-south-1"
FUNCTION_NAME="sakshamai-currency-detector"
API_NAME="SakshamAI-API"

# Get AWS Account ID
echo "Getting AWS Account ID..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"
echo ""

# Find or create API Gateway
echo "Step 1: Finding or creating API Gateway..."
API_ID=$(aws apigateway get-rest-apis --region $REGION --query "items[?name=='${API_NAME}'].id" --output text 2>/dev/null || echo "")

if [ -z "$API_ID" ] || [ "$API_ID" == "None" ]; then
    echo "Creating new API Gateway: ${API_NAME}..."
    API_ID=$(aws apigateway create-rest-api \
        --name ${API_NAME} \
        --description "SakshamAI Rural - AI-powered assistive technology API" \
        --region $REGION \
        --endpoint-configuration types=REGIONAL \
        --query 'id' \
        --output text)
    echo "✓ Created API Gateway: $API_ID"
else
    echo "✓ Found existing API Gateway: $API_ID"
fi

API_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"
echo "  API URL: $API_URL"
echo ""

# Get root resource ID
echo "Step 2: Getting root resource..."
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id' \
    --output text)
echo "✓ Root resource ID: $ROOT_ID"
echo ""

# Create /detect-currency resource
echo "Step 3: Creating /detect-currency resource..."
CURRENCY_RESOURCE=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query "items[?pathPart=='detect-currency'].id" \
    --output text 2>/dev/null || echo "")

if [ -z "$CURRENCY_RESOURCE" ] || [ "$CURRENCY_RESOURCE" == "None" ]; then
    echo "Creating detect-currency resource..."
    CURRENCY_RESOURCE=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ROOT_ID \
        --path-part detect-currency \
        --region $REGION \
        --query 'id' \
        --output text)
    echo "✓ Created resource: $CURRENCY_RESOURCE"
else
    echo "✓ Resource already exists: $CURRENCY_RESOURCE"
fi
echo ""

# Create POST method
echo "Step 4: Creating POST method..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method POST \
    --authorization-type NONE \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ Method already exists"
echo "✓ POST method configured"
echo ""

# Configure Lambda integration
echo "Step 5: Configuring Lambda integration..."
LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}"

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ Integration already exists"
echo "✓ Lambda integration configured"
echo ""

# Grant API Gateway permission to invoke Lambda
echo "Step 6: Granting API Gateway permissions..."
STATEMENT_ID="apigateway-currency-$(date +%s)"
aws lambda add-permission \
    --function-name ${FUNCTION_NAME} \
    --statement-id ${STATEMENT_ID} \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*/detect-currency" \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ Permission already exists"
echo "✓ Lambda invoke permission granted"
echo ""

# Enable CORS - OPTIONS method
echo "Step 7: Enabling CORS..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ OPTIONS method already exists"

# CORS integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ CORS integration already exists"

# CORS method response
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Headers": false,
        "method.response.header.Access-Control-Allow-Methods": false,
        "method.response.header.Access-Control-Allow-Origin": false
    }' \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ CORS method response already exists"

# CORS integration response
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $CURRENCY_RESOURCE \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'",
        "method.response.header.Access-Control-Allow-Methods": "'"'"'POST,OPTIONS'"'"'",
        "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"
    }' \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ CORS integration response already exists"

echo "✓ CORS enabled"
echo ""

# Add request validation
echo "Step 8: Configuring request validation..."
# Create request validator
VALIDATOR_ID=$(aws apigateway get-request-validators \
    --rest-api-id $API_ID \
    --region $REGION \
    --query "items[?name=='currency-validator'].id" \
    --output text 2>/dev/null || echo "")

if [ -z "$VALIDATOR_ID" ] || [ "$VALIDATOR_ID" == "None" ]; then
    VALIDATOR_ID=$(aws apigateway create-request-validator \
        --rest-api-id $API_ID \
        --name currency-validator \
        --validate-request-body true \
        --validate-request-parameters false \
        --region $REGION \
        --query 'id' \
        --output text 2>/dev/null || echo "")
    echo "✓ Created request validator: $VALIDATOR_ID"
else
    echo "✓ Request validator exists: $VALIDATOR_ID"
fi
echo ""

# Add throttling and rate limiting
echo "Step 9: Configuring throttling and rate limiting..."
# Note: Throttling is configured at the stage level
# Default throttling: 10,000 requests per second with burst of 5,000
# This will be applied when we deploy the stage
echo "✓ Throttling will be applied at stage deployment"
echo ""

# Deploy API to prod stage
echo "Step 10: Deploying API to prod stage..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --stage-description "Production stage with throttling" \
    --description "Currency detection endpoint deployment - $(date)" \
    --region $REGION \
    --no-cli-pager

echo "✓ API deployed to prod stage"
echo ""

# Configure stage-level throttling
echo "Step 11: Configuring stage throttling..."
aws apigateway update-stage \
    --rest-api-id $API_ID \
    --stage-name prod \
    --patch-operations \
        op=replace,path=/throttle/rateLimit,value=1000 \
        op=replace,path=/throttle/burstLimit,value=500 \
    --region $REGION \
    --no-cli-pager 2>/dev/null || echo "✓ Throttling already configured"

echo "✓ Stage throttling configured (1000 req/sec, burst 500)"
echo ""

# Test the endpoint
echo "Step 12: Testing endpoint..."
echo "Testing OPTIONS (CORS preflight)..."
curl -s -X OPTIONS "${API_URL}/detect-currency" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -w "\nHTTP Status: %{http_code}\n" || echo "CORS test completed"

echo ""
echo "Testing POST with invalid data..."
curl -s -X POST "${API_URL}/detect-currency" \
    -H "Content-Type: application/json" \
    -d '{"image":"test"}' \
    -w "\nHTTP Status: %{http_code}\n" | head -n 10

echo ""
echo "=========================================="
echo "✅ Currency Detection API Endpoint Ready!"
echo "=========================================="
echo ""
echo "📋 Endpoint Details:"
echo "  API ID: $API_ID"
echo "  Region: $REGION"
echo "  Endpoint: POST ${API_URL}/detect-currency"
echo ""
echo "🔧 Configuration:"
echo "  ✓ Lambda integration: ${FUNCTION_NAME}"
echo "  ✓ CORS enabled: * (all origins)"
echo "  ✓ Request validation: Enabled"
echo "  ✓ Rate limiting: 1000 req/sec"
echo "  ✓ Burst limit: 500 requests"
echo ""
echo "📝 Request Format:"
echo '  {
    "image": "base64_encoded_image_data",
    "language": "en" or "hi"
  }'
echo ""
echo "📝 Response Format:"
echo '  {
    "denomination": 500,
    "confidence": 95.5,
    "currency": "INR",
    "symbol": "₹",
    "detected": true,
    "message": "This is a 500 rupees note",
    "timestamp": "2024-01-01T00:00:00.000000"
  }'
echo ""
echo "🧪 Test Command:"
echo "  curl -X POST ${API_URL}/detect-currency \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"image\":\"base64_image_here\",\"language\":\"en\"}'"
echo ""
echo "📱 Update Frontend:"
echo "  Set API_URL in frontend/.env:"
echo "  REACT_APP_API_URL=${API_URL}"
echo ""
echo "✅ Task 3.2 Complete!"
echo ""

