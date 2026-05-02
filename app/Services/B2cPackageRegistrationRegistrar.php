<?php

namespace App\Services;

use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class B2cPackageRegistrationRegistrar
{
    /**
     * @param  array<string, mixed>  $validated
     *                                           Keys: full_name, email, phone, passport_number, address, date_of_birth, gender, pax
     */
    public function register(B2cTravelPackage $package, array $validated): void
    {
        $pax = (int) $validated['pax'];
        $accountMode = (string) ($validated['account_mode'] ?? 'create');
        $accountPassword = (string) ($validated['account_password'] ?? '');

        DB::transaction(function () use ($validated, $pax, $package, $accountMode, $accountPassword) {
            /** @var B2cTravelPackage $locked */
            $locked = B2cTravelPackage::query()->whereKey($package->id)->lockForUpdate()->firstOrFail();

            if (! $locked->isOpenForRegistration()) {
                throw ValidationException::withMessages([
                    'package' => ['This package is not open for registration.'],
                ]);
            }

            if ($pax > $locked->availablePaxSlots()) {
                throw ValidationException::withMessages([
                    'pax' => ['Not enough seats available for the selected number of travelers.'],
                ]);
            }

            $email = (string) $validated['email'];
            $existingUser = User::query()->where('email', $email)->first();

            if ($accountMode === 'login') {
                if (! $existingUser || ! Hash::check($accountPassword, $existingUser->password)) {
                    throw ValidationException::withMessages([
                        'account_password' => ['Email atau password akun tidak valid.'],
                    ]);
                }
                $user = $existingUser;
                $user->forceFill(['name' => $validated['full_name']])->save();
            } else {
                if ($existingUser) {
                    throw ValidationException::withMessages([
                        'email' => ['Email sudah terdaftar. Pilih mode "Saya sudah punya akun" untuk login.'],
                    ]);
                }

                $user = User::query()->create([
                    'name' => $validated['full_name'],
                    'email' => $email,
                    'password' => Hash::make($accountPassword ?: Str::password(40)),
                ]);
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
                'registration_status' => 'pending',
                'payment_status' => 'unpaid',
                'visa_status' => 'not_processed',
                'ticket_status' => 'not_booked',
                'hotel_status' => 'not_assigned',
                'terms_accepted_at' => now(),
            ]);

            $locked->increment('pax_booked', $pax);
        });
    }
}
