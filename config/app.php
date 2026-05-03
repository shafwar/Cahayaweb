<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'Cahaya Anbiya'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Force HTTPS for generated URLs
    |--------------------------------------------------------------------------
    | When true (or in production), URL::forceScheme('https') is applied so
    | route(), url(), redirect() generate https:// and Mixed Content is avoided.
    */
    'force_https' => env('FORCE_HTTPS', false),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => env('APP_TIMEZONE', 'Asia/Jakarta'),

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

    // Admin allowlist for inline CMS editing (IsAdmin middleware fallback).
    // If APP_ADMIN_EMAILS is absent from .env, default one local address; if present but empty, [].
    'admin_emails' => \App\Support\AdminNotifyEmailList::parse(
        env('APP_ADMIN_EMAILS') === null ? 'test@example.com' : (string) env('APP_ADMIN_EMAILS')
    ),

    /*
    | Comma-separated inbox(es) for contact form + B2B/B2C admin alerts only.
    | Merged with admin_emails + mail_ops_notify_email (deduped).
    | Production: set ADMIN_NOTIFY_EMAILS and/or MAIL_OPS_NOTIFY_EMAIL to your ops Gmail.
    */
    'admin_notify_emails' => \App\Support\AdminNotifyEmailList::parse((string) env('ADMIN_NOTIFY_EMAILS', '')),

    /*
    | Single inbox for the same alerts as ADMIN_NOTIFY_EMAILS (easier Railway setup).
    | Also reads MAIL_ADMIN_NOTIFICATION_EMAIL if MAIL_OPS_NOTIFY_EMAIL is empty.
    */
    'mail_ops_notify_email' => trim((string) (env('MAIL_OPS_NOTIFY_EMAIL') ?: env('MAIL_ADMIN_NOTIFICATION_EMAIL', ''))),

    /*
    | When true, contact + admin alerts are allowed even if MAIL_MAILER=log (local only).
    */
    'allow_log_mailer_for_admin_alerts' => (bool) env('ALLOW_LOG_MAILER_FOR_ADMIN_ALERTS', false),

];
