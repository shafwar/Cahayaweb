#!/bin/bash

# Script untuk update Railway variables menggunakan MySQL service references
# Ini akan membuat panah koneksi muncul di Railway Architecture view

echo "🔗 Updating Railway variables untuk menampilkan panah koneksi..."
echo ""

# Catatan: Ganti 'MySQL' dengan nama service MySQL Anda di Railway jika berbeda
MYSQL_SERVICE_NAME="MySQL"

echo "📝 Mengupdate database variables menggunakan service references..."
echo "   Service MySQL: $MYSQL_SERVICE_NAME"
echo ""

# Update DB_HOST menggunakan MySQL service reference
echo "1. Updating DB_HOST..."
railway variables --set "DB_HOST=\${{${MYSQL_SERVICE_NAME}.MYSQLHOST}}"

# Update DB_PORT
echo "2. Updating DB_PORT..."
railway variables --set "DB_PORT=\${{${MYSQL_SERVICE_NAME}.MYSQLPORT}}"

# Update DB_USERNAME
echo "3. Updating DB_USERNAME..."
railway variables --set "DB_USERNAME=\${{${MYSQL_SERVICE_NAME}.MYSQLUSER}}"

# Update DB_PASSWORD
echo "4. Updating DB_PASSWORD..."
railway variables --set "DB_PASSWORD=\${{${MYSQL_SERVICE_NAME}.MYSQLPASSWORD}}"

# Update DB_DATABASE
echo "5. Updating DB_DATABASE..."
railway variables --set "DB_DATABASE=\${{${MYSQL_SERVICE_NAME}.MYSQLDATABASE}}"

echo ""
echo "✅ Variables updated!"
echo ""
echo "📋 Verifikasi dengan:"
echo "   railway variables | grep DB_"
echo ""
echo "🔍 Setelah update, refresh Railway Dashboard → Architecture view"
echo "   untuk melihat panah koneksi antara Cahayaweb dan MySQL service"
echo ""
echo "⚠️  Catatan: Jika nama service MySQL Anda berbeda, edit script ini"
echo "   dan ganti MYSQL_SERVICE_NAME dengan nama service yang benar"

