<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Package::active();

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->byType($request->type);
        }

        // Filter by destination
        if ($request->has('destination')) {
            $query->where('destination', 'like', "%{$request->destination}%");
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $packages = $query->latest()->paginate(12);

        // Get user for price calculation
        $user = Auth::user();

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'filters' => $request->only(['type', 'destination', 'min_price', 'max_price']),
            'user' => $user,
        ]);
    }

    public function show(Package $package): Response
    {
        $user = Auth::user();

        // Calculate price for user
        $package->price_for_user = $package->getPriceForUser($user);

        return Inertia::render('Packages/Show', [
            'package' => $package,
            'user' => $user,
        ]);
    }

    public function purchase(Request $request, Package $package)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'travelers' => 'required|integer|min:1|max:' . $package->max_travelers,
            'special_requests' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $pricePerUnit = $package->getPriceForUser($user);
        $totalAmount = $pricePerUnit * $request->travelers;

        // Create purchase record
        $purchase = Purchase::create([
            'package_id' => $package->id,
            'user_id' => $user?->id, // Can be null for anonymous purchases
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'quantity' => $request->travelers,
            'total_amount' => $totalAmount,
            'special_requests' => $request->special_requests,
            'status' => 'pending',
        ]);

        // If user is logged in, redirect to purchase confirmation
        if ($user) {
            return redirect()->route('purchase.confirmation', $purchase)
                ->with('success', 'Purchase request submitted successfully!');
        }

        // For anonymous users, redirect to login/register with purchase info
        return redirect()->route('register')
            ->with('purchase_id', $purchase->id)
            ->with('success', 'Purchase request submitted! Please create an account to track your purchase.');
    }

    public function purchaseConfirmation(Purchase $purchase): Response
    {
        // Ensure user can view this purchase
        if (Auth::user()->id !== $purchase->user_id && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $purchase->load('package');

        return Inertia::render('Purchase/Confirmation', [
            'purchase' => $purchase,
        ]);
    }

    public function myPurchases(): Response
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $purchases = $user->purchases()->with('package')->latest()->paginate(10);

        return Inertia::render('Purchase/MyPurchases', [
            'purchases' => $purchases,
        ]);
    }
}
