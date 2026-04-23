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
    public function create(B2cTravelPackage $b2cTravelPackage): Response|RedirectResponse
    {
        if (! $b2cTravelPackage->isOpenForRegistration()) {
            return redirect()
                ->route('b2c.packages')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Registration is closed: the package status is set to Closed in admin. Open it there to allow the registration form.',
                ]);
        }

        return Inertia::render('b2c/packages/register', [
            'package' => [
                'id' => $b2cTravelPackage->id,
                'slug' => $b2cTravelPackage->slug,
                'name' => $b2cTravelPackage->name,
                'departure_period' => $b2cTravelPackage->departure_period,
                'price_display' => $b2cTravelPackage->price_display,
                'terms_and_conditions' => $b2cTravelPackage->terms_and_conditions,
                'registration_deadline' => $b2cTravelPackage->registration_deadline?->toIso8601String() ?? '',
                'pax_capacity' => $b2cTravelPackage->pax_capacity,
                'pax_booked' => $b2cTravelPackage->pax_booked,
                'available_pax' => $b2cTravelPackage->availablePaxSlots(),
            ],
        ]);
    }

    public function store(StoreB2cPackageRegistrationRequest $request, B2cTravelPackage $b2cTravelPackage, B2cPackageRegistrationRegistrar $registrar): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $registrar->register($b2cTravelPackage, $validated);
        } catch (ValidationException $e) {
            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->withErrors($e->errors())
                ->withInput();
        }

        return redirect()
            ->route('b2c.packages')
            ->with('flash', ['type' => 'success', 'message' => 'Registration submitted successfully. We will contact you soon.']);
    }
}
