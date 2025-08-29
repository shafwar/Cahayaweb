<?php

// Clear all cached files that might reference deleted bootstrap file
$cachePaths = [
    __DIR__ . '/../storage/framework/cache',
    __DIR__ . '/../storage/framework/sessions',
    __DIR__ . '/../storage/framework/views',
    __DIR__ . '/../bootstrap/cache'
];

foreach ($cachePaths as $path) {
    if (is_dir($path)) {
        $files = glob($path . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
    }
}

echo "All cache files cleared successfully.\n";
