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
            $ziggyArray = ['url' => 'https://cahayaanbiya.com', 'routes' => []];
            try {
                $ziggy = new Ziggy();
                $ziggyArray = $ziggy->toArray();
                $ziggyArray['url'] = 'https://cahayaanbiya.com';
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
            $ziggyData = [
                'url' => 'https://cahayaanbiya.com',
                'location' => $request->url(),
                'routes' => [],
                'forceHttps' => true,
            ];
            try {
                $ziggyData = [
                    ...$ziggyArray,
                    'location' => $request->url(),
                    'forceHttps' => true,
                ];
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

            return [
                ...$parentShare,
                'name' => config('app.name', 'Cahaya Anbiya'),
                'quote' => $quote,
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
            $fallbackZiggy = [
                'url' => 'https://cahayaanbiya.com',
                'location' => $request->url(),
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
            ];
        }
    }
}
