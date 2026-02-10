<?php

/**
 * Upload public root images to R2
 * Path in R2: public/images/ (since R2 root is 'public')
 * URL: https://assets.cahayaanbiya.com/public/images/*.jpg
 * 
 * This script uploads images from public/ root to R2 images/ folder
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use App\Support\R2Helper;

$disk = R2Helper::diskForCms();
$publicPath = __DIR__ . '/../public';

echo "=== UPLOAD PUBLIC ROOT IMAGES TO R2 ===\n\n";

if (!R2Helper::isR2DiskConfigured()) {
    echo "⚠ WARNING: R2 disk is not configured. Will use public disk.\n";
    echo "  Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_URL, R2_ENDPOINT in .env\n\n";
}

// List of images in public root that should be uploaded to R2
$imagesToUpload = [
    'arabsaudi.jpg',
    'TURKEY.jpeg',
    'egypt.jpeg',
    'jordan.jpeg',
    'umrah.jpeg',
    'dubai1.jpeg',
    'b2b.jpeg',
    'bali.jpeg',
    'bahrain.jpg',
    'kuwait.jpg',
    'oman.jpg',
    'qatar.jpg',
    'turkey2.jpg',
    'cahayanbiyalogo.png',
    'apple-touch-icon.png',
    'packages1.png',
    'packages2.png',
    'packages2(1).png',
    'packages2(2).png',
    'packages2(3).png',
    'packages3.png',
];

$uploaded = 0;
$failed = 0;
$skipped = 0;

foreach ($imagesToUpload as $filename) {
    $localPath = $publicPath . '/' . $filename;
    // R2 root is 'public', so we put to 'images/filename'
    $r2Path = "images/{$filename}";

    try {
        if (!file_exists($localPath)) {
            echo "⊘ File not found (skipping): {$filename}\n";
            $skipped++;
            continue;
        }

        // Check if file already exists in R2
        if ($disk->exists($r2Path)) {
            echo "⊘ Skipping (already exists): {$filename} -> {$r2Path}\n";
            $skipped++;
            continue;
        }

        $fileSize = filesize($localPath);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";

        $result = $disk->put($r2Path, file_get_contents($localPath), 'public');

        if ($result && $disk->exists($r2Path)) {
            $uploadedSize = $disk->size($r2Path);
            $url = R2Helper::url($r2Path);
            echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
            echo "  URL: {$url}\n";
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

echo "\n=== Summary ===\n";
echo "  Uploaded: {$uploaded}\n";
echo "  Skipped (already exists): {$skipped}\n";
echo "  Failed: {$failed}\n";

if ($uploaded > 0 || $skipped > 0) {
    echo "\n✓ Public root images ready in R2!\n";
    echo "  URL base: https://assets.cahayaanbiya.com/public/images/\n";
} else {
    echo "\n⚠ No new files uploaded. Check errors above.\n";
    exit(1);
}
