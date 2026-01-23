import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
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

// Pre-import critical admin pages to ensure they're always bundled in production
// Using direct imports ensures these pages are always available, even if dynamic imports fail
import AdminAgentVerificationDetail from './pages/admin/agent-verification-detail';
import AdminAgentVerifications from './pages/admin/agent-verifications';
import AdminDashboard from './pages/admin/dashboard';

// Map of critical pages with their pre-imported components
const criticalPages: Record<string, React.ComponentType<PageProps>> = {
    'admin/dashboard': AdminDashboard,
    'admin/agent-verifications': AdminAgentVerifications,
    'admin/agent-verification-detail': AdminAgentVerificationDetail,
};

// Add global error handler for unhandled errors
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        // Don't prevent default to allow normal error handling
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // Don't prevent default to allow normal error handling
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // Try critical pages first (pre-imported for production reliability)
        if (criticalPages[name]) {
            const Page = criticalPages[name];
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
            return Promise.resolve(Wrapped);
        }

        // Fallback to dynamic glob for other pages
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: false });
        return resolvePageComponent(`./pages/${name}.tsx`, pages)
            .then((module: unknown) => {
                if (!module) {
                    console.error(`Module not found for page: ${name}`);
                    console.error('Available pages:', Object.keys(pages));
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
        console.log('Inertia setup called', { el: !!el, hasApp: !!App, hasProps: !!props });
        
        if (!el) {
            console.error('No element provided to Inertia setup');
            return;
        }
        
        try {
            console.log('Creating React root...');
            const root = createRoot(el);
            
            // Wrap in try-catch to prevent white screen on render errors
            try {
                console.log('Rendering Inertia app...', { propsKeys: Object.keys(props || {}) });
                root.render(<App {...props} />);
                console.log('Inertia app rendered successfully');
            } catch (error) {
                console.error('Error rendering Inertia app:', error);
                // Render fallback UI
                root.render(
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h1>Application Error</h1>
                        <p>Something went wrong. Please refresh the page.</p>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
                            Error: {error instanceof Error ? error.message : String(error)}
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{ 
                                marginTop: '1rem', 
                                padding: '0.5rem 1rem', 
                                backgroundColor: '#3b82f6', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                );
            }
        } catch (error) {
            console.error('Fatal error setting up Inertia app:', error);
            // Last resort: show error in the element
            if (el) {
                el.innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <h1>Application Error</h1>
                        <p>Something went wrong. Please refresh the page.</p>
                        <p style="font-size: 0.875rem; color: #666; margin-top: 1rem;">
                            Error: ${error instanceof Error ? error.message : String(error)}
                        </p>
                        <button 
                            onclick="window.location.reload()"
                            style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer;"
                        >
                            Refresh
                        </button>
                    </div>
                `;
            }
        }
    },
    progress: {
        color: '#BC8E2E',
    },
});

// This will set light / dark mode on load...
initializeTheme();
