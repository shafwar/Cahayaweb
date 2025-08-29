<?php

// Database initialization for Railway deployment
$databasePath = '/app/storage/database.sqlite';
$databaseDir = dirname($databasePath);

if (!file_exists($databaseDir)) {
    mkdir($databaseDir, 0755, true);
}

if (!file_exists($databasePath)) {
    touch($databasePath);
    chmod($databasePath, 0664);
}

// Run migrations if database is empty
if (filesize($databasePath) === 0) {
    exec('cd /app && php artisan migrate --force');
    exec('cd /app && php artisan db:seed --force');
}
