#!/bin/bash

# 🛡️ SAFE DEPLOYMENT SCRIPT
# Berdasarkan analisa CURSOR-CHAT-GUIDE.md dan best practices
# Usage: ./scripts/safe-deploy.sh [commit-message]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMMIT_MESSAGE="${1:-🔧 BUILD: Safe deployment}"
BACKUP_BRANCH="backup-pre-deploy-$(date +%Y%m%d-%H%M%S)"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse HEAD)

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║        🛡️  SAFE DEPLOYMENT PROCEDURE 🛡️                ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Pre-deployment Checks
echo -e "${YELLOW}📋 STEP 1: Pre-deployment Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ ERROR: Not on main branch. Current branch: $CURRENT_BRANCH${NC}"
    echo -e "${YELLOW}⚠️  Switch to main branch first: git checkout main${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ ERROR: You have uncommitted changes${NC}"
    echo -e "${YELLOW}⚠️  Please commit or stash your changes first${NC}"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ ERROR: Railway CLI not found${NC}"
    echo -e "${YELLOW}⚠️  Install Railway CLI: npm i -g @railway/cli${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo ""

# Step 2: Create Backup Branch
echo -e "${YELLOW}💾 STEP 2: Creating Backup Branch${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✅ Backup branch created: $BACKUP_BRANCH${NC}"
echo -e "${BLUE}   To restore: git reset --hard $BACKUP_BRANCH${NC}"
echo ""

# Step 3: Build Assets
echo -e "${YELLOW}🔨 STEP 3: Building Assets${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! npm run build; then
    echo -e "${RED}❌ ERROR: Build failed${NC}"
    echo -e "${YELLOW}⚠️  Fix build errors before deploying${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Assets built successfully${NC}"
echo ""

# Step 4: Copy Manifest (CRITICAL)
echo -e "${YELLOW}📄 STEP 4: Copying Manifest (CRITICAL)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f "public/build/.vite/manifest.json" ]; then
    echo -e "${RED}❌ ERROR: Manifest file not found at public/build/.vite/manifest.json${NC}"
    exit 1
fi

cp public/build/.vite/manifest.json public/build/manifest.json
echo -e "${GREEN}✅ Manifest copied successfully${NC}"
echo ""

# Step 5: Verify Build Files
echo -e "${YELLOW}🔍 STEP 5: Verifying Build Files${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f "public/build/manifest.json" ]; then
    echo -e "${RED}❌ ERROR: Manifest file missing${NC}"
    exit 1
fi

if [ ! -d "public/build/assets" ]; then
    echo -e "${RED}❌ ERROR: Assets directory missing${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build files verified${NC}"
echo ""

# Step 6: Local Testing (Optional but Recommended)
echo -e "${YELLOW}🧪 STEP 6: Local Testing Recommendation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}💡 Recommended: Test locally before deploying${NC}"
echo -e "${BLUE}   Run: php artisan serve${NC}"
echo -e "${BLUE}   Then test in browser: http://localhost:8000${NC}"
echo ""
read -p "Continue with deployment? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Deployment cancelled by user${NC}"
    exit 0
fi
echo ""

# Step 7: Stage Changes
echo -e "${YELLOW}📦 STEP 7: Staging Changes${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git add -f public/build/
git status --short
echo ""

# Step 8: Commit Changes
echo -e "${YELLOW}💬 STEP 8: Committing Changes${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git commit -m "$COMMIT_MESSAGE" || {
    echo -e "${YELLOW}⚠️  No changes to commit (build files unchanged)${NC}"
}
echo ""

# Step 9: Pre-push Verification
echo -e "${YELLOW}✅ STEP 9: Pre-push Verification${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Railway connection
if ! railway status &> /dev/null; then
    echo -e "${RED}❌ ERROR: Cannot connect to Railway${NC}"
    echo -e "${YELLOW}⚠️  Run: railway login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Railway connection verified${NC}"
echo ""

# Step 10: Push to Railway
echo -e "${YELLOW}🚀 STEP 10: Pushing to Railway${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "${BLUE}Current commit: $CURRENT_COMMIT${NC}"
echo -e "${BLUE}Backup branch: $BACKUP_BRANCH${NC}"
echo ""

read -p "Push to Railway? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Push cancelled by user${NC}"
    echo -e "${BLUE}💡 You can push manually later: git push origin main${NC}"
    exit 0
fi

git push origin main

echo ""
echo -e "${GREEN}✅ Push completed successfully${NC}"
echo ""

# Step 11: Post-deployment Monitoring
echo -e "${YELLOW}📊 STEP 11: Post-deployment Monitoring${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "${BLUE}⏳ Waiting 10 seconds for deployment to start...${NC}"
sleep 10

echo -e "${BLUE}📋 Checking Railway deployment status...${NC}"
railway status

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║        ✅ DEPLOYMENT INITIATED SUCCESSFULLY ✅           ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Deployment Summary:${NC}"
echo -e "   Commit: $CURRENT_COMMIT"
echo -e "   Backup: $BACKUP_BRANCH"
echo -e "   Message: $COMMIT_MESSAGE"
echo ""
echo -e "${YELLOW}🔍 Next Steps:${NC}"
echo -e "   1. Monitor deployment: railway logs"
echo -e "   2. Test website: https://cahayaanbiya.com"
echo -e "   3. Check in incognito mode"
echo -e "   4. If issues occur, rollback: git reset --hard $BACKUP_BRANCH"
echo ""
