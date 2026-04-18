<?php

namespace App\Http\Controllers\B2b;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class B2bPortalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('b2b/index');
    }
}
