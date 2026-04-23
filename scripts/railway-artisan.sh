#!/usr/bin/env sh
# Run Laravel Artisan inside Railway/Docker when `php` is not on PATH in `railway ssh`.
# Usage (from SSH shell):  sh scripts/railway-artisan.sh users:purge-except-admins --dry-run

set -e

if [ -d /app ]; then
    cd /app
else
    cd "$(dirname "$0")/.." || exit 1
fi

if command -v php >/dev/null 2>&1; then
    exec php artisan "$@"
fi
if [ -x /usr/local/bin/php ]; then
    exec /usr/local/bin/php artisan "$@"
fi
if [ -x /usr/bin/php ]; then
    exec /usr/bin/php artisan "$@"
fi

echo "ERROR: php binary not found. You may be SSH'd into the wrong Railway service (not your Laravel app)." >&2
echo "Try: railway service  → pick the web/Laravel service → railway ssh" >&2
echo "Or run: /usr/local/bin/php -v   (official php:*-cli Docker images)" >&2
exit 127
