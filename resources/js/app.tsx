import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';
const csrfToken =
    typeof document !== 'undefined'
        ? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? null
        : null;

if (typeof window !== 'undefined') {
    const useHttps = window.location.protocol === 'https:';

    const normalizeUrl = (url: string): string => {
        if (useHttps && url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }

        return url;
    };

    // Override fetch so every request stays on HTTPS and always carries the CSRF token header.
    const originalFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
        let resource = input;

        if (typeof input === 'string') {
            resource = normalizeUrl(input);
        } else if (input instanceof Request) {
            resource = new Request(normalizeUrl(input.url), input);
        }

        const nextInit: RequestInit = { ...init };
        const headers = new Headers(init?.headers || {});

        if (csrfToken && !headers.has('X-CSRF-TOKEN')) {
            headers.set('X-CSRF-TOKEN', csrfToken);
        }

        nextInit.headers = headers;
        nextInit.credentials = init?.credentials ?? 'same-origin';

        return originalFetch(resource, nextInit);
    };

    // Override XMLHttpRequest to force HTTPS and attach the CSRF header for legacy calls (Axios, etc.).
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (typeof url === 'string') {
            url = normalizeUrl(url);
        }
        return originalXHROpen.call(this, method, url, ...args);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (csrfToken) {
            try {
                this.setRequestHeader('X-CSRF-TOKEN', csrfToken);
            } catch (error) {
                // Ignore if the request has already been sent or headers are restricted.
            }
        }

        return originalXHRSend.call(this, body);
    };
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then((module: unknown) => {
            const Page = (module as { default: React.ComponentType<PageProps> }).default;
            const Wrapped = (pageProps: PageProps) => (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={(pageProps as Record<string, unknown>).ziggy?.location || location.pathname}
                        initial={{ opacity: 0, y: 4, scale: 0.995, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -4, scale: 0.995, filter: 'blur(8px)' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ willChange: 'transform, opacity, filter' }}
                    >
                        <Page {...pageProps} />
                    </motion.div>
                </AnimatePresence>
            );
            return Wrapped;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#BC8E2E',
    },
});

// This will set light / dark mode on load...
initializeTheme();
