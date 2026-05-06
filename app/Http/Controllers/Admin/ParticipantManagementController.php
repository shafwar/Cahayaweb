<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Services\RegistrationReviewNotifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'package_id' => $request->query('package_id'),
            'registration_status' => $request->query('registration_status'),
            'payment_status' => $request->query('payment_status'),
            'search' => trim((string) $request->query('search', '')),
        ];

        $query = B2cPackageRegistration::query()
            ->with(['package:id,name,slug', 'user:id,name,email'])
            ->orderByDesc('created_at');

        if ($filters['package_id']) {
            $query->where('b2c_travel_package_id', (int) $filters['package_id']);
        }
        if ($filters['registration_status']) {
            $query->where('registration_status', $filters['registration_status']);
        }
        if ($filters['payment_status']) {
            $query->where('payment_status', $filters['payment_status']);
        }
        if ($filters['search'] !== '') {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('full_name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            });
        }

        $items = $query->paginate(25)->withQueryString()->through(static function (B2cPackageRegistration $r) {
            return [
                'id' => $r->id,
                'full_name' => $r->full_name,
                'email' => $r->email,
                'phone' => $r->phone,
                'package_name' => $r->package?->name ?? '(Package removed)',
                'package_id' => $r->b2c_travel_package_id,
                'registration_status' => $r->registration_status,
                'payment_status' => $r->payment_status,
                'visa_status' => $r->visa_status,
                'ticket_status' => $r->ticket_status,
                'hotel_status' => $r->hotel_status,
                'created_at' => $r->created_at?->toIso8601String(),
                'updated_at' => $r->updated_at?->toIso8601String(),
            ];
        });

        $packages = B2cTravelPackage::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (B2cTravelPackage $p) => ['id' => $p->id, 'name' => $p->name])
            ->values()
            ->all();

        return Inertia::render('admin/participants/index', [
            'participants' => $items,
            'packages' => $packages,
            'filters' => $filters,
            'flash' => $request->session()->pull('flash'),
        ]);
    }

    /**
     * Hapus banyak baris registrasi B2C sekaligus (boleh lintas paket). Kuota pax_booked per paket dikurangi;
     * akun user tidak dihapus (sama seperti hapus satu di halaman paket).
     */
    public function destroyMultiple(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:200'],
            'ids.*' => ['integer', 'distinct', 'exists:b2c_package_registrations,id'],
        ]);

        $ids = array_values(array_unique(array_map(intval(...), $validated['ids'])));

        $deleted = DB::transaction(function () use ($ids) {
            $regs = B2cPackageRegistration::query()
                ->whereIn('id', $ids)
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            if ($regs->count() !== count($ids)) {
                throw ValidationException::withMessages([
                    'ids' => ['Beberapa registrasi tidak ditemukan atau sudah dihapus.'],
                ]);
            }

            $deltas = [];
            foreach ($regs as $r) {
                $pid = $r->b2c_travel_package_id;
                $deltas[$pid] = ($deltas[$pid] ?? 0) + (int) $r->pax;
            }

            B2cPackageRegistration::query()->whereIn('id', $ids)->delete();

            ksort($deltas);

            foreach ($deltas as $packageId => $totalPax) {
                /** @var B2cTravelPackage $pkg */
                $pkg = B2cTravelPackage::query()->whereKey($packageId)->lockForUpdate()->firstOrFail();
                $pkg->forceFill([
                    'pax_booked' => max(0, $pkg->pax_booked - $totalPax),
                ])->save();
            }

            return $regs->count();
        });

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$deleted} registrasi B2C dihapus. Akun pengguna tetap ada; kuota paket sudah diperbarui.",
        ]);
    }

    public function show(Request $request, B2cPackageRegistration $participant): Response
    {
        $participant->load(['package:id,name,slug,package_code,price_display,departure_period', 'user:id,name,email,created_at']);

        $slug = $participant->package?->slug;
        $packageRegistrationsUrl = is_string($slug) && $slug !== ''
            ? route('admin.b2c-packages.registrations', ['b2cTravelPackage' => $slug], false)
            : null;

        return Inertia::render('admin/participants/show', [
            'participant' => [
                'id' => $participant->id,
                'full_name' => $participant->full_name,
                'email' => $participant->email,
                'phone' => $participant->phone,
                'passport_number' => $participant->passport_number,
                'address' => $participant->address,
                'date_of_birth' => $participant->date_of_birth?->format('Y-m-d'),
                'gender' => $participant->gender,
                'departure_period_snapshot' => (string) ($participant->departure_period_snapshot ?? ''),
                'pax' => $participant->pax,
                'registration_status' => $participant->registration_status,
                'payment_status' => $participant->payment_status,
                'payment_proof' => $participant->payment_proof,
                'payment_proof_url' => $participant->payment_proof ? Storage::url($participant->payment_proof) : null,
                'payment_note' => $participant->payment_note,
                'payment_uploaded_at' => $participant->payment_uploaded_at?->toIso8601String(),
                'visa_status' => $participant->visa_status,
                'ticket_status' => $participant->ticket_status,
                'hotel_status' => $participant->hotel_status,
                'notes' => $participant->notes,
                'reviewed_at' => $participant->reviewed_at?->toIso8601String(),
                'created_at' => $participant->created_at?->toIso8601String(),
                'updated_at' => $participant->updated_at?->toIso8601String(),
                'user' => [
                    'id' => $participant->user?->id,
                    'name' => $participant->user?->name,
                    'email' => $participant->user?->email,
                ],
                'package' => [
                    'id' => $participant->package?->id,
                    'name' => $participant->package?->name ?? '(Package removed)',
                    'slug' => $participant->package?->slug,
                    'package_code' => $participant->package?->package_code,
                    'price_display' => $participant->package?->price_display,
                    'departure_period' => $participant->package?->departure_period,
                ],
            ],
            'package_registrations_url' => $packageRegistrationsUrl,
            'flash' => $request->session()->pull('flash'),
        ]);
    }

    public function update(Request $request, B2cPackageRegistration $participant): RedirectResponse
    {
        $validated = $request->validate([
            'registration_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'payment_status' => ['required', Rule::in(['unpaid', 'waiting_confirmation', 'paid'])],
            'visa_status' => ['required', Rule::in(['not_processed', 'in_progress', 'completed'])],
            'ticket_status' => ['required', Rule::in(['not_booked', 'booked'])],
            'hotel_status' => ['required', Rule::in(['not_assigned', 'assigned'])],
            'notes' => ['nullable', 'string', 'max:4000'],
        ]);

        $oldRegistrationStatus = $participant->registration_status;

        $participant->forceFill([
            'registration_status' => $validated['registration_status'],
            'payment_status' => $validated['payment_status'],
            'visa_status' => $validated['visa_status'],
            'ticket_status' => $validated['ticket_status'],
            'hotel_status' => $validated['hotel_status'],
            'notes' => $validated['notes'],
        ]);

        if ($validated['registration_status'] !== $oldRegistrationStatus) {
            $participant->reviewed_by = auth()->id();
            $participant->reviewed_at = now();
        }

        $participant->save();

        $fresh = $participant->fresh(['package']);

        if ($oldRegistrationStatus !== 'approved' && $fresh->registration_status === 'approved') {
            RegistrationReviewNotifier::notifyB2cParticipant($fresh, true);
        }
        if ($oldRegistrationStatus !== 'rejected' && $fresh->registration_status === 'rejected') {
            RegistrationReviewNotifier::notifyB2cParticipant($fresh, false, $validated['notes'] ?? null);
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Data peserta berhasil diperbarui.',
        ]);
    }

    public function markPaymentPaid(B2cPackageRegistration $participant): RedirectResponse
    {
        if (! in_array($participant->payment_status, ['waiting_confirmation', 'unpaid'], true)) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Status pembayaran ini tidak dapat ditandai paid.',
            ]);
        }

        if ($participant->payment_proof === null || $participant->payment_proof === '') {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Belum ada bukti pembayaran yang diunggah pengguna.',
            ]);
        }

        $participant->forceFill([
            'payment_status' => 'paid',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ])->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pembayaran ditandai paid.',
        ]);
    }

    public function rejectPayment(B2cPackageRegistration $participant): RedirectResponse
    {
        if ($participant->payment_status !== 'waiting_confirmation') {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Hanya pembayaran yang menunggu konfirmasi yang bisa direject.',
            ]);
        }

        $participant->forceFill([
            'payment_status' => 'unpaid',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ])->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pembayaran direject dan dikembalikan ke unpaid.',
        ]);
    }
}
