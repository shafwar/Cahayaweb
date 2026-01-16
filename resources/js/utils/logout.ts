let isLoggingOut = false;

/**
 * Reliable logout function using form submission
 * This is the most reliable method for CSRF-protected routes
 */
export function logout() {
    if (isLoggingOut) {
        console.warn('Logout already in progress');
        return;
    }

    isLoggingOut = true;

    try {
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

        if (!csrfToken) {
            console.warn('No CSRF token found in meta tag, trying to get from cookie...');
            
            // Try to get token from cookie (Laravel stores it as XSRF-TOKEN)
            const cookies = document.cookie.split(';');
            let xsrfToken = null;
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'XSRF-TOKEN') {
                    xsrfToken = decodeURIComponent(value);
                    break;
                }
            }

            if (!xsrfToken) {
                console.warn('No CSRF token available, redirecting to home');
                window.location.href = '/';
                isLoggingOut = false;
                return;
            }

            // Use XSRF token from cookie
            performFormLogout(xsrfToken);
            return;
        }

        // Use CSRF token from meta tag
        performFormLogout(csrfToken);
    } catch (error) {
        console.error('Logout error:', error);
        isLoggingOut = false;
        // Last resort: just redirect
        window.location.href = '/';
    }
}

/**
 * Perform logout using form submission (most reliable for CSRF)
 */
function performFormLogout(token: string) {
    try {
        // Ensure logout URL uses HTTPS to prevent Mixed Content errors
        let logoutUrl = '/logout';
        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            // Use absolute HTTPS URL to prevent any protocol issues
            logoutUrl = window.location.origin + '/logout';
        }

        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = logoutUrl;
        form.style.display = 'none';

        // Add CSRF token as hidden input
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = token;

        // Add method spoofing for POST (Laravel expects POST)
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'POST';

        form.appendChild(tokenInput);
        form.appendChild(methodInput);
        document.body.appendChild(form);

        // Submit the form
        form.submit();

        // Reset flag after a delay (in case form submission fails)
        setTimeout(() => {
            isLoggingOut = false;
        }, 2000);
    } catch (error) {
        console.error('Form logout error:', error);
        isLoggingOut = false;
        // Fallback: redirect to home
        window.location.href = '/';
    }
}
