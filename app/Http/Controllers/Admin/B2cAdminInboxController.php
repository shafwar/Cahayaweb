<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\B2cPackageRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Admin "inbox": new B2C package registrations. Unread is derived from the last
 * registration id the admin acknowledged (per-user cache). Polled from the UI.
 */
class B2cAdminInboxController extends Controller
{
    private function cacheKey(int $userId): string
    {
        return 'b2c_admin_inbox_last_registration_id_'.$userId;
    }

    public function summary(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $key = $this->cacheKey($userId);
        $lastSeen = Cache::get($key);

        if ($lastSeen === null) {
            $lastSeen = (int) (B2cPackageRegistration::query()->max('id') ?? 0);
            Cache::forever($key, $lastSeen);
        }

        $lastSeen = (int) $lastSeen;

        $unread = B2cPackageRegistration::query()->where('id', '>', $lastSeen)->count();

        $items = B2cPackageRegistration::query()
            ->where('id', '>', $lastSeen)
            ->with(['package' => static fn ($q) => $q->select('id', 'name', 'slug')])
            ->orderByDesc('id')
            ->limit(12)
            ->get()
            ->map(static fn (B2cPackageRegistration $r) => [
                'id' => $r->id,
                'full_name' => $r->full_name,
                'email' => $r->email,
                'pax' => $r->pax,
                'package_name' => $r->package?->name,
                'package_slug' => $r->package?->slug,
                'created_at' => $r->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'unread_count' => $unread,
            'items' => $items,
        ]);
    }

    public function markSeen(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $maxId = (int) (B2cPackageRegistration::query()->max('id') ?? 0);
        Cache::forever($this->cacheKey($userId), $maxId);

        return response()->json([
            'ok' => true,
            'last_seen_registration_id' => $maxId,
        ]);
    }
}
