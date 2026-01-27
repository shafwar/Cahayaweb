import { router } from '@inertiajs/react';

let isLoggingOut = false;

/**
 * Reliable logout function using Inertia router
 * This prevents Page Expired errors by using Inertia's built-in CSRF handling
 */
export function logout() {
    if (isLoggingOut) {
        console.warn('Logout already in progress');
        return;
    }

    isLoggingOut = true;

    try {
        // Use Inertia router.post for logout - this handles CSRF automatically
        // and prevents Page Expired errors
        router.post('/logout', {}, {
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                // Logout successful - redirect will be handled by backend
                isLoggingOut = false;
            },
            onError: (errors) => {
                console.warn('Logout error:', errors);
                isLoggingOut = false;
                
                // If CSRF error or any error, just redirect to home
                // This ensures user is logged out even if there's an error
                const errorMessage = errors?.message || (typeof errors === 'string' ? errors : '') || '';
                const errorString = JSON.stringify(errors || {});
                
                if (
                    errorMessage.includes('419') || 
                    errorMessage.includes('expired') || 
                    errorMessage.includes('PAGE EXPIRED') ||
                    errorString.includes('419') ||
                    errorString.includes('expired')
                ) {
                    // CSRF expired - just redirect to home (user is likely already logged out)
                    window.location.href = '/';
                } else {
                    // Other error - still redirect to home
                    window.location.href = '/';
                }
            },
            onFinish: () => {
                // Always reset flag when request finishes
                isLoggingOut = false;
            },
        });
    } catch (error) {
        console.error('Logout error:', error);
        isLoggingOut = false;
        // Last resort: just redirect to home
        // This ensures user can always logout even if there's an error
        window.location.href = '/';
    }
}
