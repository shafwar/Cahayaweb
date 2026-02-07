<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

/**
 * Compress images before storing in R2.
 * Uses PHP GD. Falls back to original if GD unavailable.
 */
class ImageCompressor
{
    public static int $maxWidth = 1920;
    public static int $maxHeight = 1080;
    public static int $quality = 85;

    /**
     * Compress image and return path to temp file, or null to use original.
     */
    public static function compress(UploadedFile $file): ?string
    {
        if (!extension_loaded('gd')) {
            Log::debug('GD not available, skipping image compression');
            return null;
        }

        $mime = $file->getMimeType();
        $path = $file->getRealPath();

        $image = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($path),
            'image/png' => @imagecreatefrompng($path),
            'image/webp' => @imagecreatefromwebp($path),
            default => null,
        };

        if (!$image) {
            return null;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        if ($width <= 0 || $height <= 0) {
            imagedestroy($image);
            return null;
        }

        // Calculate new dimensions (maintain aspect ratio)
        $ratio = min(self::$maxWidth / $width, self::$maxHeight / $height, 1);
        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        if ($newWidth >= $width && $newHeight >= $height) {
            // No resize needed - try quality compression only for JPEG
            if ($mime === 'image/jpeg' || $mime === 'image/jpg') {
                $tmp = tempnam(sys_get_temp_dir(), 'cms_img_') . '.jpg';
                if (imagejpeg($image, $tmp, self::$quality)) {
                    imagedestroy($image);
                    return $tmp;
                }
                @unlink($tmp);
            }
            imagedestroy($image);
            return null;
        }

        $newImage = imagecreatetruecolor($newWidth, $newHeight);
        if (!$newImage) {
            imagedestroy($image);
            return null;
        }

        imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($image);

        $ext = strtolower($file->getClientOriginalExtension());
        $tmp = tempnam(sys_get_temp_dir(), 'cms_img_') . '.' . ($ext ?: 'jpg');

        $saved = false;
        switch ($ext) {
            case 'png':
                $saved = imagepng($newImage, $tmp, 8);
                break;
            case 'webp':
                $saved = imagewebp($newImage, $tmp, self::$quality);
                break;
            default:
                $saved = imagejpeg($newImage, $tmp, self::$quality);
        }

        imagedestroy($newImage);

        if ($saved) {
            return $tmp;
        }
        @unlink($tmp);
        return null;
    }
}
