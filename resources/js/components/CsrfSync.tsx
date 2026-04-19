import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect } from 'react';

/**
 * Keeps <meta name="csrf-token"> and axios default header in sync with the server on every Inertia visit.
 * Required after session()->regenerateToken() (e.g. B2B submit) — without this, the DOM still holds the old token → 419 on POST (logout).
 */
export default function CsrfSync() {
    const page = usePage();

    useEffect(() => {
        const token = (page.props as { csrf_token?: string }).csrf_token;
        if (typeof token !== 'string' || token.length === 0) {
            return;
        }
        const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        if (meta) {
            meta.setAttribute('content', token);
        }
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }, [page.props, page.url]);

    return null;
}
