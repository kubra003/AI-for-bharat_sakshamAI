# GitHub CI/CD Setup Guide

## Overview

This guide will help you set up automated CI/CD pipelines for the SakshamAI Rural project using GitHub Actions.

## Prerequisites

1. GitHub repository created
2. AWS account with deployed infrastructure
3. AWS credentials (Access Key ID and Secret Access Key)

## Step 1: Clean Up Temporary Files

Run the cleanup script to remove all temporary deployment files:

```powershell
.\cleanup-temp-files.ps1
```

This will delete all temporary deployment scripts and documentation files, keeping only:
- Source code (frontend/, backend/)
- Essential documentation (README.md, DEPLOYMENT_GUIDE.md, etc.)
- Specifications (.kiro/specs/)
- Architecture diagrams (generated-diagrams/)

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET_NAME` | S3 bucket for frontend | `sakshamai-1772884933` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E6489VB3OH0SS` |

### How to Get AWS Credentials

1. Go to AWS Console → IAM → Users
2. Select your user or create a new deployment user
3. Go to "Security credentials" tab
4. Click "Create access key"
5. Choose "Application running outside AWS"
6. Copy the Access Key ID and Secret Access Key

### Required IAM Permissions

The AWS user needs these permissions:
- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` (for S3 deployment)
- `cloudfront:CreateInvalidation` (for cache invalidation)
- `lambda:UpdateFunctionCode` (for Lambda deployment)

## Step 3: GitHub Workflows

Three workflows are configured:

### 1. Frontend CI (`frontend-ci.yml`)
**Triggers**: Push or PR to main/develop with frontend changes

**Jobs**:
- Run tests with coverage
- Build React application
- Upload build artifacts

### 2. Backend CI (`backend-ci.yml`)
**Triggers**: Push or PR to main/develop with backend changes

**Jobs**:
- Lint Python code
- Run tests (if available)
- Package Lambda functions
- Upload Lambda packages

### 3. Deploy to AWS (`deploy-aws.yml`)
**Triggers**: 
- Push to main branch
- Manual workflow dispatch

**Jobs**:
- Build and deploy frontend to S3
- Invalidate CloudFront cache
- Package and deploy Lambda functions

## Step 4: Initialize Git Repository

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SakshamAI Rural platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/sakshamai-rural.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Verify Workflows

1. Go to your GitHub repository
2. Click on "Actions" tab
3. You should see the workflows running
4. Check the logs to ensure everything passes

## Step 6: Manual Deployment

To manually trigger deployment:

1. Go to Actions tab
2. Select "Deploy to AWS" workflow
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow" button

## Workflow Behavior

### On Pull Request
- Runs tests and builds
- Does NOT deploy to AWS
- Provides feedback on code quality

### On Push to main
- Runs tests and builds
- Automatically deploys to AWS
- Invalidates CloudFront cache

### On Push to develop
- Runs tests and builds
- Does NOT deploy to AWS

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check for syntax errors in code

### Deployment Fails
- Verify AWS credentials are correct
- Check IAM permissions
- Ensure S3 bucket and CloudFront distribution exist
- Verify Lambda function names match

### Tests Fail
- Run tests locally first: `cd frontend && npm test`
- Check test files for errors
- Ensure all mocks are properly configured

## Cost Considerations

GitHub Actions provides:
- 2,000 minutes/month for free (public repos)
- 500 MB storage for artifacts

Each deployment uses approximately:
- Frontend: ~5 minutes
- Backend: ~3 minutes per Lambda function
- Total: ~20 minutes per full deployment

## Security Best Practices

1. Never commit AWS credentials to code
2. Use GitHub Secrets for sensitive data
3. Rotate AWS access keys regularly
4. Use least-privilege IAM policies
5. Enable branch protection rules

## Next Steps

1. Run cleanup script
2. Configure GitHub secrets
3. Push code to GitHub
4. Verify workflows run successfully
5. Test automatic deployment

## Files to Keep

Essential files that should NOT be deleted:
- `README.md` - Project documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `COMPLETE_SETUP_GUIDE.md` - Setup guide
- `AWS-ARCHITECTURE-SHOWCASE.md` - Architecture documentation
- `AWS-SUBMISSION-CRITERIA.md` - Submission criteria
- `TECHNICAL-DEEP-DIVE.md` - Technical details
- `ENHANCEMENT-SUGGESTIONS.md` - Future improvements
- `GET_AWS_CREDENTIALS.md` - Credential setup guide
- `QUICK_START.md` - Quick start guide

## Support

For issues with CI/CD:
1. Check GitHub Actions logs
2. Review AWS CloudWatch logs
3. Verify all secrets are configured
4. Test deployment scripts locally first
