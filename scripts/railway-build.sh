#!/bin/bash
set -e

echo "🚀 Building Cahayaweb for Railway..."

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm ci --only=production=false

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

# Setup Laravel for production
echo "⚙️  Setting up Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "🗄️  Running migrations..."
php artisan migrate --force

echo "✅ Build completed successfully!"
