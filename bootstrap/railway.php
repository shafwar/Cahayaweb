<?php

// Ensure SQLite database exists
$databaseDir = dirname(database_path('database.sqlite'));
if (!file_exists($databaseDir)) {
    mkdir($databaseDir, 0755, true);
}

$databaseFile = database_path('database.sqlite');
if (!file_exists($databaseFile)) {
    touch($databaseFile);
    chmod($databaseFile, 0644);
}

// Ensure storage directories exist
$storageDirs = [
    storage_path('app/public'),
    storage_path('framework/cache/data'),
    storage_path('framework/sessions'),
    storage_path('framework/views'),
    storage_path('logs'),
];

foreach ($storageDirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Set proper permissions
chmod(storage_path(), 0755);
chmod(bootstrap_path('cache'), 0755);

echo "Railway bootstrap completed successfully.\n";
