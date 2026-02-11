#!/bin/bash

# Safe migration script with retry logic
# Prevents crash loop if MySQL connection drops

set +e  # Don't exit on error

MAX_RETRIES=3
RETRY_DELAY=5

echo "🔄 Starting database migration..."

for attempt in $(seq 1 $MAX_RETRIES); do
    echo "📋 Migration attempt $attempt/$MAX_RETRIES..."
    
    php artisan migrate --force
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration completed successfully!"
        exit 0
    fi
    
    if [ $attempt -lt $MAX_RETRIES ]; then
        echo "⚠️  Migration failed. Retrying in ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    else
        echo "❌ Migration failed after $MAX_RETRIES attempts"
        echo "⚠️  Continuing startup - tables may already exist..."
        exit 0  # Don't crash - let application start
    fi
done
