import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState, useCallback } from 'react';

let globalIsLoggingOut = false;
let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Reliable logout hook with comprehensive error handling
 * Returns logout function and loading state for UI
 */
export function useLogout() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const page = usePage();

    const resetLogoutState = useCallback(() => {
        globalIsLoggingOut = false;
        setIsLoggingOut(false);
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            logoutTimeout = null;
        }
    }, []);

    const logout = useCallback(() => {
        // Prevent multiple simultaneous logout attempts
        if (globalIsLoggingOut) {
            console.warn('[Logout] Already in progress, ignoring duplicate call');
            return;
        }

        globalIsLoggingOut = true;
        setIsLoggingOut(true);

        // Clear any existing timeout
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            logoutTimeout = null;
        }

        // Set a safety timeout: if logout doesn't complete in 10 seconds, force redirect
        logoutTimeout = setTimeout(() => {
            console.warn('[Logout] Timeout - forcing redirect to home');
            resetLogoutState();
            window.location.href = '/';
        }, 10000);

        try {
            const fromProps = (page.props as { csrf_token?: string }).csrf_token;
            const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
            const token =
                typeof fromProps === 'string' && fromProps.length > 0 ? fromProps : (meta?.content ?? '');
            if (token && meta) {
                meta.setAttribute('content', token);
            }
            if (token) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
            }

            const logoutPromise = router.post(
                '/logout',
                token ? { _token: token } : {},
                {
                    preserveState: false,
                    preserveScroll: false,
                    onStart: () => {
                        console.log('[Logout] Logout request started');
                    },
                    onSuccess: () => {
                        console.log('[Logout] Logout successful - redirecting...');
                        resetLogoutState();
                    },
                    onError: (errors) => {
                        console.warn('[Logout] Logout error from server:', errors);
                        resetLogoutState();

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

                        window.location.href = '/';
                    },
                    onFinish: () => {
                        console.log('[Logout] Request finished');
                        resetLogoutState();
                    },
                },
            );

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
            window.location.href = '/';
        }
    }, [page.props, resetLogoutState]);

    return { logout, isLoggingOut };
}
