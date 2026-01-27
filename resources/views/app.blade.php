<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

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

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
        
        <!-- Fallback script to show error if Inertia fails to load -->
        <script>
            // Wait for page to load, then check if Inertia app rendered
            window.addEventListener('load', function() {
                setTimeout(function() {
                    // Check if app element exists and has content
                    const appElement = document.querySelector('[data-page]') || document.getElementById('app');
                    const errorElement = document.getElementById('app-error');
                    
                    // If no app element and no error element, something is wrong
                    if (!appElement && !errorElement) {
                        console.error('[Fallback] No app element found after page load');
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.id = 'app-fallback';
                        fallbackDiv.style.cssText = 'padding: 2rem; text-align: center; background-color: #f9fafb; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;';
                        fallbackDiv.innerHTML = `
                            <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">Loading Application...</h1>
                            <p style="color: #6b7280; margin-bottom: 0.5rem;">If this message persists, please refresh the page.</p>
                            <button 
                                onclick="window.location.reload()"
                                style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; font-weight: 500;"
                            >
                                Refresh Page
                            </button>
                        `;
                        document.body.appendChild(fallbackDiv);
                    } else if (appElement && appElement.children.length === 0 && !errorElement) {
                        // App element exists but is empty - might be loading
                        console.warn('[Fallback] App element exists but is empty');
                    } else {
                        // App seems to be loading or loaded
                        console.log('[Fallback] App element found, removing fallback if exists');
                        const existingFallback = document.getElementById('app-fallback');
                        if (existingFallback) {
                            existingFallback.remove();
                        }
                    }
                }, 3000); // Wait 3 seconds before showing fallback
            });
        </script>

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
                            if (url.startsWith('http://')) {
                                url = url.replace('http://', 'https://');
                                console.log('[HTTPS] app.blade.php: XMLHttpRequest converted to HTTPS:', url);
                            }
                            if (url.startsWith('//')) {
                                url = 'https:' + url;
                                console.log('[HTTPS] app.blade.php: Added https protocol:', url);
                            }
                        } else if (url instanceof URL && url.protocol === 'http:') {
                            url.protocol = 'https:';
                            console.log('[HTTPS] app.blade.php: URL object converted to HTTPS');
                        }
                        return originalXHROpen.call(this, method, url, ...args);
                    };
                    
                    // 2. Override fetch
                    const originalFetch = window.fetch;
                    window.fetch = function(url, options) {
                        if (typeof url === 'string' && url.startsWith('http://')) {
                            url = url.replace('http://', 'https://');
                            console.log('[HTTPS] app.blade.php: fetch() converted to HTTPS');
                        } else if (url instanceof Request && url.url.startsWith('http://')) {
                            url = new Request(url.url.replace('http://', 'https://'), url);
                            console.log('[HTTPS] app.blade.php: Request object converted to HTTPS');
                        }
                        return originalFetch(url, options);
                    };

                    // 3. Override Ziggy and route() when available
                    const overrideZiggy = function() {
                        if (typeof Ziggy !== 'undefined') {
                            if (Ziggy.url && Ziggy.url.startsWith('http://')) {
                                Ziggy.url = Ziggy.url.replace('http://', 'https://');
                                console.log('[HTTPS] app.blade.php: Ziggy.url updated to HTTPS:', Ziggy.url);
                            }

                            // Override route function to force HTTPS
                            if (typeof window.route === 'function') {
                                const originalRoute = window.route;
                                window.route = function(name, params, absolute, config) {
                                    const url = originalRoute(name, params, absolute, config);
                                    if (typeof url === 'string' && url.startsWith('http://')) {
                                        const httpsUrl = url.replace('http://', 'https://');
                                        console.log('[HTTPS] app.blade.php: route() converted:', url, '→', httpsUrl);
                                        return httpsUrl;
                                    }
                                    return url;
                                };
                                console.log('[HTTPS] app.blade.php: route() function overridden');
                            }
                        } else {
                            // Ziggy not loaded yet, try again
                            setTimeout(overrideZiggy, 50);
                        }
                    };
                    
                    // Try immediately and on DOMContentLoaded
                    overrideZiggy();
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', overrideZiggy);
                    }
                    setTimeout(overrideZiggy, 100);
                    setTimeout(overrideZiggy, 500);
                    
                    console.log('[HTTPS] app.blade.php: All HTTPS overrides installed');
                }
            })();
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
