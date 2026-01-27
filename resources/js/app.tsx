import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import axios from 'axios';
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
    
    // CRITICAL: Force HTTPS for ALL URLs IMMEDIATELY
    // This must run BEFORE any code that uses route() or makes requests
    if (window.location.protocol === 'https:') {
        // 1. Override route() function IMMEDIATELY (don't wait for Ziggy)
        const originalRoute = (window as any).route;
        if (originalRoute && typeof originalRoute === 'function') {
            (window as any).route = function(name: string, params?: any, absolute?: boolean, config?: any) {
                const url = originalRoute(name, params, absolute, config);
                if (typeof url === 'string' && url.startsWith('http://')) {
                    const httpsUrl = url.replace('http://', 'https://');
                    console.log('[HTTPS] route() converted:', url, '→', httpsUrl);
                    return httpsUrl;
                }
                return url;
            };
            console.log('[HTTPS] route() function overridden');
        }
        
        // 2. Override fetch to force HTTPS
        const originalFetch = window.fetch;
        window.fetch = function(url: RequestInfo | URL, options?: RequestInit) {
            if (typeof url === 'string' && url.startsWith('http://')) {
                url = url.replace('http://', 'https://');
                console.log('[HTTPS] fetch() converted to HTTPS');
            } else if (url instanceof Request && url.url.startsWith('http://')) {
                url = new Request(url.url.replace('http://', 'https://'), url);
                console.log('[HTTPS] Request converted to HTTPS');
            }
            return originalFetch(url, options);
        };
        
        // 3. Override XMLHttpRequest to force HTTPS - MOST CRITICAL!
        // This intercepts ALL AJAX requests including Inertia requests
        // CRITICAL: Convert relative URLs to absolute HTTPS immediately
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
            const originalUrl = typeof url === 'string' ? url : (url instanceof URL ? url.href : String(url));
            
            if (typeof url === 'string') {
                // Convert HTTP to HTTPS
                if (url.startsWith('http://')) {
                    url = url.replace('http://', 'https://');
                    console.log('[HTTPS] app.tsx: XMLHttpRequest.open() converted HTTP→HTTPS:', originalUrl, '→', url);
                } else if (url.startsWith('//')) {
                    url = 'https:' + url;
                    console.log('[HTTPS] app.tsx: XMLHttpRequest.open() added https protocol:', originalUrl, '→', url);
                } else if (url.startsWith('/')) {
                    // CRITICAL: Relative URL - convert to absolute HTTPS immediately
                    // This prevents any chance of HTTP resolution
                    url = window.location.origin + url;
                    console.log('[HTTPS] app.tsx: XMLHttpRequest.open() converted relative to absolute HTTPS:', originalUrl, '→', url);
                }
                
                // Final check: if somehow still HTTP, force HTTPS
                if (url.startsWith('http://')) {
                    url = url.replace('http://', 'https://');
                    console.error('[HTTPS] app.tsx: XMLHttpRequest.open() FINAL FORCE HTTPS:', originalUrl, '→', url);
                }
            } else if (url instanceof URL) {
                if (url.protocol === 'http:') {
                    url.protocol = 'https:';
                    console.log('[HTTPS] app.tsx: XMLHttpRequest.open() URL object protocol changed to HTTPS');
                }
            }
            
            return originalXHROpen.call(this, method, url, ...args);
        };
        
        // Also override fetch in app.tsx (backup to app.blade.php)
        const originalFetchApp = window.fetch;
        window.fetch = function(url: RequestInfo | URL, options?: RequestInit) {
            const originalUrl = typeof url === 'string' ? url : (url instanceof Request ? url.url : String(url));
            
            if (typeof url === 'string') {
                if (url.startsWith('http://')) {
                    url = url.replace('http://', 'https://');
                    console.log('[HTTPS] app.tsx: fetch() converted HTTP→HTTPS:', originalUrl, '→', url);
                } else if (url.startsWith('//')) {
                    url = 'https:' + url;
                    console.log('[HTTPS] app.tsx: fetch() added https protocol:', originalUrl, '→', url);
                } else if (url.startsWith('/')) {
                    // Relative URL - convert to absolute HTTPS
                    url = window.location.origin + url;
                    console.log('[HTTPS] app.tsx: fetch() converted relative to absolute HTTPS:', originalUrl, '→', url);
                }
            } else if (url instanceof Request) {
                if (url.url.startsWith('http://')) {
                    url = new Request(url.url.replace('http://', 'https://'), url);
                    console.log('[HTTPS] app.tsx: fetch() Request object converted to HTTPS');
                } else if (url.url.startsWith('/')) {
                    url = new Request(window.location.origin + url.url, url);
                    console.log('[HTTPS] app.tsx: fetch() Request relative URL converted to absolute HTTPS');
                }
            }
            
            return originalFetchApp(url, options);
        };
        
        console.log('[HTTPS] app.tsx: All HTTPS overrides installed (backup to app.blade.php)');
        
        // 4. Also override XMLHttpRequest send to catch any URLs set after open()
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
            // Check if URL was set and convert if needed
            if (this.responseURL && this.responseURL.startsWith('http://')) {
                console.warn('[HTTPS] XMLHttpRequest.responseURL is HTTP, but request should be HTTPS');
            }
            return originalXHRSend.call(this, body);
        };
        
        console.log('[HTTPS] All URL overrides installed (including XMLHttpRequest)');
    }
}

// Force HTTPS for all requests to prevent Mixed Content errors
// This is a duplicate override to ensure it runs even if first one fails
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Override fetch to force HTTPS
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (typeof url === 'string' && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
            console.log('[HTTPS] fetch() duplicate override converted to HTTPS');
        } else if (url instanceof Request && url.url.startsWith('http://')) {
            url = new Request(url.url.replace('http://', 'https://'), url);
            console.log('[HTTPS] fetch() Request object converted to HTTPS');
        }

        return originalFetch(url as RequestInfo | URL, options);
    };

    // Override XMLHttpRequest to force HTTPS - CRITICAL for Inertia!
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (typeof url === 'string') {
            if (url.startsWith('http://')) {
                url = url.replace('http://', 'https://');
                console.log('[HTTPS] XMLHttpRequest.open() duplicate override converted:', url);
            }
            if (url.startsWith('//') && window.location.protocol === 'https:') {
                url = 'https:' + url;
                console.log('[HTTPS] XMLHttpRequest.open() added https protocol');
            }
        } else if (url instanceof URL && url.protocol === 'http:') {
            url.protocol = 'https:';
            console.log('[HTTPS] XMLHttpRequest.open() URL object converted');
        }
        return originalXHROpen.call(this, method, url, ...args);
    };
}

// Add global error handler for unhandled errors
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
}

// CRITICAL: Force HTTPS for ALL URLs BEFORE Inertia app is created
// This prevents Mixed Content errors where HTTPS page tries to make HTTP requests
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Override route() function IMMEDIATELY - don't wait for Ziggy
    // This ensures route() always returns HTTPS URLs
    const originalRoute = (window as any).route;
    if (originalRoute && typeof originalRoute === 'function') {
        (window as any).route = function(name: string, params?: any, absolute?: boolean, config?: any) {
            const url = originalRoute(name, params, absolute, config);
            if (typeof url === 'string' && url.startsWith('http://')) {
                const httpsUrl = url.replace('http://', 'https://');
                console.log('[HTTPS] Converted route URL:', url, '→', httpsUrl);
                return httpsUrl;
            }
            return url;
        };
    }
    
    // Also override Ziggy when it loads
    const overrideZiggy = () => {
        if (typeof (window as any).Ziggy !== 'undefined') {
            const ziggy = (window as any).Ziggy;
            if (ziggy.url && ziggy.url.startsWith('http://')) {
                ziggy.url = ziggy.url.replace('http://', 'https://');
                console.log('[HTTPS] Updated Ziggy URL to HTTPS:', ziggy.url);
            }
            
            // Ensure route function is still overridden
            const originalRoute = (window as any).route;
            if (originalRoute && typeof originalRoute === 'function') {
                (window as any).route = function(name: string, params?: any, absolute?: boolean, config?: any) {
                    const url = originalRoute(name, params, absolute, config);
                    if (typeof url === 'string' && url.startsWith('http://')) {
                        const httpsUrl = url.replace('http://', 'https://');
                        console.log('[HTTPS] Converted route URL:', url, '→', httpsUrl);
                        return httpsUrl;
                    }
                    return url;
                };
            }
        } else {
            // Ziggy not loaded yet, try again
            setTimeout(overrideZiggy, 50);
        }
    };
    
    // Try to override Ziggy immediately and on DOMContentLoaded
    overrideZiggy();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', overrideZiggy);
    }
    // Also try after a short delay to catch late-loading Ziggy
    setTimeout(overrideZiggy, 100);
    setTimeout(overrideZiggy, 500);
}

// Wrap entire Inertia app creation in try-catch for safety
let inertiaAppCreated = false;

try {
    createInertiaApp({
    title: (title) => {
        try {
            return title ? `${title} - ${appName}` : appName;
        } catch {
            return appName;
        }
    },
    resolve: (name) => {
        // All pages use dynamic import for optimal code splitting
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
                // Return page directly without heavy animation wrapper
                // Individual pages can add their own animations if needed
                return Page;
            })
            .catch((error) => {
                console.error(`Failed to load page component: ${name}`, error);
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
        // Enhanced logging for debugging
        if (typeof window !== 'undefined') {
            console.log('[Inertia] Setup called', { 
                hasEl: !!el, 
                hasApp: !!App, 
                hasProps: !!props,
                elId: el?.id,
                elTag: el?.tagName
            });
        }
        
        if (!el) {
            console.error('[Inertia] No element provided to Inertia setup');
            // Try to find the element - Inertia creates element with data-page attribute
            const fallbackEl = document.querySelector('[data-page]') || document.getElementById('app');
            if (fallbackEl) {
                console.log('[Inertia] Found fallback element, using it');
                el = fallbackEl as HTMLElement;
            } else {
                console.error('[Inertia] No fallback element found, creating one');
                // Last resort: create the element
                const newEl = document.createElement('div');
                newEl.id = 'app';
                document.body.appendChild(newEl);
                el = newEl;
                console.log('[Inertia] Created new app element');
            }
        }
        
        try {
            if (typeof window !== 'undefined') {
                console.log('[Inertia] Creating React root...');
            }
            const root = createRoot(el);
            
            // Wrap in try-catch to prevent white screen on render errors
            try {
                if (typeof window !== 'undefined') {
                    console.log('[Inertia] Rendering app...', { 
                        propsKeys: Object.keys(props || {}),
                        propsType: typeof props
                    });
                }
                
                // Ensure App and props are valid
                if (!App) {
                    throw new Error('App component is undefined');
                }
                
                root.render(<App {...(props || {})} />);
                
                if (typeof window !== 'undefined') {
                    console.log('[Inertia] App rendered successfully');
                }
            } catch (error) {
                console.error('[Inertia] Error rendering app:', error);
                console.error('[Inertia] Error stack:', error instanceof Error ? error.stack : 'No stack');
                
                // Render fallback UI with more details
                try {
                    root.render(
                        <div style={{ 
                            padding: '2rem', 
                            textAlign: 'center',
                            backgroundColor: '#f9fafb',
                            minHeight: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                                Application Error
                            </h1>
                            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                                Something went wrong. Please refresh the page.
                            </p>
                            <p style={{ 
                                fontSize: '0.875rem', 
                                color: '#9ca3af', 
                                marginTop: '1rem',
                                fontFamily: 'monospace',
                                backgroundColor: '#f3f4f6',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                maxWidth: '600px',
                                wordBreak: 'break-word'
                            }}>
                                Error: {error instanceof Error ? error.message : String(error)}
                            </p>
                            <button 
                                onClick={() => window.location.reload()}
                                style={{ 
                                    marginTop: '1.5rem', 
                                    padding: '0.75rem 1.5rem', 
                                    backgroundColor: '#3b82f6', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}
                            >
                                Refresh Page
                            </button>
                        </div>
                    );
                } catch (renderError) {
                    console.error('[Inertia] Error rendering fallback UI:', renderError);
                }
            }
        } catch (error) {
            console.error('[Inertia] Fatal error setting up app:', error);
            console.error('[Inertia] Error stack:', error instanceof Error ? error.stack : 'No stack');
            
            // Last resort: show error in the element using innerHTML
            if (el) {
                try {
                    el.innerHTML = `
                        <div style="padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">Application Error</h1>
                            <p style="color: #6b7280; margin-bottom: 0.5rem;">Something went wrong. Please refresh the page.</p>
                            <p style="font-size: 0.875rem; color: #9ca3af; margin-top: 1rem; font-family: monospace; background-color: #f3f4f6; padding: 0.5rem; border-radius: 0.25rem; max-width: 600px; word-break: break-word;">
                                Error: ${error instanceof Error ? error.message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                            </p>
                            <button 
                                onclick="window.location.reload()"
                                style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500;"
                            >
                                Refresh Page
                            </button>
                        </div>
                    `;
                } catch (innerHTMLError) {
                    console.error('[Inertia] Error setting innerHTML:', innerHTMLError);
                }
            }
        }
    },
    progress: {
        color: '#BC8E2E',
    },
    onError: (error) => {
        // Don't handle validation errors here - they should be displayed in the form
        // Validation errors (422) are handled by Inertia automatically and displayed via InputError components
        const errorStatus = (error as any)?.status;
        const errorMessage = error?.message || (typeof error === 'string' ? error : '') || '';
        const errorString = JSON.stringify(error || {});
        
        // Skip handling for validation errors (422) - let them display in form
        if (errorStatus === 422 || errorString.includes('422')) {
            console.log('[Inertia] Validation error - will be displayed in form');
            return; // Let Inertia handle validation errors normally
        }
        
        // Handle 419 Page Expired errors
        if (
            errorStatus === 419 ||
            errorMessage.includes('419') || 
            errorMessage.includes('expired') || 
            errorMessage.includes('PAGE EXPIRED') ||
            errorString.includes('419') ||
            errorString.includes('expired')
        ) {
            console.warn('[Inertia] CSRF token expired, reloading page...');
            // Reload page to refresh CSRF token
            setTimeout(() => {
                window.location.reload();
            }, 500);
            return;
        }
        
        // Handle 500 Server Errors
        if (
            errorStatus === 500 ||
            errorMessage.includes('500') ||
            errorMessage.includes('SERVER ERROR') ||
            errorString.includes('500')
        ) {
            console.error('[Inertia] Server error occurred:', error);
            // Show user-friendly message and reload
            if (confirm('A server error occurred. Would you like to refresh the page?')) {
                window.location.reload();
            }
            return;
        }
        
        // Log other errors for debugging
        console.error('[Inertia] Unhandled error:', error);
    },
    });
    
    inertiaAppCreated = true;
    console.log('[App] Inertia app created successfully');
} catch (error) {
    console.error('[App] Fatal error creating Inertia app:', error);
    console.error('[App] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Last resort: show error message
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'app-error';
        errorDiv.style.cssText = 'padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        errorDiv.innerHTML = `
            <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">Application Error</h1>
            <p style="color: #6b7280; margin-bottom: 0.5rem;">Failed to initialize application.</p>
            <p style="font-size: 0.875rem; color: #9ca3af; margin-top: 1rem; font-family: monospace; background-color: #f3f4f6; padding: 0.5rem; border-radius: 0.25rem; max-width: 600px; word-break: break-word;">
                Error: ${error instanceof Error ? error.message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </p>
            <button 
                onclick="window.location.reload()"
                style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500;"
            >
                Refresh Page
            </button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// This will set light / dark mode on load...
// Wrap in try-catch to prevent errors from breaking the app
if (inertiaAppCreated) {
    try {
        if (typeof window !== 'undefined') {
            initializeTheme();
        }
    } catch (error) {
        console.error('[App] Error initializing theme:', error);
        // Don't throw - theme initialization failure shouldn't break the app
    }
}
