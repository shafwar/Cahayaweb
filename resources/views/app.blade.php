<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Force HTTPS for all requests -->
        <script>
            (function() {
                'use strict';
                if (window.location.protocol === 'https:') {
                    var origOpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url) {
                        if (typeof url === 'string' && url.startsWith('http://')) url = url.replace('http://', 'https://');
                        return origOpen.apply(this, arguments);
                    };
                    var origFetch = window.fetch;
                    window.fetch = function(url, opts) {
                        if (typeof url === 'string' && url.startsWith('http://')) url = url.replace('http://', 'https://');
                        else if (url instanceof Request && url.url.startsWith('http://')) url = new Request(url.url.replace('http://', 'https://'), url);
                        return origFetch(url, opts);
                    };
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="192x192" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/cahayanbiyalogo.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/cahayanbiyalogo.png">
        <link rel="shortcut icon" type="image/png" href="/cahayanbiyalogo.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/cahayanbiyalogo.png">
        <meta name="msapplication-TileImage" content="/cahayanbiyalogo.png">
        <meta name="msapplication-TileColor" content="#d4af37">
        <meta name="theme-color" content="#d4af37">
        <meta name="application-name" content="Cahaya Anbiya">
        <meta name="apple-mobile-web-app-title" content="Cahaya Anbiya">

        <!-- Resource Hints -->
        <link rel="dns-prefetch" href="https://assets.cahayaanbiya.com">
        <link rel="preconnect" href="https://assets.cahayaanbiya.com" crossorigin>
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        <!-- Fix Ziggy HTTPS -->
        <script>
            (function() {
                if (window.location.protocol !== 'https:') return;
                function fixZiggy() {
                    if (typeof Ziggy !== 'undefined' && Ziggy.url && Ziggy.url.startsWith('http://')) {
                        Ziggy.url = Ziggy.url.replace('http://', 'https://');
                    }
                }
                fixZiggy();
                document.addEventListener('DOMContentLoaded', fixZiggy);
                setTimeout(fixZiggy, 200);
            })();
        </script>

        <noscript>
            <div style="padding:2rem;text-align:center;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <h1 style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem;">JavaScript Required</h1>
                <p style="color:#6b7280;">Please enable JavaScript to view this website.</p>
            </div>
        </noscript>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
