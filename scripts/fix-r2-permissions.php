<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "=== Fixing R2 File Permissions ===\n\n";

try {
    $disk = Storage::disk('r2');
    
    // Get all files in R2
    $allFiles = $disk->allFiles('public');
    
    echo "Found " . count($allFiles) . " files in R2\n";
    echo "Updating permissions to public-read...\n\n";
    
    $successCount = 0;
    $failCount = 0;
    
    foreach ($allFiles as $file) {
        try {
            // Set visibility to public
            $disk->setVisibility($file, 'public');
            echo "✓ {$file}\n";
            $successCount++;
        } catch (\Exception $e) {
            echo "✗ {$file}: {$e->getMessage()}\n";
            $failCount++;
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Success: {$successCount}\n";
    echo "Failed: {$failCount}\n";
    echo "\nNote: If files are still not accessible, check:\n";
    echo "1. Cloudflare R2 bucket public access policy\n";
    echo "2. Custom domain configuration in R2 dashboard\n";
    echo "3. CORS settings in R2 bucket\n";
    
} catch (\Exception $e) {
    echo "✗ Fatal error: " . $e->getMessage() . "\n";
    exit(1);
}
