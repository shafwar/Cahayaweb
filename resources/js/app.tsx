import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';

if (typeof window !== 'undefined') {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    axios.defaults.withCredentials = true;
}

// Force HTTPS for all requests to prevent Mixed Content errors
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Override fetch to force HTTPS
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (typeof url === 'string' && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        } else if (url instanceof Request && url.url.startsWith('http://')) {
            url = new Request(url.url.replace('http://', 'https://'), url);
        }

        return originalFetch(url as RequestInfo | URL, options);
    };

    // Override XMLHttpRequest to force HTTPS
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (typeof url === 'string' && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        return originalXHROpen.call(this, method, url, ...args);
    };
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: false });
        return resolvePageComponent(`./pages/${name}.tsx`, pages)
            .then((module: unknown) => {
                if (!module) {
                    console.error(`Module not found for page: ${name}`);
                    throw new Error(`Page component not found: ${name}`);
                }
                const Page = (module as { default: React.ComponentType<PageProps> })?.default;
                if (!Page) {
                    console.error(`Page component default export not found for: ${name}`, module);
                    throw new Error(`Page component default export not found: ${name}`);
                }
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
            })
            .catch((error) => {
                console.error(`Failed to load page component: ${name}`, error);
                console.error('Available pages:', Object.keys(pages));
                // Return a fallback error page
                const ErrorPage = () => (
                    <div className="flex min-h-screen items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                            <p className="mt-2 text-gray-600">The page "{name}" could not be loaded.</p>
                            <p className="mt-1 text-sm text-gray-500">Error: {error instanceof Error ? error.message : String(error)}</p>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                );
                return ErrorPage;
            });
    },
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
