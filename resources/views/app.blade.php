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

        <!-- Force HTTPS for all requests -->
        <script>
            // Force HTTPS for all requests to prevent Mixed Content errors
            if (window.location.protocol === 'https:') {
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

                // Override Ziggy URL to force HTTPS
                if (typeof Ziggy !== 'undefined') {
                    Ziggy.url = Ziggy.url.replace('http://', 'https://');

                    // Override route function to force HTTPS
                    const originalRoute = window.route;
                    window.route = function(name, params, absolute, config) {
                        const url = originalRoute(name, params, absolute, config);
                        return url.replace('http://', 'https://');
                    };
                }
            }
        </script>
        <!-- Inline critical CSS for loading indicator -->
        <style>
            .initial-loader {
                position: fixed;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #000 0%, #0f172a 50%, #000 100%);
                z-index: 99999;
                transition: opacity 0.3s ease-out;
            }
            .initial-loader.fade-out {
                opacity: 0;
                pointer-events: none;
            }
            .loader-logo {
                width: 120px;
                height: auto;
                margin-bottom: 24px;
                animation: pulse 2s ease-in-out infinite;
            }
            .loader-text {
                color: #fcd34d;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.1em;
            }
            .loader-dots {
                display: flex;
                gap: 8px;
                margin-top: 16px;
            }
            .loader-dot {
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite;
            }
            .loader-dot:nth-child(1) { animation-delay: 0s; }
            .loader-dot:nth-child(2) { animation-delay: 0.2s; }
            .loader-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
            @keyframes bounce {
                0%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-8px); }
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <!-- Loading indicator - shows immediately while JS loads -->
        <div id="initial-loader" class="initial-loader">
            <img src="/cahayanbiyalogo.png" alt="Loading" class="loader-logo" />
            <div class="loader-text">CAHAYA ANBIYA</div>
            <div class="loader-dots">
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
            </div>
        </div>
        
        @inertia
        
        <!-- Hide loader once React app renders -->
        <script>
            // Remove loader as soon as possible after app starts rendering
            (function() {
                var checkCount = 0;
                var maxChecks = 100; // 10 seconds max
                function hideLoader() {
                    var loader = document.getElementById('initial-loader');
                    var app = document.getElementById('app');
                    if (loader && app && app.children.length > 0) {
                        loader.classList.add('fade-out');
                        setTimeout(function() { 
                            if (loader.parentNode) loader.parentNode.removeChild(loader); 
                        }, 300);
                    } else if (checkCount < maxChecks) {
                        checkCount++;
                        setTimeout(hideLoader, 100);
                    }
                }
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', hideLoader);
                } else {
                    hideLoader();
                }
            })();
        </script>
    </body>
</html>
