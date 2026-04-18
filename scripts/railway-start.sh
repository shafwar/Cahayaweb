#!/usr/bin/env sh
# Railway / Docker web process.
#
# IMPORTANT: Do NOT run `php artisan route:cache` here. This project registers many
# closure-based routes in routes/web.php; route serialization fails and would stop the
# shell chain before `php artisan serve`, leaving the site unreachable.

set -f

cd /app 2>/dev/null || cd "$(dirname "$0")/.." || true

php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

php artisan migrate:safe --force || true

php artisan config:cache 2>/dev/null || true

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
