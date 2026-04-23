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
        return Inertia::render('b2c/packages/index', [
            'travelPackages' => B2cTravelPackage::publicCatalogCards(),
            'flash' => $request->session()->pull('flash'),
        ]);
    }
}
