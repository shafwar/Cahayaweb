<?php
// Basic PHP diagnostic - bypasses Laravel entirely
header('Content-Type: application/json');

$checks = [
    'php_version' => PHP_VERSION,
    'required_extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_sqlite' => extension_loaded('pdo_sqlite'),
        'mbstring' => extension_loaded('mbstring'),
        'tokenizer' => extension_loaded('tokenizer'),
        'json' => extension_loaded('json'),
    ],
    'file_permissions' => [
        'storage_exists' => is_dir('../storage'),
        'storage_writable' => is_writable('../storage'),
        'bootstrap_cache_exists' => is_dir('../bootstrap/cache'),
        'bootstrap_cache_writable' => is_writable('../bootstrap/cache'),
    ],
    'env_file' => [
        'exists' => file_exists('../.env'),
        'readable' => is_readable('../.env'),
    ],
    'database' => [
        'sqlite_path' => realpath('../database/database.sqlite'),
        'sqlite_exists' => file_exists('../database/database.sqlite'),
        'sqlite_writable' => is_writable('../database/database.sqlite'),
    ]
];

echo json_encode($checks, JSON_PRETTY_PRINT);
?>
