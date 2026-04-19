import { router } from '@inertiajs/react';
import axios from 'axios';

import { fetchFreshCsrfToken } from '@/lib/csrf';

let isLoggingOut = false;
let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

export function isLogoutInProgress(): boolean {
    return isLoggingOut;
}

/**
 * Same CSRF-refresh-first strategy as useLogout (for any non-hook callers).
 */
export function logout(): void {
    if (isLoggingOut) {
        console.warn('[Logout] Already in progress, ignoring duplicate call');
        return;
    }

    isLoggingOut = true;

    if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        logoutTimeout = null;
    }

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

    void (async () => {
        try {
            let token = await fetchFreshCsrfToken();
            if (!token) {
                token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
            }
            if (token) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
            }

            router.post(
                '/logout',
                token ? { _token: token } : {},
                {
                    preserveState: false,
                    preserveScroll: false,
                    onSuccess: () => {
                        resetLogoutState();
                    },
                    onError: () => {
                        void fetchFreshCsrfToken().then((t2) => {
                            if (t2) {
                                router.post(
                                    '/logout',
                                    { _token: t2 },
                                    {
                                        preserveState: false,
                                        preserveScroll: false,
                                        onSuccess: () => resetLogoutState(),
                                        onError: () => {
                                            window.location.href = '/';
                                            resetLogoutState();
                                        },
                                    },
                                );
                            } else {
                                window.location.href = '/';
                                resetLogoutState();
                            }
                        });
                    },
                },
            );
        } catch (error) {
            console.error('[Logout] Fatal error during logout:', error);
            window.location.href = '/';
            resetLogoutState();
        }
    })();
}
