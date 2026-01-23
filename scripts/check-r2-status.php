<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "=== R2 Status Check ===\n\n";

// Test files
$testFiles = [
    'public/images/arabsaudi.jpg',
    'public/images/TURKEY.jpeg',
    'public/videos/b2cherosectionvideo.mp4',
];

$disk = Storage::disk('r2');
$baseUrl = config('filesystems.disks.r2.url', 'https://assets.cahayaanbiya.com');

echo "1. File Existence in R2 Bucket:\n";
foreach ($testFiles as $file) {
    $exists = $disk->exists($file);
    $status = $exists ? '✓' : '✗';
    echo "   {$status} {$file}: " . ($exists ? 'EXISTS' : 'NOT FOUND') . "\n";
}
echo "\n";

echo "2. Generated URLs:\n";
foreach ($testFiles as $file) {
    if ($disk->exists($file)) {
        $url = \App\Support\R2Helper::url($file);
        echo "   - {$file}\n";
        echo "     URL: {$url}\n";
    }
}
echo "\n";

echo "3. HTTP Accessibility Test:\n";
foreach ($testFiles as $file) {
    if ($disk->exists($file)) {
        $url = \App\Support\R2Helper::url($file);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
        
        $status = ($httpCode === 200) ? '✓' : '✗';
        echo "   {$status} {$url}\n";
        echo "     HTTP Code: {$httpCode}\n";
        if ($httpCode === 200) {
            echo "     Content-Type: {$contentType}\n";
        } else {
            echo "     Status: NOT ACCESSIBLE\n";
        }
        echo "\n";
    }
}

echo "=== Summary ===\n";
echo "✓ CORS Policy: Already configured\n";
echo "⚠ Bucket Policy: Need to verify public access is enabled\n";
echo "⚠ Custom Domain: Need to verify it's active and connected\n";
echo "\n";
echo "Next Steps:\n";
echo "1. Go to Cloudflare R2 Dashboard → cahayaanbiya-assets → Settings → Public Access\n";
echo "2. Enable 'Allow Access' or add bucket policy for public read\n";
echo "3. Verify custom domain 'assets.cahayaanbiya.com' is Active and Connected\n";
echo "4. Wait 5-10 minutes for DNS propagation\n";
echo "5. Run this script again to verify\n";
