<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\B2BVerification;
use App\Notifications\B2BApprovalNotification;
use App\Notifications\B2BRejectionNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class B2BVerificationService
{
    /**
     * Approve a B2B verification request.
     */
    public function approve(B2BVerification $verification, User $admin, ?string $reason = null): bool
    {
        return DB::transaction(function () use ($verification, $admin, $reason) {
            try {
                // Update verification status
                $verification->update([
                    'status' => 'approved',
                    'admin_notes' => $reason ?? 'Approved by admin',
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                ]);

                // Update user verification status
                $verification->user->update([
                    'is_verified' => true,
                ]);

                // Create audit log
                AuditLog::create([
                    'admin_id' => $admin->id,
                    'user_id' => $verification->user_id,
                    'action' => 'approve',
                    'model_type' => B2BVerification::class,
                    'model_id' => $verification->id,
                    'reason' => $reason,
                    'metadata' => [
                        'company_name' => $verification->company_name,
                        'approved_at' => now()->toISOString(),
                    ],
                ]);

                // Send notification
                $verification->user->notify(new B2BApprovalNotification($admin, $reason));

                Log::info('B2B verification approved', [
                    'verification_id' => $verification->id,
                    'user_id' => $verification->user_id,
                    'admin_id' => $admin->id,
                    'company_name' => $verification->company_name,
                ]);

                return true;
            } catch (\Exception $e) {
                Log::error('Failed to approve B2B verification', [
                    'verification_id' => $verification->id,
                    'error' => $e->getMessage(),
                ]);
                
                throw $e;
            }
        });
    }

    /**
     * Reject a B2B verification request.
     */
    public function reject(B2BVerification $verification, User $admin, string $reason): bool
    {
        return DB::transaction(function () use ($verification, $admin, $reason) {
            try {
                // Update verification status
                $verification->update([
                    'status' => 'rejected',
                    'admin_notes' => $reason,
                    'rejected_at' => now(),
                    'rejected_by' => $admin->id,
                ]);

                // Update user verification status
                $verification->user->update([
                    'is_verified' => false,
                ]);

                // Create audit log
                AuditLog::create([
                    'admin_id' => $admin->id,
                    'user_id' => $verification->user_id,
                    'action' => 'reject',
                    'model_type' => B2BVerification::class,
                    'model_id' => $verification->id,
                    'reason' => $reason,
                    'metadata' => [
                        'company_name' => $verification->company_name,
                        'rejected_at' => now()->toISOString(),
                    ],
                ]);

                // Send notification
                $verification->user->notify(new B2BRejectionNotification($admin, $reason));

                Log::info('B2B verification rejected', [
                    'verification_id' => $verification->id,
                    'user_id' => $verification->user_id,
                    'admin_id' => $admin->id,
                    'company_name' => $verification->company_name,
                    'reason' => $reason,
                ]);

                return true;
            } catch (\Exception $e) {
                Log::error('Failed to reject B2B verification', [
                    'verification_id' => $verification->id,
                    'error' => $e->getMessage(),
                ]);
                
                throw $e;
            }
        });
    }

    /**
     * Get verification statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total' => B2BVerification::count(),
            'pending' => B2BVerification::where('status', 'pending')->count(),
            'approved' => B2BVerification::where('status', 'approved')->count(),
            'rejected' => B2BVerification::where('status', 'rejected')->count(),
        ];
    }

    /**
     * Get recent audit logs for a user.
     */
    public function getUserAuditLogs(User $user, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return AuditLog::where('user_id', $user->id)
            ->with('admin')
            ->latest()
            ->limit($limit)
            ->get();
    }
}
