import '../css/app.css';

import axios from 'axios';
import { createInertiaApp, type PageProps } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';

if (typeof window !== 'undefined') {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    const shouldForceHttps = window.location.protocol === 'https:';

    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }
    axios.defaults.withCredentials = true;

    const injectCsrfHeader = (incomingHeaders?: HeadersInit) => {
        const headers = new Headers(incomingHeaders);
        if (csrfToken && !headers.has('X-CSRF-TOKEN') && !headers.has('X-XSRF-TOKEN')) {
            headers.set('X-CSRF-TOKEN', csrfToken);
        }
        return headers;
    };

    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
        let resource = input;

        if (shouldForceHttps) {
            if (typeof resource === 'string' && resource.startsWith('http://')) {
                resource = resource.replace('http://', 'https://');
            } else if (resource instanceof Request && resource.url.startsWith('http://')) {
                resource = new Request(resource.url.replace('http://', 'https://'), resource);
            }
        }

        const config: RequestInit = { ...init };
        config.headers = injectCsrfHeader(init.headers);
        if (config.credentials === undefined) {
            config.credentials = 'same-origin';
        }

        return originalFetch(resource as RequestInfo | URL, config);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        let nextUrl = url;
        if (shouldForceHttps && typeof nextUrl === 'string' && nextUrl.startsWith('http://')) {
            nextUrl = nextUrl.replace('http://', 'https://');
        }
        return originalXHROpen.call(this, method, nextUrl, ...args);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (csrfToken) {
            try {
                this.setRequestHeader('X-CSRF-TOKEN', csrfToken);
            } catch {
                // ignore if setting header fails (e.g., preflight requests)
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
