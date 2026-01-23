<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

echo "=== R2 Connection Verification ===\n\n";

try {
    $disk = Storage::disk('r2');
    
    // Test 1: Check if disk is accessible
    echo "1. Testing R2 disk connection...\n";
    $config = config('filesystems.disks.r2');
    echo "   - Driver: " . ($config['driver'] ?? 'N/A') . "\n";
    echo "   - Bucket: " . ($config['bucket'] ?? 'N/A') . "\n";
    echo "   - Endpoint: " . ($config['endpoint'] ?? 'N/A') . "\n";
    echo "   - URL: " . ($config['url'] ?? 'N/A') . "\n";
    echo "   - Root: " . ($config['root'] ?? 'N/A') . "\n";
    echo "   ✓ Disk configuration loaded\n\n";
    
    // Test 2: List files in R2
    echo "2. Listing files in R2 bucket...\n";
    try {
        $allFiles = $disk->allFiles('public');
        echo "   - Total files found: " . count($allFiles) . "\n";
        if (count($allFiles) > 0) {
            echo "   - First 10 files:\n";
            foreach (array_slice($allFiles, 0, 10) as $file) {
                echo "     * {$file}\n";
            }
        }
        echo "   ✓ Files listed successfully\n\n";
    } catch (\Exception $e) {
        echo "   ✗ Error listing files: " . $e->getMessage() . "\n\n";
    }
    
    // Test 3: Check if specific files exist
    echo "3. Checking specific files...\n";
    $testFiles = [
        'public/images/arabsaudi.jpg',
        'public/images/TURKEY.jpeg',
        'public/images/egypt.jpeg',
        'public/videos/b2cherosectionvideo.mp4',
    ];
    
    foreach ($testFiles as $file) {
        $exists = $disk->exists($file);
        $status = $exists ? '✓' : '✗';
        echo "   {$status} {$file}: " . ($exists ? 'EXISTS' : 'NOT FOUND') . "\n";
    }
    echo "\n";
    
    // Test 4: Generate URLs for test files using R2Helper
    echo "4. Generating R2 URLs using R2Helper...\n";
    foreach ($testFiles as $file) {
        if ($disk->exists($file)) {
            // Use R2Helper to generate correct URL
            $url = \App\Support\R2Helper::url($file);
            echo "   - {$file}\n";
            echo "     URL: {$url}\n";
        }
    }
    echo "\n";
    
    // Test 5: Test HTTP accessibility
    echo "5. Testing HTTP accessibility...\n";
    $testUrls = [
        'https://assets.cahayaanbiya.com/public/images/arabsaudi.jpg',
        'https://assets.cahayaanbiya.com/public/images/TURKEY.jpeg',
        'https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4',
    ];
    
    foreach ($testUrls as $url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $status = ($httpCode === 200) ? '✓' : '✗';
        echo "   {$status} {$url}: HTTP {$httpCode}\n";
    }
    
    echo "\n=== Verification Complete ===\n";
    
} catch (\Exception $e) {
    echo "✗ Fatal error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
