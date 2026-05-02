<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreB2cPackageRegistrationRequest;
use App\Models\AgentVerification;
use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class B2cRegistrationController extends Controller
{
    public const SESSION_PENDING_REGISTRATION = 'b2c_package_registration_pending';

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
     * Step 1: participant only → redirect ke halaman register/login situs (mirip B2B).
     */
    public function store(StoreB2cPackageRegistrationRequest $request, B2cTravelPackage $b2cTravelPackage): RedirectResponse
    {
        $validated = $request->validated();

        $request->session()->put(self::SESSION_PENDING_REGISTRATION, [
            'package_id' => $b2cTravelPackage->id,
            'participant' => $validated,
            'created_at' => time(),
        ]);

        $finalizePath = route('b2c.packages.register.finalize', ['b2cTravelPackage' => $b2cTravelPackage->slug], false);

        $user = $request->user();
        if ($user !== null) {
            if (strtolower((string) $user->email) !== strtolower((string) $validated['email'])) {
                return redirect()->route('login', ['mode' => 'b2c', 'redirect' => $finalizePath])
                    ->with('error', 'Anda sedang masuk dengan email lain. Keluar atau masuk dengan email yang sama seperti di formulir paket ('.$validated['email'].').');
            }

            return redirect()->to($finalizePath)
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Lanjutkan untuk menyelesaikan pengiriman pendaftaran.',
                ]);
        }

        return redirect()->route('login', [
            'mode' => 'b2c',
            'redirect' => $finalizePath,
        ])->with('status', 'Masuk atau daftar untuk menyelesaikan pengajuan paket Anda.');
    }

    /**
     * Legacy URL: /packages/register/{pkg}/account → arahkan ke /login?mode=b2c&redirect=.../finalize
     */
    public function legacyAccountStep(Request $request, B2cTravelPackage $b2cTravelPackage): RedirectResponse
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
        $finalizePath = route('b2c.packages.register.finalize', ['b2cTravelPackage' => $b2cTravelPackage->slug], false);

        $user = $request->user();
        if ($user !== null) {
            if (strtolower((string) $user->email) !== strtolower((string) $participant['email'])) {
                return redirect()->route('login', ['mode' => 'b2c', 'redirect' => $finalizePath])
                    ->with('error', 'Anda sedang masuk dengan email lain. Masuk dengan '.$participant['email'].' untuk melanjutkan.');
            }

            return redirect()->to($finalizePath);
        }

        return redirect()->route('login', [
            'mode' => 'b2c',
            'redirect' => $finalizePath,
        ])->with('status', 'Masuk atau daftar untuk menyelesaikan pengajuan paket Anda.');
    }

    public function finalize(Request $request, B2cTravelPackage $b2cTravelPackage, B2cPackageRegistrationRegistrar $registrar): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);

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

        try {
            $record = $registrar->registerAuthenticated($b2cTravelPackage, $user, $participant);
        } catch (ValidationException $e) {
            $errs = $e->errors();

            if (isset($errs['email'])) {
                Auth::logout();
                $request->session()->regenerateToken();

                return redirect()->route('login', [
                    'mode' => 'b2c',
                    'redirect' => route('b2c.packages.register.finalize', ['b2cTravelPackage' => $b2cTravelPackage->slug], false),
                ])
                    ->withErrors($errs)
                    ->with('error', 'Email akun tidak cocok dengan formulir paket. Silakan masuk dengan akun yang benar.');
            }

            $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

            return redirect()
                ->route('b2c.account')
                ->withErrors($errs)
                ->with('flash', [
                    'type' => 'error',
                    'message' => $errs['package'][0] ?? 'Tidak dapat menyelesaikan pendaftaran.',
                ]);
        }

        $request->session()->forget(self::SESSION_PENDING_REGISTRATION);

        return redirect()
            ->route('b2c.packages.submitted', ['registration' => $record->id])
            ->with('flash', [
                'type' => 'success',
                'message' => 'Pendaftaran paket berhasil dikirim.',
            ]);
    }

    public function submissionComplete(Request $request, B2cPackageRegistration $registration): Response
    {
        $user = $request->user();
        abort_unless($user, 403);
        abort_unless($registration->user_id === $user->id, 404);

        $registration->load('package:id,name,slug,price_display');

        return Inertia::render('b2c/packages/submission-complete', [
            'registration' => [
                'id' => $registration->id,
                'registration_status' => $registration->registration_status,
                'full_name' => $registration->full_name,
                'pax' => $registration->pax,
                'package' => [
                    'name' => $registration->package?->name ?? '(Paket dihapus)',
                    'slug' => $registration->package?->slug,
                    'price_display' => $registration->package?->price_display ?? '—',
                ],
            ],
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

        $verification = AgentVerification::query()->where('user_id', $user->id)->latest()->first();

        $b2bPortal = [
            'has_application' => $verification !== null,
            'status' => $verification?->status ?? 'none',
            'company_name' => $verification?->company_name,
            'reviewed_at' => $verification?->reviewed_at?->toIso8601String(),
        ];

        return Inertia::render('b2c/account/index', [
            'registrations' => $items,
            'b2bPortal' => $b2bPortal,
        ]);
    }
}
