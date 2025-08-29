<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

// Ensure database exists before handling requests
$databasePath = '/app/storage/database.sqlite';
if (!file_exists($databasePath)) {
    $databaseDir = dirname($databasePath);
    if (!file_exists($databaseDir)) {
        mkdir($databaseDir, 0755, true);
    }
    touch($databasePath);
    chmod($databasePath, 0664);
}

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
