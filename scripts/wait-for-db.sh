#!/bin/bash

# Wait for database to be ready before running migrations
# This prevents "MySQL server has gone away" errors

MAX_RETRIES=10
RETRY_DELAY=3

echo "⏳ Waiting for database connection..."

for i in $(seq 1 $MAX_RETRIES); do
    if php artisan db:show &>/dev/null; then
        echo "✅ Database connection established!"
        exit 0
    fi
    
    if [ $i -lt $MAX_RETRIES ]; then
        echo "⚠️  Database connection attempt $i/$MAX_RETRIES failed. Retrying in ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    else
        echo "❌ Database connection failed after $MAX_RETRIES attempts"
        echo "⚠️  Continuing anyway - migration will handle connection errors..."
        exit 0
    fi
done
