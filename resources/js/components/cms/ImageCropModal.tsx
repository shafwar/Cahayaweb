import { useCallback, useState } from 'react';
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

    const onCropAreaChange = useCallback((_croppedArea: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleApply = useCallback(async () => {
        if (!croppedAreaPixels) return;
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
                        objectFit="contain"
                    />
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
                        disabled={applying || !croppedAreaPixels}
                    >
                        {applying ? 'Memproses...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
