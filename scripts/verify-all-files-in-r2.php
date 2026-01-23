<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

echo "=== VERIFY ALL FILES IN R2 ===\n\n";

// Get all local image files
$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$localImages = [];
foreach ($imageExtensions as $ext) {
    $files = glob($publicPath . "/*.{$ext}");
    foreach ($files as $file) {
        $localImages[] = basename($file);
    }
}
sort($localImages);

// Get all local video files
$videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
$localVideos = [];
foreach ($videoExtensions as $ext) {
    $files = glob($publicPath . "/*.{$ext}");
    foreach ($files as $file) {
        $localVideos[] = basename($file);
    }
}
sort($localVideos);

// Get all R2 image files
$r2Images = [];
$r2ImageFiles = $disk->files('images');
foreach ($r2ImageFiles as $file) {
    if (!str_ends_with($file, '.keep')) {
        $r2Images[] = basename($file);
    }
}
sort($r2Images);

// Get all R2 video files
$r2Videos = [];
$r2VideoFiles = $disk->files('videos');
foreach ($r2VideoFiles as $file) {
    if (!str_ends_with($file, '.keep')) {
        $r2Videos[] = basename($file);
    }
}
sort($r2Videos);

echo "=== LOCAL FILES ===\n";
echo "Images: " . count($localImages) . "\n";
echo "Videos: " . count($localVideos) . "\n\n";

echo "=== R2 FILES ===\n";
echo "Images: " . count($r2Images) . "\n";
echo "Videos: " . count($r2Videos) . "\n\n";

// Compare
echo "=== COMPARISON ===\n\n";

// Check missing images
$missingImages = array_diff($localImages, $r2Images);
if (empty($missingImages)) {
    echo "✓ All images are in R2\n";
} else {
    echo "✗ Missing images in R2:\n";
    foreach ($missingImages as $img) {
        echo "  - {$img}\n";
    }
}

// Check extra images in R2
$extraImages = array_diff($r2Images, $localImages);
if (!empty($extraImages)) {
    echo "\n⚠ Extra images in R2 (not in local):\n";
    foreach ($extraImages as $img) {
        echo "  - {$img}\n";
    }
}

// Check missing videos
$missingVideos = array_diff($localVideos, $r2Videos);
if (empty($missingVideos)) {
    echo "\n✓ All videos are in R2\n";
} else {
    echo "\n✗ Missing videos in R2:\n";
    foreach ($missingVideos as $vid) {
        echo "  - {$vid}\n";
    }
}

// Check extra videos in R2
$extraVideos = array_diff($r2Videos, $localVideos);
if (!empty($extraVideos)) {
    echo "\n⚠ Extra videos in R2 (not in local):\n";
    foreach ($extraVideos as $vid) {
        echo "  - {$vid}\n";
    }
}

// Final summary
echo "\n=== SUMMARY ===\n";
$totalLocal = count($localImages) + count($localVideos);
$totalR2 = count($r2Images) + count($r2Videos);
$missing = count($missingImages) + count($missingVideos);

if ($missing === 0 && $totalLocal === $totalR2) {
    echo "✅ PERFECT: All files are in R2!\n";
    echo "   Local: {$totalLocal} files\n";
    echo "   R2: {$totalR2} files\n";
} elseif ($missing === 0) {
    echo "✅ All local files are in R2\n";
    echo "   Local: {$totalLocal} files\n";
    echo "   R2: {$totalR2} files (some extra files in R2)\n";
} else {
    echo "⚠️  Some files are missing in R2\n";
    echo "   Missing: {$missing} files\n";
    echo "   Local: {$totalLocal} files\n";
    echo "   R2: {$totalR2} files\n";
}
