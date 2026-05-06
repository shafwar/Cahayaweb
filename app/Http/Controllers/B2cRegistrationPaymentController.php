<?php

namespace App\Http\Controllers;

use App\Models\B2cPackageRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class B2cRegistrationPaymentController extends Controller
{
    public function upload(Request $request, B2cPackageRegistration $registration): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);
        abort_unless((int) $registration->user_id === (int) $user->id, 404);

        if ($registration->payment_status !== 'unpaid') {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Bukti pembayaran hanya bisa diunggah saat status pembayaran masih unpaid.',
            ]);
        }

        if ($registration->registration_status !== 'approved') {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Upload bukti pembayaran hanya tersedia setelah pendaftaran disetujui admin.',
            ]);
        }

        $validated = $request->validate([
            'payment_proof' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'payment_note' => ['nullable', 'string', 'max:3000'],
        ]);

        $path = $request->file('payment_proof')->store('b2c/payment-proofs');

        $registration->forceFill([
            'payment_proof' => $path,
            'payment_note' => $validated['payment_note'] ?? null,
            'payment_uploaded_at' => now(),
            'payment_status' => 'waiting_confirmation',
        ])->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.',
        ]);
    }
}
