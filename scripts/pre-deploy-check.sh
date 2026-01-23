#!/bin/bash

# ✅ PRE-DEPLOYMENT CHECK SCRIPT
# Validates all requirements before deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║        ✅ PRE-DEPLOYMENT CHECKLIST ✅                   ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check 1: Git Status
echo -e "${YELLOW}[1/10] Checking Git Status...${NC}"
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    echo -e "${RED}   ❌ Not on main branch${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✅ On main branch${NC}"
fi

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}   ❌ Uncommitted changes detected${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✅ No uncommitted changes${NC}"
fi
echo ""

# Check 2: Node.js & npm
echo -e "${YELLOW}[2/10] Checking Node.js & npm...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}   ❌ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}   ✅ Node.js: $NODE_VERSION${NC}"
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}   ❌ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}   ✅ npm: $NPM_VERSION${NC}"
fi
echo ""

# Check 3: Dependencies
echo -e "${YELLOW}[3/10] Checking Dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}   ❌ node_modules not found. Run: npm install${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✅ Dependencies installed${NC}"
fi
echo ""

# Check 4: Build Assets
echo -e "${YELLOW}[4/10] Checking Build Assets...${NC}"
if [ ! -d "public/build" ]; then
    echo -e "${YELLOW}   ⚠️  Build directory not found. Will be created during build${NC}"
else
    echo -e "${GREEN}   ✅ Build directory exists${NC}"
fi
echo ""

# Check 5: Manifest File
echo -e "${YELLOW}[5/10] Checking Manifest File...${NC}"
if [ -f "public/build/.vite/manifest.json" ]; then
    echo -e "${GREEN}   ✅ Vite manifest exists${NC}"
else
    echo -e "${YELLOW}   ⚠️  Manifest will be created during build${NC}"
fi
echo ""

# Check 6: Railway CLI
echo -e "${YELLOW}[6/10] Checking Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}   ❌ Railway CLI not found. Install: npm i -g @railway/cli${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✅ Railway CLI installed${NC}"
fi
echo ""

# Check 7: Railway Connection
echo -e "${YELLOW}[7/10] Checking Railway Connection...${NC}"
if railway status &> /dev/null; then
    echo -e "${GREEN}   ✅ Railway connection OK${NC}"
else
    echo -e "${YELLOW}   ⚠️  Railway not connected. Run: railway login${NC}"
fi
echo ""

# Check 8: Environment Variables (Local)
echo -e "${YELLOW}[8/10] Checking Local Environment...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}   ✅ .env file exists${NC}"
    
    # Check critical vars
    if grep -q "FILESYSTEM_DISK=r2" .env; then
        echo -e "${GREEN}   ✅ FILESYSTEM_DISK configured${NC}"
    else
        echo -e "${YELLOW}   ⚠️  FILESYSTEM_DISK not set to r2${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  .env file not found (OK for production)${NC}"
fi
echo ""

# Check 9: PHP & Composer
echo -e "${YELLOW}[9/10] Checking PHP & Composer...${NC}"
if ! command -v php &> /dev/null; then
    echo -e "${RED}   ❌ PHP not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    PHP_VERSION=$(php --version | head -1)
    echo -e "${GREEN}   ✅ PHP: $PHP_VERSION${NC}"
fi

if ! command -v composer &> /dev/null; then
    echo -e "${YELLOW}   ⚠️  Composer not found (OK if not needed)${NC}"
else
    echo -e "${GREEN}   ✅ Composer installed${NC}"
fi
echo ""

# Check 10: Git Remote
echo -e "${YELLOW}[10/10] Checking Git Remote...${NC}"
if git remote get-url origin &> /dev/null; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}   ✅ Remote configured: $REMOTE_URL${NC}"
else
    echo -e "${RED}   ❌ No git remote configured${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s). Please fix before deploying.${NC}"
    exit 1
fi
