<?php

// Ensure all required storage directories exist
$directories = [
    storage_path('framework'),
    storage_path('framework/cache'),
    storage_path('framework/cache/data'),
    storage_path('framework/sessions'),
    storage_path('framework/views'),
    storage_path('logs'),
    database_path()
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
        echo "Created: $dir\n";
    }
}

// Create database file
$dbFile = database_path('database.sqlite');
if (!file_exists($dbFile)) {
    touch($dbFile);
    chmod($dbFile, 0664);
    echo "Created: $dbFile\n";
}

echo "Storage setup complete\n";
