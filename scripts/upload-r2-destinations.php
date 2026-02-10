<?php

/**
 * Upload public/images/destinations/ folder to R2
 * Path in R2: public/images/destinations/ (since R2 root is 'public')
 * URL: https://assets.cahayaanbiya.com/public/images/destinations/*.png
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use App\Support\R2Helper;

$disk = R2Helper::diskForCms();
$destinationsPath = __DIR__ . '/../public/images/destinations';

echo "=== UPLOAD DESTINATION IMAGES TO R2 ===\n\n";

if (!R2Helper::isR2DiskConfigured()) {
    echo "⚠ WARNING: R2 disk is not configured. Will use public disk.\n";
    echo "  Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_URL, R2_ENDPOINT in .env\n\n";
}

if (!is_dir($destinationsPath)) {
    echo "✗ ERROR: public/images/destinations/ directory not found\n";
    exit(1);
}

$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$files = [];
foreach ($imageExtensions as $ext) {
    $glob = glob($destinationsPath . "/*.{$ext}");
    $files = array_merge($files, $glob ?: []);
}

// Also support PNG files
$allFiles = glob($destinationsPath . '/*');
foreach ($allFiles ?: [] as $f) {
    if (is_file($f) && !in_array($f, $files)) {
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (in_array($ext, $imageExtensions)) {
            $files[] = $f;
        }
    }
}

$files = array_unique($files);

if (empty($files)) {
    echo "⚠ No image files found in public/images/destinations/\n";
    exit(0);
}

echo "Found " . count($files) . " files in public/images/destinations/\n\n";

$uploaded = 0;
$failed = 0;
$skipped = 0;

foreach ($files as $file) {
    $filename = basename($file);
    // R2 root is 'public', so we put to 'images/destinations/filename'
    $r2Path = "images/destinations/{$filename}";

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

echo "\n=== Verification ===\n";
try {
    $r2Files = $disk->files('images/destinations');
    echo "Files in R2 (images/destinations/): " . count($r2Files) . "\n";
    foreach (array_slice($r2Files, 0, 10) as $f) {
        $url = R2Helper::url($f);
        echo "  - {$f} -> {$url}\n";
    }
    if (count($r2Files) > 10) {
        echo "  ... and " . (count($r2Files) - 10) . " more files\n";
    }
} catch (\Exception $e) {
    echo "Error: {$e->getMessage()}\n";
}

echo "\n=== Summary ===\n";
echo "  Uploaded: {$uploaded}\n";
echo "  Skipped (already exists): {$skipped}\n";
echo "  Failed: {$failed}\n";

if ($uploaded > 0 || $skipped > 0) {
    echo "\n✓ Destination images ready in R2!\n";
    echo "  URL base: https://assets.cahayaanbiya.com/public/images/destinations/\n";
} else {
    echo "\n⚠ No new files uploaded. Check errors above.\n";
    exit(1);
}
