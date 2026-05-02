<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreB2cPackageRegistrationRequest;
use App\Models\B2cPackageRegistration;
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
            'auth' => [
                'login_url' => route('login', ['mode' => 'b2c']),
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
            ->route('b2c.account')
            ->with('flash', [
                'type' => 'success',
                'message' => 'Registrasi berhasil dikirim dengan status Pending. Admin akan review terlebih dahulu.',
            ]);
    }

    public function account(): Response
    {
        $user = auth()->user();
        abort_unless($user, 403);

        $items = B2cPackageRegistration::query()
            ->with('package:id,name,slug,price_display')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(static function (B2cPackageRegistration $r) {
                return [
                    'id' => $r->id,
                    'registration_status' => $r->registration_status,
                    'payment_status' => $r->payment_status,
                    'visa_status' => $r->visa_status,
                    'ticket_status' => $r->ticket_status,
                    'hotel_status' => $r->hotel_status,
                    'notes' => $r->notes,
                    'reviewed_at' => $r->reviewed_at?->toIso8601String(),
                    'created_at' => $r->created_at?->toIso8601String(),
                    'pax' => $r->pax,
                    'full_name' => $r->full_name,
                    'package' => [
                        'name' => $r->package?->name ?? '(Package removed)',
                        'slug' => $r->package?->slug,
                        'price_display' => $r->package?->price_display ?? '—',
                    ],
                ];
            })
            ->values()
            ->all();

        return Inertia::render('b2c/account/index', [
            'registrations' => $items,
        ]);
    }
}
