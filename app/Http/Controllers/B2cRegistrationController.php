<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteB2cPackageRegistrationRequest;
use App\Http\Requests\StoreB2cPackageRegistrationRequest;
use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class B2cRegistrationController extends Controller
{
    private const SESSION_PENDING_REGISTRATION = 'b2c_package_registration_pending';

    private const SESSION_PENDING_TTL_SECONDS = 2700;

    public function create(Request $request, B2cTravelPackage $b2cTravelPackage): Response|RedirectResponse
    {
        if (! $b2cTravelPackage->isOpenForRegistration()) {
            return redirect()
                ->route('b2c.packages')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Registration is closed: the package status is set to Closed in admin. Open it there to allow the registration form.',
                ]);
        }

        $draftParticipant = null;
        $pending = $request->session()->get(self::SESSION_PENDING_REGISTRATION);
        if (
            is_array($pending)
            && (int) ($pending['package_id'] ?? 0) === $b2cTravelPackage->id
            && isset($pending['participant'], $pending['created_at'])
            && (time() - (int) $pending['created_at']) <= self::SESSION_PENDING_TTL_SECONDS
        ) {
            $draftParticipant = $pending['participant'];
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
            'draftParticipant' => $draftParticipant,
        ]);
    }

    /**
     * Step 1: validate participant fields only; stash in session for account step (B2B-style flow).
     */
    public function store(StoreB2cPackageRegistrationRequest $request, B2cTravelPackage $b2cTravelPackage): RedirectResponse
    {
        $validated = $request->validated();

        $request->session()->put(self::SESSION_PENDING_REGISTRATION, [
            'package_id' => $b2cTravelPackage->id,
            'participant' => $validated,
            'created_at' => time(),
        ]);

        return redirect()
            ->route('b2c.packages.register.account', ['b2cTravelPackage' => $b2cTravelPackage->slug])
            ->with('flash', [
                'type' => 'success',
                'message' => 'Data peserta tersimpan. Lanjutkan dengan membuat akun atau masuk.',
            ]);
    }

    public function complete(Request $request, B2cTravelPackage $b2cTravelPackage): Response|RedirectResponse
    {
        if (! $b2cTravelPackage->isOpenForRegistration()) {
            $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

            return redirect()
                ->route('b2c.packages')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Registration is closed: the package status is set to Closed in admin.',
                ]);
        }

        $pending = $request->session()->get(self::SESSION_PENDING_REGISTRATION);
        if (
            ! is_array($pending)
            || (int) ($pending['package_id'] ?? 0) !== $b2cTravelPackage->id
            || ! isset($pending['participant'], $pending['created_at'])
        ) {
            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Silakan isi formulir pendaftaran terlebih dahulu.',
                ]);
        }

        if ((time() - (int) $pending['created_at']) > self::SESSION_PENDING_TTL_SECONDS) {
            $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Sesi pendaftaran berakhir. Silakan kirim ulang data peserta.',
                ]);
        }

        $participant = $pending['participant'];

        return Inertia::render('b2c/packages/register-account', [
            'package' => [
                'id' => $b2cTravelPackage->id,
                'slug' => $b2cTravelPackage->slug,
                'name' => $b2cTravelPackage->name,
                'price_display' => $b2cTravelPackage->price_display,
                'departure_period' => $b2cTravelPackage->departure_period,
            ],
            'participant' => [
                'full_name' => $participant['full_name'],
                'email' => $participant['email'],
                'phone' => $participant['phone'],
                'pax' => (int) $participant['pax'],
            ],
            'login_url' => route('login', ['mode' => 'b2c']),
            'register_form_url' => route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug]),
        ]);
    }

    public function completeStore(
        Request $request,
        CompleteB2cPackageRegistrationRequest $accountRequest,
        B2cTravelPackage $b2cTravelPackage,
        B2cPackageRegistrationRegistrar $registrar,
    ): RedirectResponse {
        $pending = $request->session()->get(self::SESSION_PENDING_REGISTRATION);
        if (
            ! is_array($pending)
            || (int) ($pending['package_id'] ?? 0) !== $b2cTravelPackage->id
            || ! isset($pending['participant'], $pending['created_at'])
        ) {
            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Silakan isi formulir pendaftaran terlebih dahulu.',
                ]);
        }

        if ((time() - (int) $pending['created_at']) > self::SESSION_PENDING_TTL_SECONDS) {
            $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

            return redirect()
                ->route('b2c.packages.register', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Sesi pendaftaran berakhir. Silakan kirim ulang data peserta.',
                ]);
        }

        if (! $b2cTravelPackage->isOpenForRegistration()) {
            $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

            return redirect()
                ->route('b2c.packages')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Registration is closed: the package status is set to Closed in admin.',
                ]);
        }

        $participant = $pending['participant'];
        $account = $accountRequest->validated();
        $merged = array_merge($participant, $account);

        try {
            $registrar->register($b2cTravelPackage, $merged);
        } catch (ValidationException $e) {
            return redirect()
                ->route('b2c.packages.register.account', ['b2cTravelPackage' => $b2cTravelPackage->slug])
                ->withErrors($e->errors())
                ->withInput($account);
        }

        $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

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
