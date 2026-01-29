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

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

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
                        if (typeof url === 'string' && url.startsWith('http://')) url = url.replace('http://', 'https://');
                        else if (url instanceof Request && url.url.startsWith('http://')) url = new Request(url.url.replace('http://', 'https://'), url);
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
    </body>
</html>
