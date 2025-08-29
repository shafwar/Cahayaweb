<?php

// Ensure database directory exists
$databasePath = __DIR__ . '/../storage/database.sqlite';
$databaseDir = dirname($databasePath);

if (!file_exists($databaseDir)) {
    mkdir($databaseDir, 0755, true);
}

if (!file_exists($databasePath)) {
    touch($databasePath);
    chmod($databasePath, 0664);
}
