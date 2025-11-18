#!/bin/bash

echo "🔗 Setting Railway service references..."
echo ""

# Try different formats
echo "Attempting format 1: Direct string..."
railway variables --set "DB_HOST=\${{MySQL.MYSQLHOST}}"

echo "Attempting format 2: Single quotes..."
railway variables --set 'DB_HOST=${{MySQL.MYSQLHOST}}'

echo "Attempting format 3: No quotes..."
railway variables --set DB_HOST=\${{MySQL.MYSQLHOST}}

echo ""
echo "Checking result..."
railway variables | grep "DB_HOST"
