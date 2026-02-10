/**
 * Generate cropped image blob from source image and crop area.
 * No rotation - simple crop only.
 */
export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function getCroppedImage(
    imageSrc: string,
    crop: CropArea,
    outputType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
    quality = 0.9
): Promise<Blob> {
    const image = await createImageElement(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2d context not available');
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
            },
            outputType,
            quality
        );
    });
}

function createImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
    });
}
