<?php

// Ensure required directories exist
$paths = [
    storage_path('app'),
    storage_path('logs'),
    storage_path('framework/cache'),
    storage_path('framework/sessions'),
    storage_path('framework/views'),
    database_path()
];

foreach ($paths as $path) {
    if (!file_exists($path)) {
        mkdir($path, 0755, true);
    }
}

// Create SQLite database if it doesn't exist
$sqliteFile = database_path('database.sqlite');
if (!file_exists($sqliteFile)) {
    touch($sqliteFile);
    chmod($sqliteFile, 0644);
}

// Set proper permissions
exec('chmod -R 755 ' . storage_path());
exec('chmod -R 755 ' . bootstrap_path('cache'));

echo "Railway bootstrap completed.\n";
