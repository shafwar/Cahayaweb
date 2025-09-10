<?php

namespace App\Policies;

use App\Models\Package;
use App\Models\User;

class B2BPackagePolicy
{
    /**
     * Determine whether the user can view any packages.
     */
    public function viewAny(User $user): bool
    {
        return $user->isB2B() && $user->isVerified();
    }

    /**
     * Determine whether the user can view the package.
     */
    public function view(User $user, Package $package): bool
    {
        return $user->isB2B() && $user->isVerified();
    }

    /**
     * Determine whether the user can purchase the package.
     */
    public function purchase(User $user, Package $package): bool
    {
        return $user->isB2B() && $user->isVerified();
    }

    /**
     * Determine whether the user can access B2B pricing.
     */
    public function accessB2BPricing(User $user, Package $package): bool
    {
        return $user->isB2B() && $user->isVerified();
    }

    /**
     * Get the failure message for unauthorized access.
     */
    public function getFailureMessage(User $user): string
    {
        if (!$user->isB2B()) {
            return 'This feature is only available for B2B users.';
        }

        if (!$user->isVerified()) {
            $status = $user->b2bVerification?->status ?? 'pending';

            if ($status === 'rejected') {
                return 'Your B2B account has been rejected. Please contact support for assistance.';
            }

            return 'Your B2B account is pending verification. You cannot access packages until approved.';
        }

        return 'Access denied.';
    }
}
