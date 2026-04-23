<?php

namespace App\Http\Controllers;

use App\Models\B2cTravelPackage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Cacheable B2C marketing / public Inertia pages (no route closures).
 */
class B2cPageController extends Controller
{
    public function root(): Response
    {
        return Inertia::render('landing/select-mode', ['autoRedirectToB2c' => true]);
    }

    public function selectMode(): Response
    {
        return Inertia::render('landing/select-mode', ['autoRedirectToB2c' => false]);
    }

    public function home(): Response
    {
        return Inertia::render('b2c/home');
    }

    public function about(): Response
    {
        return Inertia::render('b2c/about');
    }

    public function destinations(): Response
    {
        return Inertia::render('b2c/destinations');
    }

    public function packageShow(string $slug): Response
    {
        return Inertia::render('b2c/packages/show', ['slug' => $slug]);
    }

    public function highlights(): Response
    {
        return Inertia::render('b2c/highlights');
    }

    public function blogIndex(): Response
    {
        return Inertia::render('b2c/blog/index');
    }

    public function blogShow(string $id): Response
    {
        return Inertia::render('b2c/blog/[id]', ['id' => $id]);
    }

    public function contact(): Response
    {
        return Inertia::render('b2c/contact');
    }

    public function search(): Response
    {
        return Inertia::render('b2c/search', [
            'travelPackages' => B2cTravelPackage::publicCatalogCards(),
        ]);
    }
}
