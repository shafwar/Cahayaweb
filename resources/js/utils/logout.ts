import axios from 'axios';
import { router } from '@inertiajs/react';

let isLoggingOut = false;

/**
 * Refresh CSRF token by making a GET request to the current page
 * This ensures we have a fresh token before logout
 */
async function refreshCsrfToken(): Promise<string | null> {
    try {
        // Get current page URL to refresh token
        const response = await axios.get(window.location.href, {
            headers: {
                Accept: 'text/html',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        });

        // Parse the response to extract new CSRF token
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const newToken = doc.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

        // Update the token in the current page's meta tag
        if (newToken) {
            const currentMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
            if (currentMeta) {
                currentMeta.content = newToken;
            }
            // Also update axios default header
            axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
            return newToken;
        }
    } catch (error) {
        console.warn('Failed to refresh CSRF token:', error);
    }

    // Fallback: return existing token if refresh fails
    const existingToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    if (existingToken) {
        return existingToken;
    }

    return null;
}

export function logout() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    // Refresh CSRF token first, then perform logout
    refreshCsrfToken()
        .then((token) => {
            if (!token) {
                console.warn('No CSRF token available, using fallback logout');
                fallbackLogout();
                return;
            }
            performLogout();
        })
        .catch((error) => {
            console.error('Error refreshing CSRF token:', error);
            fallbackLogout();
        });
}

function performLogout() {
    // Get the latest CSRF token from meta tag
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    if (!csrfToken) {
        console.warn('No CSRF token found, using fallback logout');
        fallbackLogout();
        return;
    }

    // Use Inertia router for logout with explicit CSRF token
    router.post(
        '/logout',
        {},
        {
            preserveState: false,
            preserveScroll: false,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
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
        // Get CSRF token from meta tag
        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        if (!token) {
            // If still no token, just redirect (session might already be invalid)
            console.warn('No CSRF token available for logout, redirecting to home');
            window.location.href = '/';
            return;
        }

        // Create and submit form with CSRF token
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
    } catch (error) {
        console.error('Fallback logout error:', error);
        // Last resort: just redirect
        window.location.href = '/';
    }
}
