<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing packages
        Package::query()->delete();

        // Create Umrah Package
        Package::create([
            'name' => 'Umrah Premium Package',
            'description' => 'Complete Umrah package with 5-star accommodation and VIP services',
            'destination' => 'Makkah & Madinah',
            'duration_days' => 14,
            'price' => 25000000,
            'b2b_price' => 22000000,
            'image_path' => null,
            'type' => 'umrah',
            'is_active' => true,
            'max_capacity' => 50,
            'max_travelers' => 50,
            'departure_date' => '2024-03-15',
            'return_date' => '2024-03-29',
            'highlights' => json_encode([
                '5-star hotel accommodation',
                'VIP visa processing',
                'Experienced guide',
                'Transportation included'
            ]),
            'inclusions' => json_encode([
                'Return flight tickets',
                'Hotel accommodation',
                'Visa processing',
                'Transportation',
                'Meals (breakfast & dinner)',
                'Guide services'
            ]),
            'exclusions' => json_encode([
                'Personal expenses',
                'Lunch',
                'Tips for guide',
                'Additional services'
            ]),
            'itinerary' => json_encode([
                [
                    'day' => 1,
                    'title' => 'Arrival in Jeddah',
                    'description' => 'Arrive in Jeddah, transfer to Makkah, check-in at hotel'
                ],
                [
                    'day' => 2,
                    'title' => 'Umrah Rituals',
                    'description' => 'Perform Umrah rituals with guidance from experienced guide'
                ],
                [
                    'day' => 3,
                    'title' => 'Makkah Stay',
                    'description' => 'Free time for prayers and spiritual activities in Makkah'
                ],
                [
                    'day' => 4,
                    'title' => 'Travel to Madinah',
                    'description' => 'Transfer to Madinah, visit Masjid Nabawi'
                ],
                [
                    'day' => 5,
                    'title' => 'Madinah Stay',
                    'description' => 'Visit historical sites and perform prayers in Madinah'
                ]
            ]),
        ]);

        // Create Hajj Package
        Package::create([
            'name' => 'Hajj 2024 Package',
            'description' => 'Complete Hajj package with all necessary arrangements',
            'destination' => 'Makkah & Madinah',
            'duration_days' => 30,
            'price' => 45000000,
            'b2b_price' => 40000000,
            'image_path' => null,
            'type' => 'hajj',
            'is_active' => true,
            'max_capacity' => 30,
            'max_travelers' => 30,
            'departure_date' => '2024-06-01',
            'return_date' => '2024-07-01',
            'highlights' => json_encode([
                'Complete Hajj arrangements',
                'Premium accommodation',
                'Expert guidance',
                'All rituals included'
            ]),
            'inclusions' => json_encode([
                'Return flight tickets',
                'Hotel accommodation',
                'Hajj visa',
                'Transportation',
                'Meals',
                'Expert guide',
                'All Hajj rituals'
            ]),
            'exclusions' => json_encode([
                'Personal expenses',
                'Additional services',
                'Tips',
                'Extra meals'
            ]),
            'itinerary' => json_encode([
                [
                    'day' => 1,
                    'title' => 'Arrival in Jeddah',
                    'description' => 'Arrive in Jeddah, transfer to Makkah'
                ],
                [
                    'day' => 2,
                    'title' => 'Hajj Preparation',
                    'description' => 'Prepare for Hajj rituals and guidance'
                ],
                [
                    'day' => 3,
                    'title' => 'Hajj Rituals Begin',
                    'description' => 'Start Hajj rituals with expert guidance'
                ]
            ]),
        ]);

        // Create Business Package
        Package::create([
            'name' => 'Dubai Business Trip',
            'description' => 'Business travel package to Dubai with meeting arrangements',
            'destination' => 'Dubai',
            'duration_days' => 7,
            'price' => 15000000,
            'b2b_price' => 12000000,
            'image_path' => null,
            'type' => 'business',
            'is_active' => true,
            'max_capacity' => 20,
            'max_travelers' => 20,
            'departure_date' => '2024-02-20',
            'return_date' => '2024-02-27',
            'highlights' => json_encode([
                'Business class flights',
                '5-star hotel',
                'Meeting room arrangements',
                'Business visa assistance'
            ]),
            'inclusions' => json_encode([
                'Business class tickets',
                'Hotel accommodation',
                'Business visa',
                'Transportation',
                'Meeting room (2 hours/day)',
                'Breakfast'
            ]),
            'exclusions' => json_encode([
                'Lunch & dinner',
                'Personal expenses',
                'Additional meetings',
                'Sightseeing tours'
            ]),
            'itinerary' => json_encode([
                [
                    'day' => 1,
                    'title' => 'Arrival in Dubai',
                    'description' => 'Arrive in Dubai, check-in at business hotel'
                ],
                [
                    'day' => 2,
                    'title' => 'Business Meetings',
                    'description' => 'Attend scheduled business meetings'
                ],
                [
                    'day' => 3,
                    'title' => 'Networking',
                    'description' => 'Business networking and meetings'
                ]
            ]),
        ]);
    }
}
