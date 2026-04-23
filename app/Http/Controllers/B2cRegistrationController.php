<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreB2cPackageRegistrationRequest;
use App\Models\B2cTravelPackage;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class B2cRegistrationController extends Controller
{
    public function create(B2cTravelPackage $package): Response|RedirectResponse
    {
        if (! $package->isOpenForRegistration()) {
            return redirect()
                ->route('b2c.packages')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Registration is closed: the package status is set to Closed in admin. Open it there to allow the registration form.',
                ]);
        }

        return Inertia::render('b2c/packages/register', [
            'package' => [
                'id' => $package->id,
                'slug' => $package->slug,
                'name' => $package->name,
                'departure_period' => $package->departure_period,
                'price_display' => $package->price_display,
                'terms_and_conditions' => $package->terms_and_conditions,
                'registration_deadline' => $package->registration_deadline?->toIso8601String() ?? '',
                'pax_capacity' => $package->pax_capacity,
                'pax_booked' => $package->pax_booked,
                'available_pax' => $package->availablePaxSlots(),
            ],
        ]);
    }

    public function store(StoreB2cPackageRegistrationRequest $request, B2cTravelPackage $package, B2cPackageRegistrationRegistrar $registrar): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $registrar->register($package, $validated);
        } catch (ValidationException $e) {
            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $package->slug])
                ->withErrors($e->errors())
                ->withInput();
        }

        return redirect()
            ->route('b2c.packages')
            ->with('flash', ['type' => 'success', 'message' => 'Registration submitted successfully. We will contact you soon.']);
    }
}
