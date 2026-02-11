<?php

namespace App\Console\Commands;

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
        $maxRetries = 10; // Increase retries
        $retryDelay = 5; // seconds
        
        $this->info('🔄 Starting safe migration...');
        
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                // Test database connection first with longer timeout
                $this->info("📋 Attempt $attempt/$maxRetries: Testing database connection...");
                
                // Set connection timeout
                $pdo = DB::connection()->getPdo();
                
                // Test with a simple query
                DB::select('SELECT 1');
                
                $this->info("✅ Database connection established!");
                
                // Wait a bit to ensure connection is stable
                sleep(2);
                
                // Run migration
                $this->info("📋 Running migrations...");
                $exitCode = $this->call('migrate', [
                    '--force' => $this->option('force'),
                ]);
                
                if ($exitCode === 0) {
                    $this->info("✅ Migration completed successfully!");
                    return 0;
                }
                
                // Migration failed but didn't throw exception
                if ($attempt < $maxRetries) {
                    $this->warn("⚠️  Migration failed. Retrying in {$retryDelay}s...");
                    sleep($retryDelay);
                }
                
            } catch (\PDOException $e) {
                // Database connection error
                $errorCode = $e->getCode();
                $errorMessage = $e->getMessage();
                
                // Check if it's "MySQL server has gone away" or connection error
                if (str_contains($errorMessage, 'MySQL server has gone away') || 
                    str_contains($errorMessage, '2006') ||
                    str_contains($errorMessage, 'Connection refused') ||
                    str_contains($errorMessage, 'Can\'t connect')) {
                    
                    if ($attempt === $maxRetries) {
                        $this->error("❌ Database connection failed after {$maxRetries} attempts");
                        $this->warn("⚠️  Error: " . $errorMessage);
                        $this->warn("⚠️  Skipping migration - MySQL service may be starting up");
                        $this->warn("⚠️  Application will start without migration");
                        Log::warning('MigrateSafe: Database connection failed - MySQL may be starting', [
                            'error' => $errorMessage,
                            'code' => $errorCode,
                            'attempts' => $maxRetries
                        ]);
                        return 0; // Don't crash - return success so startup continues
                    }
                    
                    $this->warn("⚠️  Database connection attempt $attempt/$maxRetries failed. Retrying in {$retryDelay}s...");
                    $this->warn("   Error: " . $errorMessage);
                    Log::warning("MigrateSafe: Connection attempt $attempt failed", [
                        'error' => $errorMessage,
                        'code' => $errorCode
                    ]);
                    sleep($retryDelay);
                    continue;
                }
                
                // Other PDO errors - still retry
                if ($attempt === $maxRetries) {
                    $this->error("❌ Database error after {$maxRetries} attempts");
                    $this->warn("⚠️  Error: " . $errorMessage);
                    $this->warn("⚠️  Skipping migration - application will continue");
                    Log::error('MigrateSafe: Database error', [
                        'error' => $errorMessage,
                        'code' => $errorCode
                    ]);
                    return 0;
                }
                
                $this->warn("⚠️  Database error on attempt $attempt/$maxRetries. Retrying in {$retryDelay}s...");
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
        
        $this->warn("⚠️  Migration skipped after {$maxRetries} attempts - application will start");
        return 0; // Always return success to prevent crash loop
    }
}
