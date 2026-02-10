<?php

/**
 * Script untuk upload semua gambar Destination Cahaya ke R2
 * Menjalankan: php scripts/upload-destination-cahaya-to-r2.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Support\R2Helper;

echo "========================================\n";
echo "  Upload Destination Cahaya Images to R2\n";
echo "========================================\n\n";

// Check if R2 is configured
if (!R2Helper::isR2DiskConfigured()) {
    echo "❌ ERROR: R2 disk tidak dikonfigurasi!\n";
    echo "Pastikan environment variables berikut sudah di-set:\n";
    echo "  - R2_ACCESS_KEY_ID\n";
    echo "  - R2_SECRET_ACCESS_KEY\n";
    echo "  - R2_BUCKET\n";
    echo "  - R2_URL\n";
    echo "  - R2_ENDPOINT\n";
    exit(1);
}

$disk = Storage::disk('r2');
$publicPath = __DIR__ . '/../public';

// List semua file Destination Cahaya yang perlu di-upload
$destinationCahayaFiles = [
    'Destination Cahaya.jpeg',
    'Destination Cahaya 1.jpeg',
    'Destination Cahaya 2.jpeg',
    'Destination Cahaya 3.jpeg',
    'Destination Cahaya 4.jpeg',
    'Destination Cahaya 5.jpeg',
    'Destination Cahaya 6.jpeg',
    'Destination Cahaya 7.jpeg',
    'Destination Cahaya 8.jpeg',
];

echo "📋 Files yang akan di-upload:\n";
foreach ($destinationCahayaFiles as $file) {
    echo "  - {$file}\n";
}
echo "\n";

$uploaded = 0;
$failed = 0;
$skipped = 0;

echo "🚀 Starting upload...\n\n";

foreach ($destinationCahayaFiles as $filename) {
    $localPath = $publicPath . '/' . $filename;
    
    // Check if file exists locally
    if (!file_exists($localPath)) {
        echo "⚠️  SKIP: {$filename} - File tidak ditemukan di local\n";
        $skipped++;
        continue;
    }
    
    // R2 path: public/images/Destination Cahaya X.jpeg
    $r2Path = "public/images/{$filename}";
    
    try {
        // Check if file already exists in R2
        if ($disk->exists($r2Path)) {
            echo "⏭️  SKIP: {$filename} - Sudah ada di R2\n";
            $skipped++;
            continue;
        }
        
        // Read file content
        $fileContent = file_get_contents($localPath);
        if ($fileContent === false) {
            throw new \Exception("Gagal membaca file dari local");
        }
        
        // Upload to R2
        $success = $disk->put($r2Path, $fileContent, 'public');
        
        if ($success) {
            // Verify upload by checking if file exists
            if ($disk->exists($r2Path)) {
                $fileSize = filesize($localPath);
                $fileSizeKB = round($fileSize / 1024, 2);
                $r2Url = R2Helper::url($r2Path);
                
                echo "✅ SUCCESS: {$filename}\n";
                echo "   Size: {$fileSizeKB} KB\n";
                echo "   R2 Path: {$r2Path}\n";
                echo "   R2 URL: {$r2Url}\n\n";
                $uploaded++;
            } else {
                throw new \Exception("File tidak ditemukan di R2 setelah upload");
            }
        } else {
            throw new \Exception("disk->put() returned false");
        }
        
    } catch (\Exception $e) {
        echo "❌ FAILED: {$filename}\n";
        echo "   Error: {$e->getMessage()}\n\n";
        $failed++;
        Log::error("Failed to upload Destination Cahaya image to R2", [
            'filename' => $filename,
            'r2Path' => $r2Path,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
}

echo "========================================\n";
echo "  Upload Summary\n";
echo "========================================\n";
echo "✅ Uploaded: {$uploaded}\n";
echo "⏭️  Skipped: {$skipped}\n";
echo "❌ Failed: {$failed}\n";
echo "📊 Total: " . count($destinationCahayaFiles) . "\n\n";

if ($uploaded > 0 || $skipped > 0) {
    echo "🔍 Verifying uploads...\n\n";
    
    try {
        $r2Files = $disk->files('public/images');
        $destinationCahayaInR2 = array_filter($r2Files, function($file) {
            return strpos($file, 'Destination Cahaya') !== false;
        });
        
        echo "📁 Files Destination Cahaya di R2:\n";
        foreach ($destinationCahayaInR2 as $file) {
            $url = R2Helper::url($file);
            echo "  ✓ {$file}\n";
            echo "    URL: {$url}\n";
        }
        
        if (empty($destinationCahayaInR2)) {
            echo "  (Tidak ada file Destination Cahaya ditemukan di R2)\n";
        }
        
    } catch (\Exception $e) {
        echo "⚠️  Warning: Gagal verifikasi - {$e->getMessage()}\n";
    }
}

echo "\n✨ Done!\n";
