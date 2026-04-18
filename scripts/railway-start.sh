#!/usr/bin/env sh
# Railway / Docker web process.
#
# Routes are controller-based (no closures in web.php) so route:cache is safe.
# Each cache step uses `|| true` so a rare failure still starts the web server.

set -f

cd /app 2>/dev/null || cd "$(dirname "$0")/.." || true

php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

php artisan migrate:safe --force || true

php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
