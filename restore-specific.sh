#!/bin/bash

# Restore to SPECIFIC version (not just latest)

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔍 RESTORE TO SPECIFIC VERSION - Choose Your Image       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

php artisan tinker --execute="
use App\Models\Section;
use App\Models\SectionRevision;

echo '📜 ALL AVAILABLE VERSIONS FOR UMRAH PREMIUM:' . PHP_EOL;
echo str_repeat('═', 75) . PHP_EOL;

\$revisions = SectionRevision::where('key', 'home.hero.1.image')
    ->orderBy('created_at', 'asc')
    ->get();

foreach (\$revisions as \$idx => \$rev) {
    echo PHP_EOL;
    echo '  [' . \$rev->id . '] Version #' . (\$idx + 1) . ':' . PHP_EOL;
    echo '      File: ' . basename(\$rev->image) . PHP_EOL;
    echo '      Date: ' . \$rev->created_at->format('Y-m-d H:i:s') . PHP_EOL;
    echo '      Time: ' . \$rev->created_at->diffForHumans() . PHP_EOL;
    echo '      By: ' . \$rev->changed_by . PHP_EOL;
    echo '      Type: ' . \$rev->change_type . PHP_EOL;
}

echo PHP_EOL . str_repeat('═', 75) . PHP_EOL;

\$current = Section::where('key', 'home.hero.1.image')->first();
echo PHP_EOL . '📍 CURRENT IMAGE: ' . basename(\$current->image) . PHP_EOL;
echo str_repeat('═', 75) . PHP_EOL;
"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Enter REVISION ID yang Anda mau restore                   ║"
echo "║  (Pilih dari list [ID] di atas)                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
read -p "Enter Revision ID (atau 0 untuk cancel): " revId

if [ "$revId" == "0" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "🔄 Restoring to revision ID: $revId..."
echo ""

php artisan tinker --execute="
use App\Models\Section;
use App\Models\SectionRevision;

\$revisionId = $revId;
\$revision = SectionRevision::find(\$revisionId);

if (!\$revision) {
    echo '❌ Revision ID tidak ditemukan!' . PHP_EOL;
    exit(1);
}

\$section = Section::where('key', 'home.hero.1.image')->first();
\$beforeImage = \$section->image;

echo 'Target Revision:' . PHP_EOL;
echo '  ID: ' . \$revision->id . PHP_EOL;
echo '  File: ' . basename(\$revision->image) . PHP_EOL;
echo '  Date: ' . \$revision->created_at->format('Y-m-d H:i:s') . PHP_EOL;
echo PHP_EOL;

echo 'Current Image: ' . basename(\$beforeImage) . PHP_EOL;
echo PHP_EOL;

// Execute restore
\$section->restoreFromRevision(\$revisionId);
\$section->refresh();

\$afterImage = \$section->image;

echo '✅ RESTORE COMPLETE!' . PHP_EOL;
echo '   From: ' . basename(\$beforeImage) . PHP_EOL;
echo '   To:   ' . basename(\$afterImage) . PHP_EOL;
echo PHP_EOL;

if (\$beforeImage !== \$afterImage) {
    echo '✅ Image CHANGED!' . PHP_EOL;
} else {
    echo '⚠️  Same image (selected version had same file)' . PHP_EOL;
}
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 SEKARANG BUKA BROWSER:"
echo ""
echo "   1. CLOSE semua tabs"
echo "   2. CLEAR cache: Ctrl+Shift+Delete → All time → Clear"
echo "   3. CLOSE browser completely"
echo "   4. OPEN fresh: http://cahayaweb.test/home"
echo "   5. Check Console - filename harus match!"
echo ""
echo "✅ Database telah diupdate!"
echo "✅ Gambar akan berubah setelah clear cache!"
echo ""

