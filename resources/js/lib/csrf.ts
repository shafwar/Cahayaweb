import axios from 'axios';

const CSRF_ENDPOINT = '/auth/csrf-token';

/**
 * Loads the current session CSRF token from the server (GET, no CSRF header needed).
 * Updates <meta name="csrf-token"> and axios defaults so Inertia POST (e.g. logout) matches Laravel session.
 */
export async function fetchFreshCsrfToken(): Promise<string | null> {
    try {
        const res = await fetch(CSRF_ENDPOINT, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!res.ok) {
            return null;
        }

        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
            return null;
        }

        const data = (await res.json()) as { csrf_token?: string };
        const token = data.csrf_token;
        if (typeof token !== 'string' || token.length === 0) {
            return null;
        }

        const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        if (meta) {
            meta.setAttribute('content', token);
        }
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        return token;
    } catch {
        return null;
    }
}
