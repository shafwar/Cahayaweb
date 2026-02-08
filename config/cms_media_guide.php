<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CMS Media Guide - Admin Instructions
    |--------------------------------------------------------------------------
    | Specs for images and videos. Displayed in CMS when admin edits media.
    | Images & videos → stored in R2. Text/description → database only.
    */

    'images' => [
        'recommended_width' => 1920,
        'recommended_height' => 1080,
        'min_width' => 400,
        'min_height' => 300,
        'max_file_size_mb' => 10, // Client compresses to ~2MB; 10MB allows fallback
        'formats' => 'JPEG, PNG, WebP',
        'description' => 'Recommended: 1920×1080px. Client auto-compresses before upload. Images stored in R2.',
        'short' => '1920×1080px recommended · Client auto-compressed · JPEG, PNG, WebP',
    ],

    'videos' => [
        'recommended_width' => 1920,
        'recommended_height' => 1080,
        'max_file_size_mb' => 50,
        'formats' => 'MP4 (H.264), WebM',
        'description' => 'Recommended: 1920×1080px, max 50MB. Pre-compress for faster upload. Stored in R2.',
        'short' => '1920×1080px recommended · Max 50MB · MP4/WebM',
    ],

    'storage_rules' => [
        'images_videos' => 'Stored in R2 (Cloudflare)',
        'text_content' => 'Stored in database only',
    ],
];
