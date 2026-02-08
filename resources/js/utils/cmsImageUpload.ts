/**
 * CMS Image Upload - Client-side compression before upload.
 * Ensures any image the admin selects is compressed to fit within backend limits,
 * so uploads succeed regardless of original file size.
 */
import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 2;
const MAX_WIDTH_OR_HEIGHT = 1920;
const INITIAL_QUALITY = 0.85;

export interface CompressOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    initialQuality?: number;
}

/**
 * Compress image file before upload. Reduces size and dimensions to ensure
 * upload succeeds. Returns original file if not an image or compression fails.
 */
export async function compressImageForUpload(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return file;
    }

    try {
        const compressed = await imageCompression(file, {
            maxSizeMB: options.maxSizeMB ?? MAX_SIZE_MB,
            maxWidthOrHeight: options.maxWidthOrHeight ?? MAX_WIDTH_OR_HEIGHT,
            initialQuality: options.initialQuality ?? INITIAL_QUALITY,
            useWebWorker: true,
        });
        return compressed;
    } catch (err) {
        console.warn('[cmsImageUpload] Compression failed, using original:', err);
        return file;
    }
}
