<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

echo "=== UPLOAD TO R2 WITH CORRECT PATH ===\n\n";
echo "NOTE: R2 root is 'public', so we upload to 'images/' not 'public/images/'\n\n";

// Get all image files
$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$images = [];
foreach ($imageExtensions as $ext) {
    $files = glob($publicPath . "/*.{$ext}");
    $images = array_merge($images, $files);
}

// Get all video files
$videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
$videos = [];
foreach ($videoExtensions as $ext) {
    $files = glob($publicPath . "/*.{$ext}");
    $videos = array_merge($videos, $files);
}

echo "Found " . count($images) . " images and " . count($videos) . " videos\n\n";

// Upload images to 'images/' (not 'public/images/') because root is 'public'
echo "=== Uploading Images to images/ ===\n";
$uploadedImages = 0;
foreach ($images as $img) {
    $filename = basename($img);
    // Upload to 'images/' because root is already 'public'
    $r2Path = "images/{$filename}";
    
    try {
        $fileSize = filesize($img);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";
        
        $result = $disk->put($r2Path, file_get_contents($img), 'public');
        
        if ($result && $disk->exists($r2Path)) {
            $uploadedSize = $disk->size($r2Path);
            echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
            $uploadedImages++;
        } else {
            echo "✗ FAILED\n";
        }
    } catch (\Exception $e) {
        echo "✗ ERROR: {$e->getMessage()}\n";
    }
}

// Upload videos to 'videos/' (not 'public/videos/') because root is 'public'
echo "\n=== Uploading Videos to videos/ ===\n";
$uploadedVideos = 0;
foreach ($videos as $vid) {
    $filename = basename($vid);
    // Upload to 'videos/' because root is already 'public'
    $r2Path = "videos/{$filename}";
    
    try {
        $fileSize = filesize($vid);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";
        
        $result = $disk->put($r2Path, file_get_contents($vid), 'public');
        
        if ($result && $disk->exists($r2Path)) {
            $uploadedSize = $disk->size($r2Path);
            echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
            $uploadedVideos++;
        } else {
            echo "✗ FAILED\n";
        }
    } catch (\Exception $e) {
        echo "✗ ERROR: {$e->getMessage()}\n";
    }
}

// Verify
echo "\n=== Verification ===\n";
$r2Images = $disk->files('images');
$r2Videos = $disk->files('videos');

echo "Images in R2 (images/): " . count($r2Images) . "\n";
echo "Videos in R2 (videos/): " . count($r2Videos) . "\n\n";

echo "First 5 images:\n";
foreach (array_slice($r2Images, 0, 5) as $img) {
    echo "  - {$img}\n";
}

echo "\nSummary:\n";
echo "  Images uploaded: {$uploadedImages}\n";
echo "  Videos uploaded: {$uploadedVideos}\n";

if ($uploadedImages > 0 && $uploadedVideos > 0) {
    echo "\n✓ Upload completed! Files should now be visible in dashboard.\n";
}
