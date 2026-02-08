<?php

/**
 * Upload public/images/packages/ folder to R2
 * Path in R2: public/images/packages/ (since R2 root is 'public')
 * URL: https://assets.cahayaanbiya.com/public/images/packages/*.png
 * NOTE: Images moved from public/packages/ to avoid route conflict with /packages page
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('r2');
$packagesPath = __DIR__ . '/../public/images/packages';

echo "=== UPLOAD PACKAGE IMAGES TO R2 ===\n\n";

if (!is_dir($packagesPath)) {
    echo "✗ ERROR: public/images/packages/ directory not found\n";
    exit(1);
}

$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$files = [];
foreach ($imageExtensions as $ext) {
    $glob = glob($packagesPath . "/*.{$ext}");
    $files = array_merge($files, $glob ?: []);
}

// Also support files with parentheses in name (e.g. packages2(1).png)
$allFiles = glob($packagesPath . '/*');
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
    echo "⚠ No image files found in public/images/packages/\n";
    exit(0);
}

echo "Found " . count($files) . " files in public/images/packages/\n\n";

$uploaded = 0;
$failed = 0;

foreach ($files as $file) {
    $filename = basename($file);
    // R2 root is 'public', so we put to 'images/packages/filename'
    $r2Path = "images/packages/{$filename}";

    try {
        if (!file_exists($file)) {
            echo "✗ File not found: {$filename}\n";
            $failed++;
            continue;
        }

        $fileSize = filesize($file);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";

        $result = $disk->put($r2Path, file_get_contents($file), 'public');

        if ($result && $disk->exists($r2Path)) {
            $uploadedSize = $disk->size($r2Path);
            echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
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
    $r2Files = $disk->files('images/packages');
    echo "Files in R2 (images/packages/): " . count($r2Files) . "\n";
    foreach ($r2Files as $f) {
        echo "  - {$f}\n";
    }
} catch (\Exception $e) {
    echo "Error: {$e->getMessage()}\n";
}

echo "\n=== Summary ===\n";
echo "  Uploaded: {$uploaded}\n";
echo "  Failed: {$failed}\n";

if ($uploaded > 0) {
    echo "\n✓ Package images uploaded to R2 successfully!\n";
    echo "  URL base: https://assets.cahayaanbiya.com/public/images/packages/\n";
} else {
    echo "\n✗ No files uploaded. Check errors above.\n";
    exit(1);
}
