<?php

/**
 * List B2B agent-verification documents in R2 and optionally sync from local storage.
 * Run: php scripts/agent-verifications-r2.php [--sync]
 * - Without --sync: only list R2 contents and DB file paths.
 * - With --sync: upload missing files from local public disk to R2 (for existing submissions).
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use App\Support\R2Helper;
use App\Models\AgentVerification;

$doSync = in_array('--sync', $argv ?? [], true);

echo "=== B2B Agent Verifications – R2 ===\n\n";

if (!R2Helper::isR2DiskConfigured()) {
    echo "✗ R2 disk is not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_URL, R2_ENDPOINT in .env\n";
    exit(1);
}

$r2Disk = Storage::disk('r2');
$root = config('filesystems.disks.r2.root', 'public');
$prefix = trim($root . '/agent-verifications', '/'); // path under bucket: public/agent-verifications

echo "1. R2 config\n";
echo "   - Root: {$root}\n";
echo "   - Prefix for B2B docs: {$prefix}\n\n";

echo "2. Files in R2 under agent-verifications\n";
try {
    // With root 'public', path 'agent-verifications' lists keys like public/agent-verifications/...
    $files = $r2Disk->allFiles('agent-verifications');
    echo "   - Count: " . count($files) . "\n";
    if (count($files) > 0) {
        foreach (array_slice($files, 0, 20) as $f) {
            echo "     * {$f}\n";
        }
        if (count($files) > 20) {
            echo "     ... and " . (count($files) - 20) . " more\n";
        }
    } else {
        echo "   - No files yet. New B2B submissions will be stored here (public/agent-verifications/).\n";
    }
} catch (\Throwable $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n";
}
echo "\n";

echo "3. File paths from database (agent_verifications)\n";
$pathsFromDb = [];
try {
    $verifications = AgentVerification::query()
        ->select('id', 'company_name', 'business_license_file', 'tax_certificate_file', 'company_profile_file')
        ->get();

    foreach ($verifications as $v) {
        foreach (['business_license_file', 'tax_certificate_file', 'company_profile_file'] as $field) {
            $path = $v->{$field};
            if (!empty($path)) {
                $pathsFromDb[] = ['verification_id' => $v->id, 'company' => $v->company_name, 'path' => $path];
            }
        }
    }
} catch (\Throwable $e) {
    echo "   - Database unavailable: " . $e->getMessage() . "\n\n";
}

echo "   - Total file references: " . count($pathsFromDb) . "\n";
if (count($pathsFromDb) > 0) {
foreach (array_slice($pathsFromDb, 0, 15) as $p) {
    $onR2 = $r2Disk->exists($p['path']);
    $onLocal = Storage::disk('public')->exists($p['path']);
    $status = $onR2 ? 'R2' : ($onLocal ? 'local' : 'MISSING');
    echo "     [{$status}] id={$p['verification_id']} {$p['path']}\n";
}
if (count($pathsFromDb) > 15) {
    echo "     ... and " . (count($pathsFromDb) - 15) . " more\n";
}
}
echo "\n";

if ($doSync) {
    echo "4. Sync: upload from local public disk to R2 (missing only)\n";
    $uploaded = 0;
    $failed = 0;
    foreach ($pathsFromDb as $p) {
        $path = $p['path'];
        if ($r2Disk->exists($path)) {
            continue;
        }
        if (!Storage::disk('public')->exists($path)) {
            echo "   - Skip (not on local): {$path}\n";
            continue;
        }
        try {
            $contents = Storage::disk('public')->get($path);
            $r2Disk->put($path, $contents);
            echo "   ✓ Uploaded: {$path}\n";
            $uploaded++;
        } catch (\Throwable $e) {
            echo "   ✗ Failed {$path}: " . $e->getMessage() . "\n";
            $failed++;
        }
    }
    echo "   - Uploaded: {$uploaded}, Failed: {$failed}\n\n";
} else {
    echo "4. To upload existing local files to R2, run: php scripts/agent-verifications-r2.php --sync\n\n";
}

echo "=== Done ===\n";
