import { router } from '@inertiajs/react';

let isLoggingOut = false;

export function logout() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
        // Refresh CSRF token before logout to prevent 419 errors
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            // If no CSRF token, try to get fresh one
            fetch('/', { method: 'GET', credentials: 'same-origin' })
                .then(() => {
                    performLogout();
                })
                .catch(() => {
                    performLogout();
                });
        } else {
            performLogout();
        }
    } catch (error) {
        console.error('Logout error:', error);
        performLogout();
    }
}

function performLogout() {
    // Use Inertia router for logout to ensure proper CSRF token handling
    router.post(
        '/logout',
        {},
        {
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                isLoggingOut = false;
                // Force page reload to ensure clean state
                window.location.href = '/';
            },
            onError: (errors) => {
                console.error('Logout error:', errors);
                isLoggingOut = false;
                // If Inertia logout fails, try fallback method
                fallbackLogout();
            },
            onFinish: () => {
                isLoggingOut = false;
            },
        },
    );
}

function fallbackLogout() {
    // Fallback: Use form submission with fresh CSRF token
    try {
        // Get fresh CSRF token
        fetch('/', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                Accept: 'text/html',
            },
        })
            .then(() => {
                const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

                if (!token) {
                    // If still no token, just redirect
                    window.location.href = '/';
                    return;
                }

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/logout';
                form.style.display = 'none';

                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = '_token';
                tokenInput.value = token;

                form.appendChild(tokenInput);
                document.body.appendChild(form);
                form.submit();
            })
            .catch(() => {
                // If all else fails, redirect to home
                window.location.href = '/';
            });
    } catch (error) {
        console.error('Fallback logout error:', error);
        window.location.href = '/';
    }
}
