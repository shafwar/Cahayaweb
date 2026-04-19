import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { fetchFreshCsrfToken } from '@/lib/csrf';

let globalIsLoggingOut = false;
let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Reliable logout: always refreshes CSRF from GET /auth/csrf-token before POST /logout
 * so admin/B2B flows (delete, long idle, session rotation) cannot leave a stale token → 419.
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
        if (globalIsLoggingOut) {
            console.warn('[Logout] Already in progress, ignoring duplicate call');
            return;
        }

        globalIsLoggingOut = true;
        setIsLoggingOut(true);

        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            logoutTimeout = null;
        }

        logoutTimeout = setTimeout(() => {
            console.warn('[Logout] Timeout - forcing redirect to home');
            resetLogoutState();
            window.location.href = '/';
        }, 10000);

        void (async () => {
            try {
                let token = await fetchFreshCsrfToken();
                if (!token) {
                    const fromProps = (page.props as { csrf_token?: string }).csrf_token;
                    if (typeof fromProps === 'string' && fromProps.length > 0) {
                        token = fromProps;
                        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.setAttribute('content', token);
                        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
                    }
                }
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
                                            onSuccess: () => {
                                                resetLogoutState();
                                            },
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
    }, [page.props, resetLogoutState]);

    return { logout, isLoggingOut };
}
