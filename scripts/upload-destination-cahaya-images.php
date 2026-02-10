<?php

/**
 * Upload Destination Cahaya images to R2
 * Path in R2: images/Destination Cahaya*.jpeg (since R2 root is 'public')
 * URL: https://assets.cahayaanbiya.com/public/images/Destination%20Cahaya*.jpeg
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use App\Support\R2Helper;

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

echo "=== UPLOAD DESTINATION CAHAYA IMAGES TO R2 ===\n\n";
echo "NOTE: R2 root is 'public', so we upload to 'images/' not 'public/images/'\n\n";

// Find all Destination Cahaya images
$destinationImages = [];
$patterns = [
    'Destination Cahaya.jpeg',
    'Destination Cahaya *.jpeg',
    'Destination Cahaya*.jpeg',
];

// Get all files matching Destination Cahaya pattern
$allFiles = glob($publicPath . '/Destination Cahaya*.jpeg');
$allFiles = array_merge($allFiles, glob($publicPath . '/Destination Cahaya*.jpeg'));

// Also check for exact match
if (file_exists($publicPath . '/Destination Cahaya.jpeg')) {
    $allFiles[] = $publicPath . '/Destination Cahaya.jpeg';
}

// Remove duplicates and filter only existing files
$destinationImages = array_filter(array_unique($allFiles), 'file_exists');

if (empty($destinationImages)) {
    echo "⚠ No Destination Cahaya images found in public/\n";
    echo "Looking for files matching: Destination Cahaya*.jpeg\n";
    exit(1);
}

echo "Found " . count($destinationImages) . " Destination Cahaya images:\n";
foreach ($destinationImages as $img) {
    echo "  - " . basename($img) . "\n";
}
echo "\n";

$uploaded = 0;
$failed = 0;
$skipped = 0;

foreach ($destinationImages as $file) {
    $filename = basename($file);
    // R2 root is 'public', so we put to 'images/filename'
    $r2Path = "images/{$filename}";
    
    try {
        if (!file_exists($file)) {
            echo "✗ File not found: {$filename}\n";
            $failed++;
            continue;
        }

        // Check if file already exists in R2
        if ($disk->exists($r2Path)) {
            echo "⊘ Skipping (already exists): {$filename} -> {$r2Path}\n";
            $skipped++;
            continue;
        }

        $fileSize = filesize($file);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";

        $result = $disk->put($r2Path, file_get_contents($file), 'public');

        if ($result && $disk->exists($r2Path)) {
            $uploadedSize = $disk->size($r2Path);
            $r2Url = R2Helper::url($r2Path);
            echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
            echo "  URL: {$r2Url}\n";
            $uploaded++;
        } else {
            echo "✗ FAILED\n";
            $failed++;
        }
    } catch (\Exception $e) {
        echo "✗ ERROR: {$e->getMessage()}\n";
        $failed++;
    }
}

echo "\n=== Verification ===\n";
try {
    $r2Files = $disk->files('images');
    $destinationFiles = array_filter($r2Files, function($f) {
        return strpos($f, 'Destination Cahaya') !== false;
    });
    
    echo "Destination Cahaya images in R2 (images/): " . count($destinationFiles) . "\n";
    foreach ($destinationFiles as $f) {
        $url = R2Helper::url($f);
        echo "  - {$f}\n";
        echo "    URL: {$url}\n";
    }
} catch (\Exception $e) {
    echo "Error verifying: {$e->getMessage()}\n";
}

echo "\n=== Summary ===\n";
echo "  Uploaded: {$uploaded}\n";
echo "  Skipped (already exists): {$skipped}\n";
echo "  Failed: {$failed}\n";

if ($uploaded > 0) {
    echo "\n✓ Destination Cahaya images uploaded to R2 successfully!\n";
    echo "  URL base: https://assets.cahayaanbiya.com/public/images/\n";
    echo "\n  Example URLs:\n";
    foreach ($destinationImages as $img) {
        $filename = basename($img);
        $r2Path = "images/{$filename}";
        $url = R2Helper::url($r2Path);
        echo "    - {$url}\n";
    }
} else if ($skipped > 0) {
    echo "\n✓ All Destination Cahaya images already exist in R2!\n";
} else {
    echo "\n✗ No files uploaded. Check errors above.\n";
    exit(1);
}
