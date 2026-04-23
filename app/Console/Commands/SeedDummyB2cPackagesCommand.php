<?php

namespace App\Console\Commands;

use App\Models\B2cTravelPackage;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Inserts one or more open B2C packages with a future registration deadline for QA / demos.
 */
class SeedDummyB2cPackagesCommand extends Command
{
    protected $signature = 'b2c:seed-dummy-packages
                            {--count=1 : Number of packages to create}
                            {--deadline-days=45 : Registration deadline this many days from now (end of local day)}
                            {--capacity= : Pax capacity (default: 25)}';

    protected $description = 'Create open B2C travel package(s) with future deadline for registration testing';

    public function handle(): int
    {
        $count = max(1, min(50, (int) $this->option('count')));
        $deadlineDays = max(1, (int) $this->option('deadline-days'));
        $capacity = $this->option('capacity');
        $paxCapacity = $capacity !== null && $capacity !== ''
            ? max(1, min(9999, (int) $capacity))
            : 25;

        $deadline = Carbon::now(config('app.timezone'))->addDays($deadlineDays)->endOfDay();

        $this->info("Registration deadline (each package): {$deadline->toDateTimeString()} (app timezone)");
        $this->newLine();

        $created = [];

        for ($i = 1; $i <= $count; $i++) {
            $suffix = Str::upper(Str::random(6));
            $packageCode = 'DUMMY-'.$suffix.($count > 1 ? '-'.$i : '');
            if (B2cTravelPackage::query()->where('package_code', $packageCode)->exists()) {
                $packageCode = 'DUMMY-'.Str::upper(Str::random(8)).'-'.$i;
            }

            $name = $count > 1
                ? "[TEST] Umroh Reguler Dummy #{$i}"
                : '[TEST] Umroh Reguler Dummy — Registration Open';

            $slug = B2cTravelPackage::generateUniqueSlug($name, $packageCode);

            $pkg = B2cTravelPackage::query()->create([
                'slug' => $slug,
                'package_code' => $packageCode,
                'name' => $name,
                'departure_period' => $deadline->copy()->addMonths(2)->format('M Y').' (contoh)',
                'description' => 'Paket dummy untuk pengujian alur registrasi B2C. Peserta dapat mendaftar selama kuota dan batas pendaftaran masih berlaku.',
                'location' => 'Makkah & Madinah',
                'duration_label' => '9 hari 8 malam',
                'package_type' => 'Religious',
                'price_display' => 'Rp 35.000.000 / pax',
                'pax_capacity' => $paxCapacity,
                'pax_booked' => 0,
                'registration_deadline' => $deadline,
                'terms_and_conditions' => "1. Data peserta wajib benar.\n2. Pembayaran mengikuti ketentuan travel.\n3. Paket ini hanya untuk testing sistem.",
                'status' => 'open',
                'image_path' => null,
                'highlights_json' => [
                    'Visa & asuransi (contoh)',
                    'Makan 3× sehari',
                    'Tour guide berpengalaman',
                ],
                'features_json' => [
                    'Hotel jarak dekat Masjidil Haram',
                    'Manasik sebelum keberangkatan',
                ],
                'dates_json' => [
                    ['date' => $deadline->copy()->addWeek()->format('d M Y'), 'status' => 'Available'],
                    ['date' => $deadline->copy()->addWeeks(2)->format('d M Y'), 'status' => 'Available'],
                ],
                'hotels_json' => [
                    ['name' => 'Hotel Contoh Makkah', 'location' => 'Makkah', 'stars' => 4],
                    ['name' => 'Hotel Contoh Madinah', 'location' => 'Madinah', 'stars' => 4],
                ],
                'sort_order' => 0,
            ]);

            $created[] = $pkg;
            $this->line("Created: {$pkg->name} [{$pkg->package_code}] slug=<fg=cyan>{$pkg->slug}</>");
        }

        $this->newLine();
        $this->info('Public listing: '.route('b2c.packages', [], true));
        foreach ($created as $pkg) {
            $this->line('Register: '.route('b2c.packages.register', ['b2cTravelPackage' => $pkg->slug], true));
        }

        return self::SUCCESS;
    }
}
