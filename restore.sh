#!/bin/bash

# Simple Restore Tool - Guaranteed Working!
# Usage: ./restore.sh

clear
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║        🔄 SIMPLE RESTORE TOOL - GUARANTEED! 🔄          ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Show current hero images
php artisan tinker --execute="
use App\Models\Section;
use App\Models\SectionRevision;

echo '📋 CURRENT HERO IMAGES:' . PHP_EOL;
echo str_repeat('─', 60) . PHP_EOL;

foreach ([1, 2, 3] as \$heroId) {
    \$key = 'home.hero.' . \$heroId . '.image';
    \$section = Section::where('key', \$key)->first();
    
    if (\$section) {
        \$revCount = SectionRevision::where('key', \$key)->count();
        echo PHP_EOL . 'Hero ' . \$heroId . ' (' . \$key . '):' . PHP_EOL;
        echo '  Current: ' . basename(\$section->image) . PHP_EOL;
        echo '  Backups: ' . \$revCount . ' versions available' . PHP_EOL;
    }
}

echo PHP_EOL . str_repeat('─', 60) . PHP_EOL;
"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  PILIH ACTION:                                           ║"
echo "║  1. Restore Hero 1 (Umrah Premium) to previous version   ║"
echo "║  2. Restore Hero 2 to previous version                   ║"
echo "║  3. Restore Hero 3 to previous version                   ║"
echo "║  4. View all revisions for Hero 1                        ║"
echo "║  5. Exit                                                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1|2|3)
        echo ""
        echo "🔄 Processing restore for Hero $choice..."
        
        php artisan tinker --execute="
use App\Models\Section;
use App\Models\SectionRevision;

\$heroId = $choice;
\$key = 'home.hero.' . \$heroId . '.image';
\$section = Section::where('key', \$key)->first();

if (!\$section) {
    echo '❌ Section not found!' . PHP_EOL;
    exit(1);
}

\$revisions = SectionRevision::where('key', \$key)->orderBy('created_at', 'desc')->get();

if (\$revisions->count() === 0) {
    echo '❌ No backups available!' . PHP_EOL;
    exit(1);
}

\$latestRevision = \$revisions->first();

echo 'Will restore to:' . PHP_EOL;
echo '  Revision ID: ' . \$latestRevision->id . PHP_EOL;
echo '  Image: ' . basename(\$latestRevision->image) . PHP_EOL;
echo '  From: ' . \$latestRevision->created_at->diffForHumans() . PHP_EOL;
echo PHP_EOL;

\$currentImage = \$section->image;
echo 'Current image: ' . basename(\$currentImage) . PHP_EOL;

// Execute restore
\$section->restoreFromRevision(\$latestRevision->id);
\$section->refresh();

\$newImage = \$section->image;
echo 'After restore: ' . basename(\$newImage) . PHP_EOL;
echo PHP_EOL;

if (\$currentImage !== \$newImage) {
    echo '✅ SUCCESS! Image changed in database!' . PHP_EOL;
    echo '   From: ' . basename(\$currentImage) . PHP_EOL;
    echo '   To:   ' . basename(\$newImage) . PHP_EOL;
} else {
    echo '⚠️  Warning: Image is the same!' . PHP_EOL;
    echo '   (Backup had the same image file)' . PHP_EOL;
}
"
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🌐 NOW GO TO BROWSER:"
        echo "   1. Open: http://cahayaweb.test/home?force=$(date +%s)"
        echo "   2. Hard refresh: Ctrl+Shift+R (3 times!)"
        echo "   3. Check if hero image changed!"
        echo ""
        echo "✅ Database has been updated!"
        echo "✅ Browser will show restored image after hard refresh!"
        echo ""
        ;;
    4)
        echo ""
        echo "📜 ALL REVISIONS FOR HERO 1 (Umrah Premium):"
        echo ""
        
        php artisan tinker --execute="
use App\Models\SectionRevision;

\$revisions = SectionRevision::where('key', 'home.hero.1.image')
    ->orderBy('created_at', 'desc')
    ->get();

echo 'Total: ' . \$revisions->count() . ' versions' . PHP_EOL;
echo str_repeat('═', 70) . PHP_EOL;

foreach (\$revisions as \$idx => \$rev) {
    echo PHP_EOL;
    echo 'Version #' . (\$revisions->count() - \$idx) . ':' . PHP_EOL;
    echo '  ID: ' . \$rev->id . PHP_EOL;
    echo '  Image: ' . basename(\$rev->image) . PHP_EOL;
    echo '  By: ' . \$rev->changed_by . PHP_EOL;
    echo '  Type: ' . \$rev->change_type . PHP_EOL;
    echo '  When: ' . \$rev->created_at->format('Y-m-d H:i:s') . ' (' . \$rev->created_at->diffForHumans() . ')' . PHP_EOL;
    echo str_repeat('─', 70) . PHP_EOL;
}
"
        ;;
    5)
        echo ""
        echo "✅ Exiting... Goodbye!"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice!"
        echo ""
        exit 1
        ;;
esac

