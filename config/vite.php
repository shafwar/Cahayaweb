<?php

return [
    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
    ],
    'build_path' => 'build',
    'manifest_path' => 'build/manifest.json',
    'hot_file' => 'build/hot',
    'asset_url' => env('ASSET_URL', env('APP_URL')),
];
