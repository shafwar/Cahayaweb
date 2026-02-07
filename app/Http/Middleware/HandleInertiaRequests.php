<?php

namespace App\Http\Middleware;

use App\Models\Section;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            // Safe quote generation
            $quote = ['message' => 'Welcome', 'author' => 'Cahaya Anbiya'];
            try {
                $quoteData = str(Inspiring::quotes()->random())->explode('-');
                if (count($quoteData) >= 2) {
                    $quote = ['message' => trim($quoteData[0]), 'author' => trim($quoteData[1])];
                }
            } catch (\Throwable $e) {
                Log::warning('Error getting quote', ['error' => $e->getMessage()]);
            }

            // Safe Ziggy initialization
            // CRITICAL: ALWAYS use HTTPS URL to prevent Mixed Content errors
            // Force HTTPS regardless of request detection - if page is HTTPS, all URLs must be HTTPS
            $baseUrl = $request->getSchemeAndHttpHost();
            
            // CRITICAL: Always force HTTPS if current request URL is HTTPS
            // This prevents Mixed Content errors where HTTPS page tries to make HTTP requests
            $currentUrl = $request->url();
            if (str_starts_with($currentUrl, 'https://')) {
                // Current page is HTTPS - force all URLs to HTTPS
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
                // Also ensure baseUrl starts with https://
                if (!str_starts_with($baseUrl, 'https://')) {
                    $baseUrl = 'https://' . str_replace(['http://', 'https://'], '', $baseUrl);
                }
            } elseif ($request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                // Request detected as secure - force HTTPS
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
            }
            
            // Final safety check: if baseUrl still starts with http://, force to https://
            if (str_starts_with($baseUrl, 'http://')) {
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
                Log::warning('Forced baseUrl to HTTPS as fallback', ['original' => $request->getSchemeAndHttpHost(), 'forced' => $baseUrl]);
            }
            
            $ziggyArray = ['url' => $baseUrl, 'routes' => []];
            try {
                $ziggy = new Ziggy();
                $ziggyArray = $ziggy->toArray();
                $ziggyArray['url'] = $baseUrl; // Use forced HTTPS URL
            } catch (\Throwable $e) {
                Log::warning('Error initializing Ziggy', ['error' => $e->getMessage()]);
            }

            // Safe user data
            $user = null;
            $isAdmin = false;
            try {
                $user = $request->user();
                if ($user) {
                    $isAdmin = ($user->role ?? null) === 'admin'
                        || in_array($user->email, config('app.admin_emails', []), true);
                }
            } catch (\Throwable $e) {
                Log::warning('Error getting user', ['error' => $e->getMessage()]);
            }

            // Safe parent share
            $parentShare = [];
            try {
                $parentShare = parent::share($request);
            } catch (\Throwable $e) {
                Log::warning('Error getting parent share', ['error' => $e->getMessage()]);
            }

            // Evaluate ziggy directly (not as closure) to avoid serialization issues
            // CRITICAL: ALWAYS use HTTPS URL to prevent Mixed Content errors
            // Use the same baseUrl logic as above to ensure consistency
            // Don't re-check - use the baseUrl that was already forced to HTTPS above
            
            // Ensure location URL is also HTTPS
            $locationUrl = $request->url();
            if (str_starts_with($locationUrl, 'http://')) {
                $locationUrl = str_replace('http://', 'https://', $locationUrl);
                Log::info('Converted location URL to HTTPS', ['original' => $request->url(), 'converted' => $locationUrl]);
            }
            
            // CRITICAL: Log Ziggy URL for debugging
            Log::info('Ziggy URL configuration', [
                'baseUrl' => $baseUrl,
                'locationUrl' => $locationUrl,
                'currentRequestUrl' => $request->url(),
                'isSecure' => $request->secure(),
                'xForwardedProto' => $request->header('X-Forwarded-Proto'),
            ]);
            
            $ziggyData = [
                'url' => $baseUrl, // Already forced to HTTPS above
                'location' => $locationUrl, // Use HTTPS location URL
                'routes' => [],
                'forceHttps' => true,
            ];
            try {
                $ziggyData = [
                    ...$ziggyArray,
                    'url' => $baseUrl, // Override with forced HTTPS URL
                    'location' => $locationUrl, // Use HTTPS location URL
                    'forceHttps' => true,
                ];
                
                // CRITICAL: Final verification - ensure URL is HTTPS
                if (isset($ziggyData['url']) && str_starts_with($ziggyData['url'], 'http://')) {
                    $ziggyData['url'] = str_replace('http://', 'https://', $ziggyData['url']);
                    Log::warning('Final safety check: Forced Ziggy URL to HTTPS', ['url' => $ziggyData['url']]);
                }
            } catch (\Throwable $e) {
                Log::warning('Error building ziggy data', ['error' => $e->getMessage()]);
            }

            // Evaluate sections directly (not as closure) to avoid serialization issues
            $sectionsData = [];
            try {
                $sectionsData = Section::getAllSections();
                if (!is_array($sectionsData)) {
                    Log::warning('getAllSections returned non-array', [
                        'type' => gettype($sectionsData),
                    ]);
                    $sectionsData = [];
                }
            } catch (\Throwable $e) {
                Log::error('Error getting sections', [
                    'error' => $e->getMessage(),
                    'url' => $request->url()
                ]);
                $sectionsData = [];
            }

            $cmsMediaGuide = config('cms_media_guide', []);

            return [
                ...$parentShare,
                'name' => config('app.name', 'Cahaya Anbiya'),
                'quote' => $quote,
                'cmsMediaGuide' => $cmsMediaGuide,
                'auth' => [
                    'user' => $user ? [
                        'id' => $user->id ?? null,
                        'name' => $user->name ?? null,
                        'email' => $user->email ?? null,
                        'is_admin' => $isAdmin,
                    ] : null,
                ],
                'ziggy' => $ziggyData,
                'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
                'sections' => $sectionsData,
            ];
        } catch (\Throwable $e) {
            // Last resort: return minimal safe props
            Log::error('Fatal error in HandleInertiaRequests::share', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'url' => $request->url()
            ]);
            
            // Last resort: return minimal safe props (all evaluated, no closures)
            // CRITICAL: ALWAYS use HTTPS URL to prevent Mixed Content errors
            $baseUrl = $request->getSchemeAndHttpHost();
            $currentUrl = $request->url();
            
            // Always force HTTPS if current URL is HTTPS
            if (str_starts_with($currentUrl, 'https://')) {
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
                if (!str_starts_with($baseUrl, 'https://')) {
                    $baseUrl = 'https://' . str_replace(['http://', 'https://'], '', $baseUrl);
                }
            } elseif ($request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
            }
            
            // Final safety check
            if (str_starts_with($baseUrl, 'http://')) {
                $baseUrl = str_replace('http://', 'https://', $baseUrl);
            }
            
            $locationUrl = $request->url();
            if (str_starts_with($locationUrl, 'http://')) {
                $locationUrl = str_replace('http://', 'https://', $locationUrl);
            }
            
            $fallbackZiggy = [
                'url' => $baseUrl,
                'location' => $locationUrl,
                'routes' => [],
                'forceHttps' => true,
            ];
            
            return [
                'name' => 'Cahaya Anbiya',
                'quote' => ['message' => 'Welcome', 'author' => 'Cahaya Anbiya'],
                'auth' => ['user' => null],
                'ziggy' => $fallbackZiggy,
                'sidebarOpen' => true,
                'sections' => [],
                'cmsMediaGuide' => config('cms_media_guide', []),
            ];
        }
    }
}
