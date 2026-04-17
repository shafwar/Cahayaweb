<?php

namespace Database\Seeders;

use App\Models\B2cTravelPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Imports the former hardcoded LEGACY_PACKAGES_DATA (packages page) into b2c_travel_packages.
 * Idempotent: keyed by package_code prefix LEGACY-01- … LEGACY-11-.
 *
 * Run: php artisan db:seed --class=LegacyB2cTravelPackagesSeeder
 */
class LegacyB2cTravelPackagesSeeder extends Seeder
{
    private const DEFAULT_DEADLINE = '2027-11-30 23:59:00';

    private const DEFAULT_TERMS = <<<'TXT'
Harga, tanggal keberangkatan, dan ketersediaan kursi dapat berubah. Hubungi Cahaya Anbiya untuk konfirmasi terbaru sebelum melakukan pembayaran.
Syarat umum: paspor berlaku minimal 6 bulan, pembatalan mengikuti kebijakan maskapai dan pihak penyedia jasa terkait.
TXT;

    public function run(): void
    {
        $deadline = Carbon::parse(self::DEFAULT_DEADLINE, config('app.timezone'));

        foreach ($this->legacyRows() as $row) {
            $packageCode = $row['package_code'];
            unset($row['package_code']);

            $slug = B2cTravelPackage::generateUniqueSlug($row['name'], $packageCode);

            B2cTravelPackage::query()->firstOrCreate(
                ['package_code' => $packageCode],
                array_merge($row, [
                    'slug' => $slug,
                    'registration_deadline' => $deadline,
                    'terms_and_conditions' => self::DEFAULT_TERMS,
                ])
            );
        }

        if ($this->command) {
            $this->command->info('Legacy B2C packages seeded (skipped if package_code already exists).');
        }
    }

    /**
     * @return list<array{package_code: string, name: string, departure_period: string, description: string, location: ?string, duration_label: ?string, package_type: string, price_display: string, pax_capacity: int, pax_booked: int, status: string, image_path: ?string, highlights_json: array, features_json: array, dates_json: array, hotels_json: array, sort_order: int, terms_and_conditions?: string}>
     */
    private function legacyRows(): array
    {
        return [
            [
                'package_code' => 'LEGACY-01-KONSORSIUM-MESIR-AQSA-JORDAN',
                'name' => 'Konsorsium Mesir Aqsa Jordan',
                'departure_period' => 'Oktober 2025',
                'description' => 'Where does the heart stir most? Here: trace the footsteps of three countries in one journey—Egypt, Aqsa, and Jordan. This is not just tourism; we follow the paths of the prophets, learn their stories, and find meaning in every step.',
                'location' => 'Jordan, Palestina & Mesir',
                'duration_label' => '9D8N',
                'package_type' => 'Religious',
                'price_display' => '$2,300',
                'pax_capacity' => 25,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages1.png',
                'highlights_json' => ['Petra', 'Museum Mummy', 'Camel', 'Nile Cruise', 'Pyramid & Sphinx', 'Masjid Al Aqsa'],
                'features_json' => ['Dinner Nile Cruise', 'Camel ride in Egypt', 'Petra', 'Mummy Museum', 'Guide tips $80 (excluded)'],
                'dates_json' => [['date' => 'Oktober 2025', 'status' => 'Available']],
                'hotels_json' => [
                    ['name' => 'Golden Tulip', 'location' => 'Amman', 'stars' => 4],
                    ['name' => 'Holyland', 'location' => 'Jerusalem', 'stars' => 4],
                    ['name' => 'Mega Club', 'location' => 'Taba', 'stars' => 4],
                    ['name' => 'Azal Pyramid', 'location' => 'Cairo', 'stars' => 4],
                ],
                'sort_order' => 1,
            ],
            [
                'package_code' => 'LEGACY-02-3-COUNTRIES-1-JOURNEY',
                'name' => '3 Countries in 1 Journey',
                'departure_period' => 'Oktober 2025',
                'description' => 'Three countries in one trip: Jordan, Palestine, and Egypt in 10 days. Follow the footsteps of the Prophets, explore history, and find peace. All in one unforgettable journey.',
                'location' => 'Jordan, Palestine & Egypt',
                'duration_label' => '10D9N',
                'package_type' => 'Religious',
                'price_display' => '$2,300',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages2.png',
                'highlights_json' => ['Footsteps of the Prophets', 'Historical travel', 'Spiritual renewal', 'Peaceful moments'],
                'features_json' => ['Footsteps of the Prophets', 'Historical tours', 'Spiritual renewal', 'Peaceful moments', 'Limited seats'],
                'dates_json' => [['date' => 'Oktober 2025', 'status' => 'Limited']],
                'hotels_json' => [],
                'sort_order' => 2,
            ],
            [
                'package_code' => 'LEGACY-03-10-HARI-JORDAN-AQSA-MESIR',
                'name' => '10 Hari Jordan Aqsa Mesir',
                'departure_period' => 'Agustus – Desember 2025 (beberapa jadwal)',
                'description' => 'Imagine standing before Al-Aqsa, feeling the peace of prayer. Walk through majestic Petra, sail the Nile, and watch the sun set behind the Pyramids. A 10-day spiritual, historical journey to Jordan, Aqsa & Egypt—more than a tour, an experience of meaning.',
                'location' => 'Jordan, Aqsa & Mesir',
                'duration_label' => '10D9N',
                'package_type' => 'Religious',
                'price_display' => '$2,300',
                'pax_capacity' => 30,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages3.png',
                'highlights_json' => ['Pharaoh Mummy Museum', 'Petra', 'Nile Cruise', 'Camel Ride', 'FREE WiFi', 'Prayer times observed'],
                'features_json' => [
                    'Halal meals',
                    'Prayer times observed',
                    '4-star or equivalent hotels',
                    'Free Wi-Fi',
                    'Comfortable and safe guided tour',
                    'Free snack on the bus',
                ],
                'dates_json' => [
                    ['date' => '21 Agustus 2025', 'status' => 'Sold Out'],
                    ['date' => '23 September 2025', 'status' => 'Sold Out'],
                    ['date' => '30 Oktober 2025', 'status' => 'Limited'],
                    ['date' => '5 Desember 2025', 'status' => 'Limited'],
                ],
                'hotels_json' => [
                    ['name' => 'Golden Tulip', 'location' => 'Amman', 'stars' => 4],
                    ['name' => 'Holyland', 'location' => 'Jerusalem', 'stars' => 4],
                    ['name' => 'Mega Club', 'location' => 'Taba', 'stars' => 4],
                    ['name' => 'Azal Pyramid', 'location' => 'Cairo', 'stars' => 4],
                ],
                'sort_order' => 3,
            ],
            [
                'package_code' => 'LEGACY-04-PROGRAM-3TAN-2026',
                'name' => 'PROGRAM 3TAN 2026',
                'departure_period' => '2026 — Uzbekistan | Kyrgyzstan | Kazakhstan',
                'description' => 'Eid moment at 3TAN 2026! Explore Uzbekistan, Kyrgyzstan, and Kazakhstan in 8 days. Includes round-trip flights, 3-star hotels, transport, breakfast, tour leader & local guide. FREE Shymbulak cable car & high-speed train ticket.',
                'location' => 'Uzbekistan | Kyrgyzstan | Kazakhstan',
                'duration_label' => '8 Days',
                'package_type' => 'Cultural',
                'price_display' => 'Rp 26,9 JT (Excl. Insurance & Tipping)',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-4.jpeg',
                'highlights_json' => ['Shymbulak cable car', 'High-speed train', 'Central Asian Islamic architecture', 'Samarkand & Bukhara'],
                'features_json' => [
                    'Round-trip flights',
                    '3-star hotels',
                    'Transport',
                    'Breakfast',
                    'Tour leader & local guide',
                    'FREE Shymbulak cable car',
                    'FREE high-speed train ticket',
                ],
                'dates_json' => [
                    ['date' => '4 Februari 2026 (Winter)', 'status' => 'Available'],
                    ['date' => '19 Maret 2026 (Spring)', 'status' => 'Available'],
                    ['date' => '9 April 2026 (Spring)', 'status' => 'Available'],
                    ['date' => '29 Juni 2026 (School Holiday)', 'status' => 'Available'],
                    ['date' => '24 Desember 2026 (Year-End)', 'status' => 'Limited'],
                ],
                'hotels_json' => [],
                'sort_order' => 4,
            ],
            [
                'package_code' => 'LEGACY-05-EGYPT-AQSA-JORDAN',
                'name' => 'EGYPT AQSA JORDAN',
                'departure_period' => '14 April 2026',
                'description' => '10-Day Consortium Package (JORDAN-AQSA-EGYPT). BONUS: Free Nile cruise, Free Mummy Museum ticket, Free Wadi Rum jeep tour, Free Petra ticket. Total ALL IN: $2,455.',
                'location' => 'Jordan • Aqsa • Egypt',
                'duration_label' => '10 Days',
                'package_type' => 'Religious',
                'price_display' => '$2,350 (was $2,500) — Exc. Tips Guide $80 & Asuransi $25',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-5.jpeg',
                'highlights_json' => [
                    'Pyramid & Sphinx',
                    'Sinai',
                    'Komplek Al-Aqsa',
                    'Jericho',
                    'Maqam Nabi Musa',
                    'Hebron',
                    'Bethlehem',
                    'Petra',
                    'Wadirum',
                    'Gua Ashhabul Kahfi',
                ],
                'features_json' => ['Free Nile Cruise', 'Free Mummy Museum ticket', 'Free Wadi Rum jeep tour', 'Free Petra ticket'],
                'dates_json' => [['date' => '14 April 2026', 'status' => 'Available']],
                'hotels_json' => [
                    ['name' => 'Pyramid/Azal/setaraf', 'location' => 'Cairo', 'stars' => 4],
                    ['name' => 'Mega Club/setaraf', 'location' => 'Taba', 'stars' => 4],
                    ['name' => 'National/setaraf', 'location' => 'Jerusalem', 'stars' => 3],
                    ['name' => 'Sulaf luxury/setaraf', 'location' => 'Amman', 'stars' => 4],
                ],
                'sort_order' => 5,
            ],
            [
                'package_code' => 'LEGACY-06-EGYPT-AQSA-JORDAN-EID',
                'name' => 'EGYPT AQSA JORDAN Eid al-Adha',
                'departure_period' => '22 Mei 2026',
                'description' => 'Special Eid al-Adha at Aqsa! 9-day journey to Jordan, Aqsa, and Egypt. FREE Nile Cruise, Mummy Museum ticket, Petra ticket, Wadi Rum.',
                'location' => 'Jordan • Aqsa • Egypt',
                'duration_label' => '9 Days',
                'package_type' => 'Religious',
                'price_display' => '$2,450 (was $2,700) — Exc. Asuransi $25 & Tipping $80',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-6.jpeg',
                'highlights_json' => ['Eid al-Adha at Aqsa', 'Nile Cruise', 'Mummy Museum ticket', 'Petra', 'Wadi Rum'],
                'features_json' => ['Nile Cruise', 'Mummy Museum ticket', 'Petra ticket', 'Wadi Rum'],
                'dates_json' => [['date' => '22 Mei 2026', 'status' => 'Available']],
                'hotels_json' => [
                    ['name' => 'Armada/Sulaf', 'location' => 'Jordan', 'stars' => 4],
                    ['name' => 'National', 'location' => 'Aqsa', 'stars' => 4],
                    ['name' => 'Pyramid Front/Azal', 'location' => 'Cairo', 'stars' => 4],
                    ['name' => 'Nuweiba', 'location' => 'Taba', 'stars' => 4],
                ],
                'sort_order' => 6,
            ],
            [
                'package_code' => 'LEGACY-07-JORDAN-AQSA',
                'name' => 'JORDAN AQSA',
                'departure_period' => '2026 — beberapa jadwal (Feb–Nov)',
                'description' => '2026 TRAVEL PACKAGE - 8 Days Jordan Aqsa. 100% FREE Petra Wadi Rum ticket! 4-star hotels in Jordan & Aqsa. Register now, limited seats!',
                'location' => 'Jordan & Palestine',
                'duration_label' => '8 Days',
                'package_type' => 'Religious',
                'price_display' => '$2,150 (was $2,190)',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-7.jpeg',
                'highlights_json' => ['100% FREE Petra Wadi Rum ticket', 'Dome of the Rock', 'Petra', 'Wadi Rum'],
                'features_json' => ['100% FREE Petra Wadi Rum ticket', 'Hotel Jordan Armada/Sulaf ★★★★', 'Hotel Aqsa National ★★★★'],
                'dates_json' => [
                    ['date' => '9 Februari 2026', 'status' => 'Available'],
                    ['date' => '3 Maret 2026', 'status' => 'Available'],
                    ['date' => '13 April 2026', 'status' => 'Available'],
                    ['date' => '16 Juni 2026', 'status' => 'Available'],
                    ['date' => '20 Juli 2026', 'status' => 'Available'],
                    ['date' => '24 Agustus 2026', 'status' => 'Available'],
                    ['date' => '15 September 2026', 'status' => 'Available'],
                    ['date' => '20 Oktober 2026', 'status' => 'Available'],
                    ['date' => '17 November 2026', 'status' => 'Available'],
                ],
                'hotels_json' => [
                    ['name' => 'Armada/Sulaf', 'location' => 'Jordan', 'stars' => 4],
                    ['name' => 'National', 'location' => 'Aqsa', 'stars' => 4],
                ],
                'sort_order' => 7,
            ],
            [
                'package_code' => 'LEGACY-08-JORDAN-EGYPT-AQSA',
                'name' => 'JORDAN EGYPT AQSA',
                'departure_period' => '2026 — beberapa jadwal (Apr–Nov)',
                'description' => '2026 TRAVEL PACKAGE - 9 Days Jordan Egypt Aqsa. FREE Mummy Museum ticket, Nile Cruise, Petra ticket. 4-star hotels at all destinations.',
                'location' => 'Jordan • Egypt • Aqsa',
                'duration_label' => '9 Days',
                'package_type' => 'Religious',
                'price_display' => '$2,350 (was $2,550)',
                'pax_capacity' => 24,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-8.jpeg',
                'highlights_json' => ['Mummy Museum ticket', 'Nile Cruise', 'Petra ticket', 'Pyramid & Sphinx', 'Al-Aqsa'],
                'features_json' => ['Mummy Museum ticket', 'Nile Cruise', 'Petra ticket'],
                'dates_json' => [
                    ['date' => '13 April 2026', 'status' => 'Available'],
                    ['date' => '29 Juni 2026', 'status' => 'Available'],
                    ['date' => '20 Juli 2026', 'status' => 'Available'],
                    ['date' => '24 Agustus 2026', 'status' => 'Available'],
                    ['date' => '15 September 2026', 'status' => 'Available'],
                    ['date' => '20 Oktober 2026', 'status' => 'Available'],
                    ['date' => '17 November 2026', 'status' => 'Available'],
                ],
                'hotels_json' => [
                    ['name' => 'Armada/Sulaf', 'location' => 'Jordan', 'stars' => 4],
                    ['name' => 'National', 'location' => 'Aqsa', 'stars' => 4],
                    ['name' => 'Azal Pyramid/Pyramid Front', 'location' => 'Egypt', 'stars' => 4],
                ],
                'sort_order' => 8,
            ],
            [
                'package_code' => 'LEGACY-09-UMRAH-KIT',
                'name' => 'UMRAH KIT',
                'departure_period' => 'Bonus / perlengkapan (dari Cahaya Anbiya)',
                'description' => 'Complete Umrah kit: 26" suitcase, uniform, prayer dress, ihram cloth, shoulder bag, belt. From Cahaya Anbiya with guaranteed quality.',
                'location' => 'From Cahaya Anbiya',
                'duration_label' => 'Bonus Package',
                'package_type' => 'Religious',
                'price_display' => 'Included (paket perlengkapan)',
                'pax_capacity' => 40,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-9.jpeg',
                'highlights_json' => ['26" suitcase', 'Uniform', 'Prayer dress', 'Ihram cloth', 'Shoulder bag', 'Belt'],
                'features_json' => ['26" suitcase', 'Uniform', 'Prayer dress', 'Ihram cloth', 'Shoulder bag', 'Belt'],
                'dates_json' => [],
                'hotels_json' => [],
                'sort_order' => 9,
            ],
            [
                'package_code' => 'LEGACY-10-PREMIUM-TRAVEL',
                'name' => 'Premium Travel Package',
                'departure_period' => 'Fleksibel — hubungi kami',
                'description' => 'Find the premium travel package that fits your needs. Contact us for full details and special offers.',
                'location' => 'Various Destinations',
                'duration_label' => 'Flexible',
                'package_type' => 'Cultural',
                'price_display' => 'Contact Us',
                'pax_capacity' => 50,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-10.jpeg',
                'highlights_json' => ['Handpicked destinations', 'Full facilities', 'Premium service'],
                'features_json' => ['Custom itinerary', 'Expert guide', 'Premium accommodation'],
                'dates_json' => [],
                'hotels_json' => [],
                'sort_order' => 10,
            ],
            [
                'package_code' => 'LEGACY-11-SPIRITUAL-CULTURAL',
                'name' => 'Spiritual & Cultural Package',
                'departure_period' => 'Beragam — hubungi kami',
                'description' => 'Meaningful spiritual and cultural journeys. Explore sacred sites and heritage with expert guides.',
                'location' => 'Religious Destinations',
                'duration_label' => 'Various',
                'package_type' => 'Religious',
                'price_display' => 'Contact Us',
                'pax_capacity' => 50,
                'pax_booked' => 0,
                'status' => 'open',
                'image_path' => 'images/packages/packages-cahaya-11.jpeg',
                'highlights_json' => ['Footsteps of the prophets', 'Historical travel', 'Spiritual experience'],
                'features_json' => ['Halal certified', 'Cultural immersion', 'Spiritual guide'],
                'dates_json' => [],
                'hotels_json' => [],
                'sort_order' => 11,
            ],
        ];
    }
}
