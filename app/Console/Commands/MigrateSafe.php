<?php

namespace App\Console\Commands;

use Database\Seeders\LegacyB2cTravelPackagesSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigrateSafe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:safe {--force : Force the operation to run when in production}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrations with retry logic and graceful error handling';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $maxRetries = 3;
        $retryDelay = 5; // seconds
        
        $this->info('🔄 Starting safe migration...');
        
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                // Test database connection first
                $this->info("📋 Attempt $attempt/$maxRetries: Testing database connection...");
                
                DB::connection()->getPdo();
                $this->info("✅ Database connection established!");
                
                // Run migration
                $this->info("📋 Running migrations...");
                $exitCode = $this->call('migrate', [
                    '--force' => $this->option('force'),
                ]);
                
                if ($exitCode === 0) {
                    $this->info('✅ Migration completed successfully!');

                    try {
                        $this->info('📋 Syncing legacy B2C packages into database (idempotent, safe to re-run)...');
                        $this->call('db:seed', [
                            '--class' => LegacyB2cTravelPackagesSeeder::class,
                            '--force' => true,
                        ]);
                    } catch (\Throwable $e) {
                        Log::warning('MigrateSafe: LegacyB2cTravelPackagesSeeder failed', [
                            'error' => $e->getMessage(),
                        ]);
                        $this->warn('⚠️  Legacy B2C package seed skipped: '.$e->getMessage());
                    }

                    return 0;
                }
                
                // Migration failed but didn't throw exception
                if ($attempt < $maxRetries) {
                    $this->warn("⚠️  Migration failed. Retrying in {$retryDelay}s...");
                    sleep($retryDelay);
                }
                
            } catch (\PDOException $e) {
                // Database connection error
                if ($attempt === $maxRetries) {
                    $this->error("❌ Database connection failed after {$maxRetries} attempts");
                    $this->warn("⚠️  Error: " . $e->getMessage());
                    $this->warn("⚠️  Skipping migration - tables may already exist");
                    Log::warning('MigrateSafe: Database connection failed', [
                        'error' => $e->getMessage(),
                        'attempts' => $maxRetries
                    ]);
                    return 0; // Don't crash - return success so startup continues
                }
                
                $this->warn("⚠️  Database connection attempt $attempt/$maxRetries failed. Retrying in {$retryDelay}s...");
                Log::warning("MigrateSafe: Connection attempt $attempt failed", [
                    'error' => $e->getMessage()
                ]);
                sleep($retryDelay);
                
            } catch (\Throwable $e) {
                // Any other error
                if ($attempt === $maxRetries) {
                    $this->error("❌ Migration failed after {$maxRetries} attempts");
                    $this->warn("⚠️  Error: " . $e->getMessage());
                    $this->warn("⚠️  Skipping migration - application will continue");
                    Log::error('MigrateSafe: Migration failed', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    return 0; // Don't crash - return success so startup continues
                }
                
                $this->warn("⚠️  Migration attempt $attempt/$maxRetries failed. Retrying in {$retryDelay}s...");
                Log::warning("MigrateSafe: Migration attempt $attempt failed", [
                    'error' => $e->getMessage()
                ]);
                sleep($retryDelay);
            }
        }
        
        return 0; // Always return success to prevent crash loop
    }
}
