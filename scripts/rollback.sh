#!/bin/bash

# 🔄 SAFE ROLLBACK SCRIPT
# Berdasarkan analisa CURSOR-CHAT-GUIDE.md
# Usage: ./scripts/rollback.sh [commit-hash|branch-name]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TARGET="${1}"

echo -e "${RED}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                          ║${NC}"
echo -e "${RED}║        🔄 SAFE ROLLBACK PROCEDURE 🔄                    ║${NC}"
echo -e "${RED}║                                                          ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if target is provided
if [ -z "$TARGET" ]; then
    echo -e "${YELLOW}📋 Available backup branches:${NC}"
    git branch --list | grep "backup-" | head -10
    echo ""
    echo -e "${YELLOW}📋 Recent commits:${NC}"
    git log --oneline -10
    echo ""
    read -p "Enter commit hash or branch name to rollback to: " TARGET
fi

# Verify target exists
if ! git rev-parse --verify "$TARGET" &> /dev/null; then
    echo -e "${RED}❌ ERROR: Target '$TARGET' not found${NC}"
    exit 1
fi

# Show current state
CURRENT_COMMIT=$(git rev-parse HEAD)
TARGET_COMMIT=$(git rev-parse "$TARGET")

echo -e "${BLUE}Current commit: $CURRENT_COMMIT${NC}"
echo -e "${BLUE}Target commit:  $TARGET_COMMIT${NC}"
echo ""

# Show what will change
echo -e "${YELLOW}📊 Changes that will be rolled back:${NC}"
git diff --stat "$TARGET"..HEAD
echo ""

# Create backup before rollback
BACKUP_BRANCH="backup-before-rollback-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✅ Backup created: $BACKUP_BRANCH${NC}"
echo ""

# Confirm rollback
read -p "⚠️  Are you sure you want to rollback? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Rollback cancelled${NC}"
    exit 0
fi

# Perform rollback
echo -e "${YELLOW}🔄 Rolling back...${NC}"
git reset --hard "$TARGET"

# Rebuild assets
echo -e "${YELLOW}🔨 Rebuilding assets...${NC}"
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json

# Stage and commit
git add -f public/build/
git commit -m "🔄 ROLLBACK: Rebuild assets after rollback to $TARGET" || true

echo ""
echo -e "${GREEN}✅ Rollback completed${NC}"
echo ""
echo -e "${YELLOW}🔍 Next Steps:${NC}"
echo -e "   1. Test locally: php artisan serve"
echo -e "   2. If OK, push: git push origin main --force"
echo -e "   3. Monitor: railway logs"
echo ""
