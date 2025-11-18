#!/bin/bash

echo "🔗 Updating Railway variables dengan service references..."
echo ""

# Railway service references menggunakan format khusus
# Untuk membuat panah koneksi muncul, kita perlu menggunakan format: ${{ServiceName.VARIABLE}}

SERVICE_NAME="MySQL"

echo "📝 Updating DB variables dengan service references dari $SERVICE_NAME..."
echo ""

# Update dengan format service reference
railway variables --set "DB_HOST=\${{${SERVICE_NAME}.MYSQLHOST}}"
railway variables --set "DB_PORT=\${{${SERVICE_NAME}.MYSQLPORT}}"
railway variables --set "DB_USERNAME=\${{${SERVICE_NAME}.MYSQLUSER}}"
railway variables --set "DB_PASSWORD=\${{${SERVICE_NAME}.MYSQLPASSWORD}}"
railway variables --set "DB_DATABASE=\${{${SERVICE_NAME}.MYSQLDATABASE}}"

echo ""
echo "✅ Variables updated!"
echo ""
echo "📋 Verifying..."
railway variables | grep -E "DB_HOST|DB_PORT|DB_USERNAME|DB_PASSWORD|DB_DATABASE"

echo ""
echo "🔍 Refresh Railway Dashboard → Architecture view untuk melihat panah koneksi"
