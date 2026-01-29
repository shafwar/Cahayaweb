<?php

/**
 * Verify Railway environment variables and connections (DB, R2).
 * Run in Railway context: railway run php scripts/verify-railway-env.php
 * Safe: does not print secret values.
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use App\Support\R2Helper;

function mask(string $value, int $visible = 4): string
{
    $len = strlen($value);
    if ($len <= $visible * 2) {
        return str_repeat('*', $len);
    }
    return substr($value, 0, $visible) . '***' . substr($value, -$visible);
}

function check(string $key, ?string $value, bool $required = true): array
{
    $set = $value !== null && $value !== '';
    $display = $set ? mask($value) : '(empty)';
    return ['key' => $key, 'set' => $set, 'display' => $display, 'required' => $required];
}

echo "=== Railway Environment Verification ===\n\n";

// 1. App & URL
$appVars = [
    check('APP_KEY', env('APP_KEY')),
    check('APP_URL', env('APP_URL')),
    check('ASSET_URL', env('ASSET_URL')),
    check('ZIGGY_URL', env('ZIGGY_URL')),
    check('APP_ENV', env('APP_ENV'), false),
    check('NIXPACKS_NODE_VERSION', env('NIXPACKS_NODE_VERSION'), false),
];

echo "1. App & URL\n";
foreach ($appVars as $v) {
    $status = $v['set'] ? '✓' : ($v['required'] ? '✗' : '○');
    echo "   {$status} {$v['key']}: {$v['display']}\n";
}
echo "\n";

// 2. Database
$dbVars = [
    check('DB_CONNECTION', env('DB_CONNECTION'), false),
    check('DB_HOST', env('DB_HOST'), false),
    check('DB_DATABASE', env('DB_DATABASE'), false),
    check('DB_USERNAME', env('DB_USERNAME'), false),
    check('DB_PASSWORD', env('DB_PASSWORD'), false),
];

echo "2. Database\n";
foreach ($dbVars as $v) {
    $status = $v['set'] ? '✓' : ($v['required'] ? '✗' : '○');
    echo "   {$status} {$v['key']}: {$v['display']}\n";
}

$dbOk = false;
try {
    DB::connection()->getPdo();
    $dbOk = true;
    echo "   ✓ DB connection: OK\n";
} catch (\Throwable $e) {
    echo "   ✗ DB connection: FAILED - " . $e->getMessage() . "\n";
}
echo "\n";

// 3. R2 (B2B document upload)
$r2Vars = [
    check('R2_ACCESS_KEY_ID', env('R2_ACCESS_KEY_ID') ?: env('AWS_ACCESS_KEY_ID'), false),
    check('R2_SECRET_ACCESS_KEY', env('R2_SECRET_ACCESS_KEY') ?: env('AWS_SECRET_ACCESS_KEY'), false),
    check('R2_BUCKET', env('R2_BUCKET') ?: env('AWS_BUCKET'), false),
    check('R2_URL', env('R2_URL') ?: env('AWS_URL'), false),
    check('R2_ENDPOINT', env('R2_ENDPOINT') ?: env('AWS_ENDPOINT'), false),
];

echo "3. R2 (B2B document upload)\n";
foreach ($r2Vars as $v) {
    $status = $v['set'] ? '✓' : '○';
    echo "   {$status} {$v['key']}: {$v['display']}\n";
}

$r2Configured = R2Helper::isR2DiskConfigured();
echo "   " . ($r2Configured ? "✓ R2 disk configured: YES (B2B docs will use R2)" : "○ R2 disk: NOT CONFIGURED (B2B docs will use local storage)") . "\n";

if ($r2Configured) {
    try {
        $disk = \Illuminate\Support\Facades\Storage::disk('r2');
        $agentFiles = $disk->allFiles('agent-verifications');
        echo "   ✓ R2 agent-verifications count: " . count($agentFiles) . "\n";
    } catch (\Throwable $e) {
        echo "   ✗ R2 list error: " . $e->getMessage() . "\n";
    }
}
echo "\n";

// 4. Admin
echo "4. Admin\n";
$adminEmails = env('APP_ADMIN_EMAILS');
$adminSet = $adminEmails !== null && $adminEmails !== '';
echo "   " . ($adminSet ? '✓ APP_ADMIN_EMAILS: SET' : '○ APP_ADMIN_EMAILS: (empty)') . "\n";
echo "\n";

// 5. Summary & recommendations
echo "=== Summary ===\n";
$missingRequired = [];
if (!env('APP_KEY')) {
    $missingRequired[] = 'APP_KEY';
}
if (!env('APP_URL')) {
    $missingRequired[] = 'APP_URL';
}

if (count($missingRequired) > 0) {
    echo "✗ Missing required: " . implode(', ', $missingRequired) . "\n";
} else {
    echo "✓ Required app variables present\n";
}

if (!$dbOk && env('DB_CONNECTION') === 'mysql') {
    echo "✗ Database (MySQL) connection failed. Check DB_* variables and MySQL service.\n";
} elseif ($dbOk) {
    echo "✓ Database connection OK\n";
}

if (!$r2Configured) {
    echo "○ R2 not configured. B2B document uploads will use local storage; admin download may fail if files are not on this instance.\n";
    echo "  To enable R2: set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_URL, R2_ENDPOINT in Railway variables.\n";
} else {
    echo "✓ R2 configured. B2B documents will be stored in R2 and admin can download via Laravel.\n";
}

echo "\n=== Done ===\n";
