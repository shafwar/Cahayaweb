import { router } from '@inertiajs/react';

let isLoggingOut = false;
let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if logout is currently in progress
 */
export function isLogoutInProgress(): boolean {
    return isLoggingOut;
}

/**
 * Reliable logout function with comprehensive error handling
 * Handles network errors, CSRF errors, and ensures logout always succeeds
 */
export function logout() {
    // Prevent multiple simultaneous logout attempts
    if (isLoggingOut) {
        console.warn('[Logout] Already in progress, ignoring duplicate call');
        return;
    }

    isLoggingOut = true;

    // Clear any existing timeout
    if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        logoutTimeout = null;
    }

    // Set a safety timeout: if logout doesn't complete in 10 seconds, force redirect
    logoutTimeout = setTimeout(() => {
        console.warn('[Logout] Timeout - forcing redirect to home');
        isLoggingOut = false;
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            logoutTimeout = null;
        }
        window.location.href = '/';
    }, 10000);

    const resetLogoutState = () => {
        isLoggingOut = false;
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            logoutTimeout = null;
        }
    };

    try {
        // Use router.post which handles CSRF automatically
        const logoutPromise = router.post('/logout', {}, {
            preserveState: false,
            preserveScroll: false,
            onStart: () => {
                console.log('[Logout] Logout request started');
            },
            onSuccess: () => {
                console.log('[Logout] Logout successful - redirecting...');
                resetLogoutState();
                // Backend will handle redirect via Inertia::location('/')
            },
            onError: (errors) => {
                console.warn('[Logout] Logout error from server:', errors);
                resetLogoutState();
                
                // Always redirect to home on any error
                // User is likely already logged out server-side
                const errorMessage = errors?.message || (typeof errors === 'string' ? errors : '') || '';
                const errorString = JSON.stringify(errors || {});
                
                const isCsrfError = 
                    errorMessage.includes('419') || 
                    errorMessage.includes('expired') || 
                    errorMessage.includes('PAGE EXPIRED') ||
                    errorString.includes('419') ||
                    errorString.includes('expired') ||
                    errorString.includes('csrf') ||
                    errorString.includes('token');
                
                if (isCsrfError) {
                    console.log('[Logout] CSRF error - redirecting to home (user likely already logged out)');
                } else {
                    console.log('[Logout] Other error - redirecting to home');
                }
                
                // Force redirect to home
                window.location.href = '/';
            },
            onFinish: () => {
                console.log('[Logout] Request finished');
                resetLogoutState();
            },
        });

        // Handle network errors (ERR_NETWORK, AxiosError) that router.post might not catch
        if (logoutPromise && typeof logoutPromise.catch === 'function') {
            logoutPromise.catch((err: unknown) => {
                console.error('[Logout] Network or request error:', err);
                resetLogoutState();
                // Force redirect on network error
                window.location.href = '/';
            });
        }
    } catch (error) {
        console.error('[Logout] Fatal error during logout:', error);
        resetLogoutState();
        // Last resort: force redirect to home
        // This ensures user can always logout even if there's a fatal error
        window.location.href = '/';
    }
}
