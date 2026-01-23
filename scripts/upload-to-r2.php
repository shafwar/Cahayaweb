<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

echo "=== Uploading Images to R2 ===\n";

// Upload images
$images = glob($publicPath . '/*.{jpg,jpeg,png}', GLOB_BRACE);
foreach ($images as $img) {
    $filename = basename($img);
    $r2Path = "public/images/{$filename}";
    
    try {
        $disk->put($r2Path, file_get_contents($img), 'public');
        echo "✓ Uploaded: {$filename} -> {$r2Path}\n";
    } catch (\Exception $e) {
        echo "✗ Failed: {$filename} - {$e->getMessage()}\n";
    }
}

echo "\n=== Uploading Videos to R2 ===\n";

// Upload videos
$videos = glob($publicPath . '/*.mp4');
foreach ($videos as $vid) {
    $filename = basename($vid);
    $r2Path = "public/videos/{$filename}";
    
    try {
        $disk->put($r2Path, file_get_contents($vid), 'public');
        echo "✓ Uploaded: {$filename} -> {$r2Path}\n";
    } catch (\Exception $e) {
        echo "✗ Failed: {$filename} - {$e->getMessage()}\n";
    }
}

echo "\n=== Upload Complete ===\n";
echo "Verifying uploads...\n";

try {
    $images = $disk->files('public/images');
    echo "Images in R2: " . count($images) . "\n";
    foreach (array_slice($images, 0, 10) as $img) {
        echo "  - {$img}\n";
    }
    
    $videos = $disk->files('public/videos');
    echo "Videos in R2: " . count($videos) . "\n";
    foreach (array_slice($videos, 0, 10) as $vid) {
        echo "  - {$vid}\n";
    }
} catch (\Exception $e) {
    echo "Error verifying: {$e->getMessage()}\n";
}

