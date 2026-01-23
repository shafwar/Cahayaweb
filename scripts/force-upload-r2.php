<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

echo "=== FORCE UPLOAD ALL FILES TO R2 ===\n\n";

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

// Upload images
echo "=== Uploading Images ===\n";
$uploadedImages = 0;
$failedImages = 0;

foreach ($images as $img) {
    $filename = basename($img);
    $r2Path = "public/images/{$filename}";
    
    try {
        // Check if file exists
        if (!file_exists($img)) {
            echo "✗ File not found: {$filename}\n";
            $failedImages++;
            continue;
        }
        
        $fileSize = filesize($img);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";
        
        // Force upload (overwrite if exists)
        $result = $disk->put($r2Path, file_get_contents($img), 'public');
        
        if ($result) {
            // Verify upload
            if ($disk->exists($r2Path)) {
                $uploadedSize = $disk->size($r2Path);
                echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
                $uploadedImages++;
            } else {
                echo "✗ FAILED (file not found after upload)\n";
                $failedImages++;
            }
        } else {
            echo "✗ FAILED (put returned false)\n";
            $failedImages++;
        }
    } catch (\Exception $e) {
        echo "✗ ERROR: {$e->getMessage()}\n";
        $failedImages++;
    }
}

// Upload videos
echo "\n=== Uploading Videos ===\n";
$uploadedVideos = 0;
$failedVideos = 0;

foreach ($videos as $vid) {
    $filename = basename($vid);
    $r2Path = "public/videos/{$filename}";
    
    try {
        // Check if file exists
        if (!file_exists($vid)) {
            echo "✗ File not found: {$filename}\n";
            $failedVideos++;
            continue;
        }
        
        $fileSize = filesize($vid);
        echo "Uploading: {$filename} ({$fileSize} bytes) -> {$r2Path}... ";
        
        // Force upload (overwrite if exists)
        $result = $disk->put($r2Path, file_get_contents($vid), 'public');
        
        if ($result) {
            // Verify upload
            if ($disk->exists($r2Path)) {
                $uploadedSize = $disk->size($r2Path);
                echo "✓ SUCCESS ({$uploadedSize} bytes)\n";
                $uploadedVideos++;
            } else {
                echo "✗ FAILED (file not found after upload)\n";
                $failedVideos++;
            }
        } else {
            echo "✗ FAILED (put returned false)\n";
            $failedVideos++;
        }
    } catch (\Exception $e) {
        echo "✗ ERROR: {$e->getMessage()}\n";
        $failedVideos++;
    }
}

// Final verification
echo "\n=== Final Verification ===\n";
try {
    $r2Images = $disk->files('public/images');
    $r2Videos = $disk->files('public/videos');
    
    echo "Images in R2: " . count($r2Images) . "\n";
    echo "Videos in R2: " . count($r2Videos) . "\n\n";
    
    echo "Summary:\n";
    echo "  Images uploaded: {$uploadedImages}\n";
    echo "  Images failed: {$failedImages}\n";
    echo "  Videos uploaded: {$uploadedVideos}\n";
    echo "  Videos failed: {$failedVideos}\n";
    
    if ($uploadedImages > 0 || $uploadedVideos > 0) {
        echo "\n✓ Upload completed successfully!\n";
    } else {
        echo "\n✗ No files were uploaded. Please check errors above.\n";
    }
} catch (\Exception $e) {
    echo "Error during verification: {$e->getMessage()}\n";
}
