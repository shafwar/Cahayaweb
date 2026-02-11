<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- CRITICAL: Force HTTPS IMMEDIATELY - Must be FIRST script to prevent Mixed Content -->
        <script>
            // This MUST run before ANY other scripts to intercept ALL requests
            (function() {
                'use strict';
                if (window.location.protocol === 'https:') {
                    // Override XMLHttpRequest.prototype.open FIRST - most critical
                    const originalXHROpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                        if (typeof url === 'string') {
                            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
                            else if (url.startsWith('//')) url = 'https:' + url;
                            else if (url.startsWith('/')) url = window.location.origin + url;
                            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
                        } else if (url instanceof URL && url.protocol === 'http:') {
                            url.protocol = 'https:';
                        }
                        return originalXHROpen.call(this, method, url, async, user, password);
                    };

                    const originalFetch = window.fetch;
                    window.fetch = function(url, options) {
                        if (typeof url === 'string') {
                            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
                            else if (url.startsWith('//')) url = 'https:' + url;
                            else if (url.startsWith('/')) url = window.location.origin + url;
                        } else if (url instanceof Request) {
                            if (url.url.startsWith('http://')) url = new Request(url.url.replace('http://', 'https://'), url);
                            else if (url.url.startsWith('/')) url = new Request(window.location.origin + url.url, url);
                        }
                        return originalFetch(url, options);
                    };
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon - Cahaya Anbiya Logo (Force Update) -->
        <link rel="icon" type="image/png" sizes="192x192" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="64x64" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="48x48" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/cahayanbiyalogo.png">
        <link rel="shortcut icon" type="image/png" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="57x57" href="/cahayanbiyalogo.png">
        <meta name="msapplication-TileImage" content="/cahayanbiyalogo.png">
        <meta name="msapplication-TileColor" content="#d4af37">
        <meta name="theme-color" content="#d4af37">
        <meta name="application-name" content="Cahaya Anbiya">
        <meta name="apple-mobile-web-app-title" content="Cahaya Anbiya">

        <!-- Resource Hints for Performance -->
        <link rel="dns-prefetch" href="https://assets.cahayaanbiya.com">
        <link rel="preconnect" href="https://assets.cahayaanbiya.com" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        
        <!-- Fonts - Optimized Loading with font-display: swap -->
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
        
        <!-- CRITICAL: Fallback if Vite directive fails or manifest.json missing -->
        <script>
            (function() {
                'use strict';
                
                // Check if Vite assets were actually injected
                let viteAssetsFound = false;
                let checkInterval;
                let checkCount = 0;
                const maxChecks = 20; // 10 seconds total
                
                function checkViteAssets() {
                    checkCount++;
                    
                    // Check for Vite script tags
                    const viteScripts = document.querySelectorAll('script[type="module"][src*="/build/assets/"]');
                    const viteLinks = document.querySelectorAll('link[rel="stylesheet"][href*="/build/assets/"]');
                    
                    if (viteScripts.length > 0 || viteLinks.length > 0) {
                        viteAssetsFound = true;
                        console.log('[Vite Check] Assets found:', {
                            scripts: viteScripts.length,
                            links: viteLinks.length
                        });
                        clearInterval(checkInterval);
                        return;
                    }
                    
                    // If max checks reached and still no assets
                    if (checkCount >= maxChecks) {
                        console.error('[Vite Check] No Vite assets found after 10 seconds');
                        showManifestError();
                        clearInterval(checkInterval);
                    }
                }
                
                function showManifestError() {
                    const existing = document.getElementById('vite-manifest-error');
                    if (existing) return;
                    
                    // Try to fetch manifest.json directly to diagnose
                    fetch('/build/manifest.json')
                        .then(res => {
                            if (!res.ok) {
                                console.error('[Vite Check] manifest.json not found (404)');
                                showErrorUI('Manifest file not found. Please rebuild assets.');
                            } else {
                                return res.json();
                            }
                        })
                        .then(manifest => {
                            if (manifest) {
                                console.log('[Vite Check] manifest.json exists:', Object.keys(manifest).length, 'entries');
                                // Manifest exists but assets not injected - check if files exist
                                const appEntry = manifest['resources/js/app.tsx'];
                                if (appEntry && appEntry.file) {
                                    const assetUrl = '/build/' + appEntry.file;
                                    fetch(assetUrl, { method: 'HEAD' })
                                        .then(res => {
                                            if (!res.ok) {
                                                showErrorUI('Asset files not found. Please rebuild and deploy assets.');
                                            } else {
                                                showErrorUI('Assets exist but not loading. Please check browser console.');
                                            }
                                        })
                                        .catch(() => {
                                            showErrorUI('Cannot verify asset files. Please rebuild and deploy.');
                                        });
                                } else {
                                    showErrorUI('Manifest file invalid. Please rebuild assets.');
                                }
                            }
                        })
                        .catch(err => {
                            console.error('[Vite Check] Error checking manifest:', err);
                            showErrorUI('Cannot load manifest file. Please rebuild and deploy assets.');
                        });
                }
                
                function showErrorUI(message) {
                    const errorDiv = document.createElement('div');
                    errorDiv.id = 'vite-manifest-error';
                    errorDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
                    errorDiv.innerHTML = `
                        <div style="text-align: center; max-width: 600px;">
                            <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">
                                Application Assets Not Found
                            </h1>
                            <p style="color: #6b7280; margin-bottom: 1rem;">
                                ${message}
                            </p>
                            <p style="font-size: 0.875rem; color: #9ca3af; margin-bottom: 1.5rem;">
                                This usually means the build assets were not deployed correctly.
                            </p>
                            <div style="margin-bottom: 1rem;">
                                <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500; margin-right: 0.5rem;">
                                    Reload Page
                                </button>
                                <button onclick="console.log('Manifest check:', fetch('/build/manifest.json').then(r => r.json()).then(console.log).catch(console.error))" style="padding: 0.75rem 1.5rem; background-color: #6b7280; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500;">
                                    Check Console
                                </button>
                            </div>
                            <p style="font-size: 0.75rem; color: #9ca3af;">
                                If this problem persists, please contact support with this error message.
                            </p>
                        </div>
                    `;
                    document.body.appendChild(errorDiv);
                }
                
                // Start checking after a short delay to let @vite directive execute
                setTimeout(() => {
                    checkViteAssets();
                    checkInterval = setInterval(checkViteAssets, 500);
                }, 1000);
            })();
        </script>
        
        <!-- Fallback for Vite asset loading errors -->
        <noscript>
            <div style="padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">JavaScript Required</h1>
                <p style="color: #6b7280;">Please enable JavaScript to view this website.</p>
            </div>
        </noscript>

        <!-- Force HTTPS for all requests - CRITICAL: Must run BEFORE any scripts -->
        <script>
            // CRITICAL: Force HTTPS IMMEDIATELY before any other scripts run
            // This prevents Mixed Content errors where HTTPS page tries to make HTTP requests
            (function() {
                if (window.location.protocol === 'https:') {
                    // 1. Override XMLHttpRequest FIRST - most critical for Inertia
                    const originalXHROpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url, ...args) {
                        if (typeof url === 'string') {
                            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
                            if (url.startsWith('//')) url = 'https:' + url;
                        } else if (url instanceof URL && url.protocol === 'http:') url.protocol = 'https:';
                        return originalXHROpen.call(this, method, url, ...args);
                    };

                    const originalFetch = window.fetch;
                    window.fetch = function(url, options) {
                        if (typeof url === 'string') {
                            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
                            if (url.startsWith('//')) url = 'https:' + url;
                        } else if (url instanceof Request && url.url.startsWith('http://')) {
                            url = new Request(url.url.replace('http://', 'https://'), url);
                        }
                        return originalFetch(url, options);
                    };

                    const overrideZiggy = function() {
                        if (typeof Ziggy !== 'undefined') {
                            if (Ziggy.url && Ziggy.url.startsWith('http://')) Ziggy.url = Ziggy.url.replace('http://', 'https://');
                            if (typeof window.route === 'function') {
                                const originalRoute = window.route;
                                window.route = function(name, params, absolute, config) {
                                    const url = originalRoute(name, params, absolute, config);
                                    return (typeof url === 'string' && url.startsWith('http://')) ? url.replace('http://', 'https://') : url;
                                };
                            }
                        } else setTimeout(overrideZiggy, 50);
                    };
                    overrideZiggy();
                    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', overrideZiggy);
                    setTimeout(overrideZiggy, 100);
                    setTimeout(overrideZiggy, 500);
                }
            })();
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
        
        <!-- Fallback: Ensure page always renders even if Inertia fails -->
        <noscript>
            <div style="padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">JavaScript Required</h1>
                <p style="color: #6b7280; margin-bottom: 0.5rem;">Please enable JavaScript to view this website.</p>
            </div>
        </noscript>
        
        <!-- Fallback: Show loading indicator if Inertia takes too long -->
        <script>
            (function() {
                'use strict';
                // Check if Inertia app has initialized after 5 seconds
                setTimeout(function() {
                    const inertiaElement = document.querySelector('[data-page]');
                    const appElement = document.getElementById('app');
                    
                    // If no Inertia element and body is empty/blank, show error
                    if (!inertiaElement && (!appElement || appElement.children.length === 0)) {
                        const body = document.body;
                        if (body && body.children.length <= 1) { // Only @inertia and noscript
                            console.error('[App] Inertia app did not initialize - showing fallback');
                            const fallback = document.createElement('div');
                            fallback.id = 'app-fallback';
                            fallback.style.cssText = 'padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;';
                            fallback.innerHTML = `
                                <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">Loading...</h1>
                                <p style="color: #6b7280; margin-bottom: 1rem;">If this page doesn't load, please refresh.</p>
                                <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500;">
                                    Refresh Page
                                </button>
                            `;
                            body.appendChild(fallback);
                        }
                    }
                }, 5000);
                
                // Also check for Vite assets loading errors
                window.addEventListener('error', function(e) {
                    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
                        const src = e.target.src || e.target.href;
                        if (src && (src.includes('/build/') || src.includes('vite'))) {
                            console.error('[App] Vite asset failed to load:', src);
                            // Try to reload after a delay
                            setTimeout(function() {
                                if (!document.querySelector('[data-page]')) {
                                    console.warn('[App] Reloading page due to asset load failure');
                                    window.location.reload();
                                }
                            }, 2000);
                        }
                    }
                }, true);
            })();
        </script>
    </body>
</html>
