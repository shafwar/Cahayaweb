<?php

namespace App\Http\Controllers;

use App\Models\B2cTravelPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class B2cPublicPackageController extends Controller
{
    public function index(Request $request): Response
    {
        $rows = B2cTravelPackage::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        $travelPackages = $rows->isNotEmpty()
            ? $rows->map(fn (B2cTravelPackage $p) => $p->toCardProps())->values()->all()
            : [];

        return Inertia::render('b2c/packages/index', [
            'travelPackages' => $travelPackages,
            'flash' => $request->session()->pull('flash'),
        ]);
    }
}
