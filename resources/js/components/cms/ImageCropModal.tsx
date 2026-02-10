import { useCallback, useState, useEffect } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCroppedImage } from '@/utils/getCroppedImage';
import 'react-easy-crop/react-easy-crop.css';

interface ImageCropModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageSrc: string;
    aspect?: number;
    onApply: (blob: Blob) => void | Promise<void>;
    onCancel?: () => void;
}

export default function ImageCropModal({
    open,
    onOpenChange,
    imageSrc,
    aspect = 16 / 9,
    onApply,
    onCancel,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [applying, setApplying] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Reset state when modal opens or imageSrc changes
    useEffect(() => {
        if (open && imageSrc) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setImageLoaded(false);
            setImageError(false);
            
            // Preload image to ensure it's valid
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                setImageLoaded(true);
                setImageError(false);
            };
            img.onerror = () => {
                setImageLoaded(false);
                setImageError(true);
                console.error('Failed to load image:', imageSrc);
            };
            img.src = imageSrc;
        }
    }, [open, imageSrc]);

    const onCropAreaChange = useCallback((_croppedArea: Area, pixels: Area) => {
        // Always update crop area pixels when it changes
        // This ensures button is enabled even if user doesn't move the image
        setCroppedAreaPixels(pixels);
    }, []);

    // Ensure initial crop area is set when image loads
    const onMediaLoaded = useCallback((mediaSize: { width: number; height: number }) => {
        // Calculate initial crop area based on aspect ratio
        const { width, height } = mediaSize;
        const imageAspect = width / height;
        const cropAspect = aspect;
        
        let cropWidth = width;
        let cropHeight = height;
        let cropX = 0;
        let cropY = 0;

        if (imageAspect > cropAspect) {
            // Image is wider than crop aspect - fit height
            cropHeight = height;
            cropWidth = height * cropAspect;
            cropX = (width - cropWidth) / 2;
        } else {
            // Image is taller than crop aspect - fit width
            cropWidth = width;
            cropHeight = width / cropAspect;
            cropY = (height - cropHeight) / 2;
        }

        // Set initial crop area pixels
        setCroppedAreaPixels({
            x: cropX,
            y: cropY,
            width: cropWidth,
            height: cropHeight,
        });
    }, [aspect]);

    const handleApply = useCallback(async () => {
        if (!croppedAreaPixels) {
            console.warn('No crop area selected');
            return;
        }
        setApplying(true);
        try {
            const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
            await onApply(blob);
            onOpenChange(false);
        } catch (err) {
            console.error('Crop failed:', err);
            alert('Gagal memproses gambar. Silakan coba lagi.');
        } finally {
            setApplying(false);
        }
    }, [imageSrc, croppedAreaPixels, onApply, onOpenChange]);

    const handleCancel = useCallback(() => {
        onCancel?.();
        onOpenChange(false);
    }, [onCancel, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] max-w-2xl overflow-hidden p-0 data-[state=open]:scale-100 data-[state=closed]:scale-100 sm:max-w-2xl"
            >
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Atur posisi gambar</DialogTitle>
                </DialogHeader>

                <div className="relative h-[min(50vh,400px)] w-full bg-neutral-900">
                    {imageError ? (
                        <div className="flex h-full items-center justify-center text-red-400">
                            <div className="text-center">
                                <p className="mb-2 font-semibold">Gagal memuat gambar</p>
                                <p className="text-sm text-neutral-400">Pastikan URL gambar valid</p>
                            </div>
                        </div>
                    ) : !imageLoaded ? (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                            <div className="text-center">
                                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-neutral-600 border-t-blue-500 mx-auto" />
                                <p className="text-sm">Memuat gambar...</p>
                            </div>
                        </div>
                    ) : imageSrc ? (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            rotation={0}
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropAreaChange={onCropAreaChange}
                            onMediaLoaded={onMediaLoaded}
                            objectFit="contain"
                        />
                    ) : null}
                </div>

                <div className="border-t px-6 py-4">
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                        Geser gambar untuk atur posisi • Slider untuk zoom
                    </label>
                    <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="mb-4 w-full accent-blue-500"
                    />
                </div>

                <DialogFooter className="border-t px-6 py-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={applying}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={applying || !croppedAreaPixels || !imageLoaded || imageError}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {applying ? 'Memproses...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
