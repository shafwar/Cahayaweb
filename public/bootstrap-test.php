<?php
// Test Laravel bootstrap step by step
header('Content-Type: application/json');

try {
    // Step 1: Autoloader
    require '../vendor/autoload.php';
    $step1 = 'Autoloader loaded successfully';

    // Step 2: Bootstrap app
    $app = require_once '../bootstrap/app.php';
    $step2 = 'Laravel app bootstrapped successfully';

    // Step 3: Environment check
    $step3 = 'Environment: ' . $app->environment();

    // Step 4: Database check
    $config = $app->make('config');
    $step4 = 'Database path: ' . $config->get('database.connections.sqlite.database');

    echo json_encode([
        'status' => 'success',
        'step1' => $step1,
        'step2' => $step2,
        'step3' => $step3,
        'step4' => $step4
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
