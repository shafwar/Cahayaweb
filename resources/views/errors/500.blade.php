<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Server Error') }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: ui-sans-serif, system-ui, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            padding: 1.5rem;
        }
        main { max-width: 28rem; text-align: center; }
        h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; }
        p { margin: 0; font-size: 0.9375rem; line-height: 1.5; color: #64748b; }
    </style>
</head>
<body>
    <main>
        <h1>{{ __('Something went wrong') }}</h1>
        <p>{{ __('We are sorry. Please try again in a few moments.') }}</p>
    </main>
</body>
</html>
