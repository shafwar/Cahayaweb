<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Assets Missing - Cahaya Anbiya</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1rem;
        }
        p {
            color: #6b7280;
            margin-bottom: 1rem;
        }
        .error-message {
            font-size: 0.875rem;
            color: #9ca3af;
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
            word-break: break-word;
        }
        button {
            padding: 0.75rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
        }
        button:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Build Assets Missing</h1>
        <p>The application build assets are not available.</p>
        <div class="error-message">
            {{ $message ?? 'Please rebuild and deploy the application assets.' }}
        </div>
        <button onclick="window.location.reload()">Reload Page</button>
    </div>
</body>
</html>
