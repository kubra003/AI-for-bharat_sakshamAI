# GitHub Cleanup Script - Remove Unwanted Files Before Push
# Run this script before pushing to GitHub

Write-Host "Starting GitHub cleanup..." -ForegroundColor Cyan

# Files to delete
$filesToDelete = @(
    # Temporary/redundant documentation
    "CLEANUP_SCRIPT.ps1",
    "GIT_SETUP.md",
    "KIRO_GITHUB_SETUP_GUIDE.md",
    "NEXT_STEPS.md",
    "PROJECT_SUMMARY.md",
    "PPT_AND_DIAGRAM_PROMPT.md",
    "TECHNICAL-DEEP-DIVE.md",
    "ENHANCEMENT-SUGGESTIONS.md",
    
    # Backend temporary files
    "backend/currency_detector/API_ENDPOINT.md",
    "backend/currency_detector/CLOUDSHELL_DEPLOY.md",
    "backend/currency_detector/TASK_3.2_SUMMARY.md",
    "backend/currency_detector/test-api-endpoint.sh",
    "backend/healthcare_bedrock/lambda.zip",
    "backend/prescription_reader/lambda.zip"
)

# Directories to delete (Python dependencies - should be in .gitignore)
$dirsToDelete = @(
    # Healthcare Bedrock dependencies
    "backend/healthcare_bedrock/__pycache__",
    "backend/healthcare_bedrock/botocore-1.34.162.dist-info",
    "backend/healthcare_bedrock/dateutil",
    "backend/healthcare_bedrock/jmespath",
    "backend/healthcare_bedrock/jmespath-1.1.0.dist-info",
    "backend/healthcare_bedrock/python_dateutil-2.9.0.post0.dist-info",
    "backend/healthcare_bedrock/s3transfer",
    "backend/healthcare_bedrock/s3transfer-0.9.0.dist-info",
    "backend/healthcare_bedrock/six-1.17.0.dist-info",
    "backend/healthcare_bedrock/urllib3",
    "backend/healthcare_bedrock/urllib3-2.6.3.dist-info",
    "backend/healthcare_bedrock/six.py",
    
    # Vision Orchestrator dependencies
    "backend/vision_orchestrator/__pycache__",
    "backend/vision_orchestrator/bin",
    "backend/vision_orchestrator/boto3",
    "backend/vision_orchestrator/boto3-1.42.59.dist-info",
    "backend/vision_orchestrator/botocore",
    "backend/vision_orchestrator/botocore-1.42.59.dist-info",
    "backend/vision_orchestrator/dateutil",
    "backend/vision_orchestrator/jmespath",
    "backend/vision_orchestrator/jmespath-1.1.0.dist-info",
    "backend/vision_orchestrator/python_dateutil-2.9.0.post0.dist-info",
    "backend/vision_orchestrator/s3transfer",
    "backend/vision_orchestrator/s3transfer-0.16.0.dist-info",
    "backend/vision_orchestrator/six-1.17.0.dist-info",
    "backend/vision_orchestrator/urllib3",
    "backend/vision_orchestrator/urllib3-2.6.3.dist-info",
    "backend/vision_orchestrator/six.py"
)

# Delete files
Write-Host "`nDeleting unwanted files..." -ForegroundColor Yellow
$deletedFiles = 0
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Deleted: $file" -ForegroundColor Green
        $deletedFiles++
    }
}

# Delete directories
Write-Host "`nDeleting Python dependency directories..." -ForegroundColor Yellow
$deletedDirs = 0
foreach ($dir in $dirsToDelete) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "  ✓ Deleted: $dir" -ForegroundColor Green
        $deletedDirs++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "  Files deleted: $deletedFiles" -ForegroundColor White
Write-Host "  Directories deleted: $deletedDirs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nFiles ready for GitHub push!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Review .gitignore to ensure Python dependencies are excluded" -ForegroundColor White
Write-Host "  2. Run: git add ." -ForegroundColor White
Write-Host "  3. Run: git commit -m 'Initial commit - SakshamAI Rural'" -ForegroundColor White
Write-Host "  4. Run: git push origin main" -ForegroundColor White
