<?php
/**
 * Manual Image Restore Tool
 * Run: php restore-image.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Section;
use App\Models\SectionRevision;

echo "╔══════════════════════════════════════════════════════════╗\n";
echo "║                                                          ║\n";
echo "║        🔄 MANUAL IMAGE RESTORE TOOL 🔄                  ║\n";
echo "║                                                          ║\n";
echo "╚══════════════════════════════════════════════════════════╝\n\n";

// Get all hero images
$heroKeys = ['home.hero.1.image', 'home.hero.2.image', 'home.hero.3.image'];

echo "📋 Current Hero Images:\n";
echo str_repeat('─', 60) . "\n";

foreach ($heroKeys as $key) {
    $section = Section::where('key', $key)->first();
    if ($section) {
        echo "\n$key:\n";
        echo "  Current: " . basename($section->image) . "\n";
        echo "  Updated: " . $section->updated_at->format('Y-m-d H:i:s') . "\n";
        
        $revisions = SectionRevision::where('key', $key)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
            
        if ($revisions->count() > 0) {
            echo "  Available versions:\n";
            foreach ($revisions as $i => $rev) {
                echo "    [" . $rev->id . "] " . basename($rev->image) . " (" . $rev->created_at->diffForHumans() . ")\n";
            }
        }
    }
}

echo "\n" . str_repeat('─', 60) . "\n";
echo "\n❓ Pilih action:\n";
echo "  1. Restore home.hero.1.image to previous version\n";
echo "  2. Restore home.hero.2.image to previous version\n";
echo "  3. Restore home.hero.3.image to previous version\n";
echo "  4. Exit\n\n";

$choice = (int) readline("Enter choice (1-4): ");

if ($choice >= 1 && $choice <= 3) {
    $key = $heroKeys[$choice - 1];
    $section = Section::where('key', $key)->first();
    $revisions = SectionRevision::where('key', $key)->orderBy('created_at', 'desc')->get();
    
    if ($revisions->count() === 0) {
        echo "\n❌ No revisions available for $key\n";
        exit(1);
    }
    
    $latestRev = $revisions->first();
    
    echo "\n🔄 Will restore to:\n";
    echo "   Image: " . basename($latestRev->image) . "\n";
    echo "   From: " . $latestRev->created_at->diffForHumans() . "\n\n";
    
    $confirm = readline("Confirm restore? (yes/no): ");
    
    if (strtolower($confirm) === 'yes') {
        $section->restoreFromRevision($latestRev->id);
        $section->refresh();
        
        echo "\n✅ SUCCESS!\n";
        echo "   Restored to: " . basename($section->image) . "\n";
        echo "   Updated at: " . $section->updated_at->format('H:i:s') . "\n";
        echo "\n🌐 Now refresh browser (Ctrl+Shift+R) to see changes!\n";
        echo "   URL: http://cahayaweb.test/home?refresh=" . time() . "\n\n";
    } else {
        echo "\n❌ Restore cancelled\n";
    }
} else {
    echo "\n✅ Exiting...\n";
}

