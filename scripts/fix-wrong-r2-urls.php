<?php

/**
 * Script untuk fix URL gambar yang salah di database sections
 * Mengkonversi URL dengan domain salah (cahayaanbiya.com) ke R2 URL yang benar (assets.cahayaanbiya.com)
 * 
 * Menjalankan: php scripts/fix-wrong-r2-urls.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Section;
use App\Support\R2Helper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "========================================\n";
echo "  Fix Wrong R2 URLs in Database\n";
echo "========================================\n\n";

// Find all sections with wrong URLs
// Use case-insensitive search and handle both patterns
$sections = Section::all()->filter(function($section) {
    $image = $section->image ?? '';
    $video = $section->video ?? '';
    
    // Check if URL contains wrong domain (cahayaanbiya.com but not assets.cahayaanbiya.com)
    $hasWrongImage = !empty($image) && 
                     stripos($image, 'cahayaanbiya.com') !== false && 
                     stripos($image, 'assets.cahayaanbiya.com') === false &&
                     (stripos($image, '/public/images') !== false || stripos($image, '/public/videos') !== false);
    
    $hasWrongVideo = !empty($video) && 
                     stripos($video, 'cahayaanbiya.com') !== false && 
                     stripos($video, 'assets.cahayaanbiya.com') === false &&
                     (stripos($video, '/public/images') !== false || stripos($video, '/public/videos') !== false);
    
    return $hasWrongImage || $hasWrongVideo;
});

echo "📋 Found " . $sections->count() . " sections with wrong URLs\n\n";

if ($sections->count() === 0) {
    echo "✅ No sections with wrong URLs found. Database is clean!\n";
    exit(0);
}

$fixed = 0;
$failed = 0;

foreach ($sections as $section) {
    $updated = false;
    $originalImage = $section->image;
    $originalVideo = $section->video;
    
    try {
        // Fix image URL
        if ($section->image && (str_contains($section->image, 'cahayaanbiya.com') && !str_contains($section->image, 'assets.cahayaanbiya.com'))) {
            // Extract path from wrong URL
            $url = parse_url($section->image);
            $path = $url['path'] ?? '';
            $cleanPath = ltrim($path, '/');
            
            // Convert to R2 URL using R2Helper
            $r2Url = R2Helper::url($cleanPath);
            
            if ($r2Url && $r2Url !== $section->image) {
                $section->image = $r2Url;
                $updated = true;
                echo "✅ Fixed image URL for section: {$section->key}\n";
                echo "   Old: {$originalImage}\n";
                echo "   New: {$r2Url}\n\n";
            }
        }
        
        // Fix video URL
        if ($section->video && (str_contains($section->video, 'cahayaanbiya.com') && !str_contains($section->video, 'assets.cahayaanbiya.com'))) {
            // Extract path from wrong URL
            $url = parse_url($section->video);
            $path = $url['path'] ?? '';
            $cleanPath = ltrim($path, '/');
            
            // Convert to R2 URL using R2Helper
            $r2Url = R2Helper::url($cleanPath);
            
            if ($r2Url && $r2Url !== $section->video) {
                $section->video = $r2Url;
                $updated = true;
                echo "✅ Fixed video URL for section: {$section->key}\n";
                echo "   Old: {$originalVideo}\n";
                echo "   New: {$r2Url}\n\n";
            }
        }
        
        if ($updated) {
            $section->save();
            $fixed++;
        }
        
    } catch (\Exception $e) {
        echo "❌ Failed to fix section: {$section->key}\n";
        echo "   Error: {$e->getMessage()}\n\n";
        $failed++;
        Log::error('Failed to fix wrong R2 URL in section', [
            'key' => $section->key,
            'error' => $e->getMessage()
        ]);
    }
}

echo "========================================\n";
echo "  Fix Summary\n";
echo "========================================\n";
echo "✅ Fixed: {$fixed}\n";
echo "❌ Failed: {$failed}\n";
echo "📊 Total: " . $sections->count() . "\n\n";

if ($fixed > 0) {
    echo "✨ Database updated successfully!\n";
    echo "💡 Clear cache: php artisan cache:clear\n";
}
