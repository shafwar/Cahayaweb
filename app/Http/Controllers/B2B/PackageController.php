<?php

namespace App\Http\Controllers\B2B;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of B2B packages
     */
    public function index(Request $request)
    {
        $packages = Package::where('is_active', true)
            ->whereNotNull('b2b_price')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        // Ensure JSON fields are properly decoded for all packages
        $packagesData = $packages->toArray();
        foreach ($packagesData['data'] as &$package) {
            if (isset($package['itinerary']) && is_string($package['itinerary'])) {
                $package['itinerary'] = json_decode($package['itinerary'], true) ?: [];
            }
            if (isset($package['inclusions']) && is_string($package['inclusions'])) {
                $package['inclusions'] = json_decode($package['inclusions'], true) ?: [];
            }
            if (isset($package['exclusions']) && is_string($package['exclusions'])) {
                $package['exclusions'] = json_decode($package['exclusions'], true) ?: [];
            }
        }

        return Inertia::render('b2b/packages/index', [
            'user' => $request->user()->load(['userType', 'b2bVerification']),
            'packages' => $packagesData,
        ]);
    }

    /**
     * Display the specified package
     */
    public function show(Request $request, Package $package)
    {
        // Ensure package is active and has B2B pricing
        if (!$package->is_active || !$package->b2b_price) {
            abort(404, 'Package not available for B2B booking');
        }

        // Package data is already loaded

        // Ensure JSON fields are properly decoded
        $packageData = $package->toArray();
        if (isset($packageData['itinerary']) && is_string($packageData['itinerary'])) {
            $packageData['itinerary'] = json_decode($packageData['itinerary'], true) ?: [];
        }
        if (isset($packageData['inclusions']) && is_string($packageData['inclusions'])) {
            $packageData['inclusions'] = json_decode($packageData['inclusions'], true) ?: [];
        }
        if (isset($packageData['exclusions']) && is_string($packageData['exclusions'])) {
            $packageData['exclusions'] = json_decode($packageData['exclusions'], true) ?: [];
        }

        return Inertia::render('b2b/packages/show', [
            'user' => $request->user()->load(['userType', 'b2bVerification']),
            'package' => $packageData,
        ]);
    }
}
