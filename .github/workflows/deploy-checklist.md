# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Documentation updated

### Accessibility
- [ ] Screen reader tested
- [ ] Keyboard navigation works
- [ ] Touch targets ≥44x44px
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Works in Hindi and English

### Performance
- [ ] Images optimized and compressed
- [ ] Bundle size checked
- [ ] API response times tested
- [ ] Mobile performance verified

### Security
- [ ] No hardcoded credentials
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Input validation implemented

## Deployment

### Frontend
- [ ] Build completes successfully
- [ ] S3 bucket accessible
- [ ] CloudFront distribution active
- [ ] Cache invalidation triggered

### Backend
- [ ] Lambda functions packaged
- [ ] Dependencies included
- [ ] Environment variables set
- [ ] IAM roles configured

## Post-Deployment

### Verification
- [ ] Homepage loads correctly
- [ ] All features accessible
- [ ] API endpoints responding
- [ ] CloudFront serving content

### Testing
- [ ] Vision assistance works
- [ ] Communication features work
- [ ] Healthcare features work
- [ ] Emergency alert works
- [ ] Multi-language switching works

### Monitoring
- [ ] CloudWatch logs checked
- [ ] No error spikes
- [ ] Response times normal
- [ ] Cost tracking enabled

## Rollback Plan

If deployment fails:
1. Revert CloudFront to previous version
2. Restore previous S3 content
3. Rollback Lambda functions
4. Notify team

## Sign-off

- [ ] Deployment completed by: ___________
- [ ] Verified by: ___________
- [ ] Date: ___________
