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
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Force HTTPS URL for Ziggy
        $ziggy = new Ziggy();
        $ziggyArray = $ziggy->toArray();
        $ziggyArray['url'] = 'https://cahayaweb-production.up.railway.app';

        $user = $request->user();
        $isAdmin = false;
        if ($user) {
            $isAdmin = ($user->role ?? null) === 'admin'
                || in_array($user->email, config('app.admin_emails', []), true);
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $isAdmin,
                ] : null,
            ],
            'ziggy' => fn (): array => [
                ...$ziggyArray,
                'location' => $request->url(),
                'forceHttps' => true, // Add flag to force HTTPS
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'sections' => function () {
                try {
                    return Section::getAllSections();
                } catch (\Exception $e) {
                    Log::error('Error getting sections in HandleInertiaRequests', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // Return empty array on error to prevent 500
                    return [];
                } catch (\Throwable $e) {
                    Log::error('Fatal error getting sections in HandleInertiaRequests', [
                        'error' => $e->getMessage()
                    ]);
                    return [];
                }
            },
        ];
    }
}
