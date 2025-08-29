<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

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
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
