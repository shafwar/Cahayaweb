<?php

namespace App\Services;

use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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

        [$registrationId, $welcomeUserId] = DB::transaction(function () use ($validated, $pax, $package, $accountMode, $accountPassword) {
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
            $welcomeUserId = null;

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
                $welcomeUserId = $user->id;
            }

            $registration = B2cPackageRegistration::query()->create([
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

            return [$registration->id, $welcomeUserId];
        });

        $registrationModel = B2cPackageRegistration::query()->with('package')->find($registrationId);
        if ($registrationModel instanceof B2cPackageRegistration) {
            $alert = InboundLeadNotifier::notifyAdminsB2cRegistration($registrationModel);
            if ($alert['sent'] === 0) {
                Log::warning('B2C package registration saved but admin inbox alert was not delivered.', [
                    'registration_id' => $registrationModel->id,
                    'errors' => $alert['errors'],
                ]);
            }
            $userMail = InboundLeadNotifier::notifyUserB2cRegistrationReceived($registrationModel);
            if ($userMail['sent'] === 0) {
                Log::warning('B2C package registration saved but participant confirmation email was not delivered.', [
                    'registration_id' => $registrationModel->id,
                    'errors' => $userMail['errors'],
                ]);
            }
        }

        if ($welcomeUserId !== null) {
            $newUser = User::query()->find($welcomeUserId);
            if ($newUser instanceof User) {
                InboundLeadNotifier::notifyUserWelcome($newUser);
            }
        }
    }

    /**
     * Complete a B2C package registration for an already authenticated user (same User table as B2B).
     * Participant email must match the signed-in account.
     *
     * @param  array<string, mixed>  $participant  Validated participant fields from step 1 (no account_* keys).
     */
    public function registerAuthenticated(B2cTravelPackage $package, User $user, array $participant): B2cPackageRegistration
    {
        $pax = (int) $participant['pax'];

        $record = DB::transaction(function () use ($participant, $pax, $package, $user) {
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

            $participantEmail = strtolower((string) $participant['email']);
            if (strtolower($user->email) !== $participantEmail) {
                throw ValidationException::withMessages([
                    'email' => ['Email akun Anda harus sama dengan email pada formulir paket. Silakan masuk dengan akun yang benar.'],
                ]);
            }

            $blocked = B2cPackageRegistration::query()
                ->where('user_id', $user->id)
                ->where('b2c_travel_package_id', $locked->id)
                ->whereIn('registration_status', ['pending', 'approved'])
                ->exists();

            if ($blocked) {
                throw ValidationException::withMessages([
                    'package' => ['Anda sudah memiliki pendaftaran aktif untuk paket ini.'],
                ]);
            }

            $user->forceFill(['name' => $participant['full_name']])->save();

            $record = B2cPackageRegistration::query()->create([
                'b2c_travel_package_id' => $locked->id,
                'user_id' => $user->id,
                'full_name' => $participant['full_name'],
                'email' => $participant['email'],
                'phone' => $participant['phone'],
                'passport_number' => $participant['passport_number'],
                'address' => $participant['address'],
                'date_of_birth' => $participant['date_of_birth'],
                'gender' => $participant['gender'],
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

            return $record;
        });

        $fresh = $record->fresh(['package']);
        $alert = InboundLeadNotifier::notifyAdminsB2cRegistration($fresh);
        if ($alert['sent'] === 0) {
            Log::warning('B2C package registration (authenticated) saved but admin inbox alert was not delivered.', [
                'registration_id' => $record->id,
                'errors' => $alert['errors'],
            ]);
        }
        if ($fresh instanceof B2cPackageRegistration) {
            $userMail = InboundLeadNotifier::notifyUserB2cRegistrationReceived($fresh);
            if ($userMail['sent'] === 0) {
                Log::warning('B2C package registration (authenticated) saved but participant confirmation email was not delivered.', [
                    'registration_id' => $record->id,
                    'errors' => $userMail['errors'],
                ]);
            }
        }

        return $record;
    }
}
