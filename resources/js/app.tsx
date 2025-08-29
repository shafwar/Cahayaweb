import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Force HTTPS for all requests to prevent Mixed Content errors
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Override fetch to force HTTPS
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        return originalFetch(url, options);
    };

    // Override XMLHttpRequest to force HTTPS
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        return originalXHROpen.call(this, method, url, ...args);
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
