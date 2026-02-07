<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Section Defaults
    |--------------------------------------------------------------------------
    | Define baseline content or image that should be used whenever a section
    | is reset. Images reference files inside the public/ directory so they
    | can be bundled with the app (e.g. "b2b.jpeg").
    */
    'defaults' => [
        'b2b.hero.image' => [
            'type' => 'image',
            'public_path' => 'b2b.jpeg',
        ],
        'home.hero.1.image' => [
            'type' => 'image',
            'public_path' => 'umrah.jpeg',
        ],
        'home.hero.2.image' => [
            'type' => 'image',
            'public_path' => 'arabsaudi.jpg',
        ],
        'home.hero.3.image' => [
            'type' => 'image',
            'public_path' => 'TURKEY.jpeg',
        ],
        'home.hero.4.image' => [
            'type' => 'image',
            'public_path' => 'egypt.jpeg',
        ],
        'home.hero.5.image' => [
            'type' => 'image',
            'public_path' => 'jordan.jpeg',
        ],
        'home.hero.video' => [
            'type' => 'video',
            'video_path' => 'videos/b2cherosectionvideo.mp4',
        ],
    ],
];

