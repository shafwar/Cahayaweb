<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreB2cPackageRegistrationRequest;
use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
                ->with('flash', ['type' => 'error', 'message' => 'Registration is closed for this package (deadline passed, full capacity, or package closed).']);
        }

        return Inertia::render('b2c/packages/register', [
            'package' => [
                'id' => $package->id,
                'slug' => $package->slug,
                'name' => $package->name,
                'departure_period' => $package->departure_period,
                'price_display' => $package->price_display,
                'terms_and_conditions' => $package->terms_and_conditions,
                'registration_deadline' => $package->registration_deadline->toIso8601String(),
                'pax_capacity' => $package->pax_capacity,
                'pax_booked' => $package->pax_booked,
                'available_pax' => $package->availablePaxSlots(),
            ],
        ]);
    }

    public function store(StoreB2cPackageRegistrationRequest $request, B2cTravelPackage $package): RedirectResponse
    {
        $validated = $request->validated();
        $pax = (int) $validated['pax'];

        DB::transaction(function () use ($validated, $pax, $package) {
            /** @var B2cTravelPackage $locked */
            $locked = B2cTravelPackage::query()->whereKey($package->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== 'open') {
                throw ValidationException::withMessages([
                    'package' => ['This package is not open for registration.'],
                ]);
            }
            if ($locked->registration_deadline->isPast()) {
                throw ValidationException::withMessages([
                    'package' => ['The registration deadline has passed.'],
                ]);
            }
            if ($pax > $locked->availablePaxSlots()) {
                throw ValidationException::withMessages([
                    'pax' => ['Not enough seats available for the selected number of travelers.'],
                ]);
            }

            $user = User::query()->firstOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['full_name'],
                    'password' => Hash::make(Str::password(40)),
                ]
            );

            if (! $user->wasRecentlyCreated) {
                $user->forceFill(['name' => $validated['full_name']])->save();
            }

            B2cPackageRegistration::query()->create([
                'b2c_travel_package_id' => $locked->id,
                'user_id' => $user->id,
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'passport_number' => $validated['passport_number'],
                'address' => $validated['address'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'departure_period_snapshot' => $locked->departure_period,
                'pax' => $pax,
                'terms_accepted_at' => now(),
            ]);

            $locked->increment('pax_booked', $pax);
            $locked->refresh();

            if ($locked->pax_booked >= $locked->pax_capacity) {
                $locked->forceFill(['status' => 'closed'])->save();
            }
        });

        return redirect()
            ->route('b2c.packages')
            ->with('flash', ['type' => 'success', 'message' => 'Registration submitted successfully. We will contact you soon.']);
    }
}
