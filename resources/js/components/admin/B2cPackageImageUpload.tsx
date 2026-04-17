import { AdminField } from '@/components/admin/AdminFormSection';
import ImageCropModal from '@/components/cms/ImageCropModal';
import { adminGhostBtn, adminInput, adminMuted } from '@/lib/admin-portal-theme';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getR2Url } from '@/utils/imageHelper';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
const CARD_ASPECT = 16 / 9;

export type B2cPackageImageUploadProps = {
    imagePath: string;
    onImagePathChange: (path: string) => void;
    error?: string;
};

function previewUrl(path: string): string {
    const t = path.trim();
    if (!t) {
        return '';
    }
    if (t.startsWith('http://') || t.startsWith('https://')) {
        return t;
    }
    return getR2Url(t.startsWith('/') ? t.slice(1) : t);
}

export default function B2cPackageImageUpload({ imagePath, onImagePathChange, error }: B2cPackageImageUploadProps) {
    const { props } = usePage<{ cmsMediaGuide?: { images?: { short?: string } } }>();
    const guide = props.cmsMediaGuide?.images?.short ?? '1920×1080px recommended · Max 5MB · JPEG, PNG, WebP · Compressed on server';

    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [cropOpen, setCropOpen] = useState(false);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const beginPick = useCallback((file: File) => {
        setUploadError(null);
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Gunakan JPEG, PNG, atau WebP.');
            return;
        }
        const url = URL.createObjectURL(file);
        setCropSrc(url);
        setCropOpen(true);
    }, []);

    const onInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) {
                beginPick(f);
            }
        },
        [beginPick],
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) {
                beginPick(f);
            }
        },
        [beginPick],
    );

    const uploadBlob = useCallback(
        async (blob: Blob) => {
            setUploading(true);
            setUploadError(null);
            try {
                const file = new File([blob], 'package-hero.jpg', { type: blob.type || 'image/jpeg' });
                const compressed = await compressImageForUpload(file);
                const form = new FormData();
                form.append('image', compressed);

                const { data } = await axios.post<{ path?: string; message?: string }>('/admin/b2c-packages/upload-image', form, {
                    headers: { Accept: 'application/json' },
                });

                if (data?.path) {
                    onImagePathChange(data.path);
                } else {
                    setUploadError('Respons server tidak berisi path gambar.');
                }
            } catch (err: unknown) {
                const ax = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                const d = ax.response?.data;
                const msg =
                    d?.errors?.image?.[0] ??
                    d?.message ??
                    'Upload gagal. Coba lagi atau periksa koneksi / R2.';
                setUploadError(msg);
                console.error(err);
            } finally {
                setUploading(false);
            }
        },
        [onImagePathChange],
    );

    const onCropApply = useCallback(
        async (blob: Blob) => {
            const src = cropSrc;
            try {
                await uploadBlob(blob);
            } finally {
                if (src) {
                    URL.revokeObjectURL(src);
                }
                setCropSrc(null);
            }
        },
        [cropSrc, uploadBlob],
    );

    const onCropModalClose = useCallback(
        (open: boolean) => {
            if (!open && cropSrc) {
                URL.revokeObjectURL(cropSrc);
                setCropSrc(null);
            }
            setCropOpen(open);
        },
        [cropSrc],
    );

    const pv = previewUrl(imagePath);

    return (
        <div className="space-y-5">
            <p className={`text-sm ${adminMuted}`}>{guide}</p>

            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={`rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors sm:px-6 ${
                    dragOver
                        ? 'border-orange-400 bg-orange-50/60'
                        : 'border-slate-200 bg-white/80 hover:border-orange-200 hover:bg-orange-50/30'
                }`}
            >
                <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={onInputChange} />
                <ImageIcon className="mx-auto mb-3 h-10 w-10 text-orange-500/90" aria-hidden />
                <p className="text-sm font-medium text-slate-800">Taruh gambar di sini atau pilih file</p>
                <p className={`mt-1 text-xs ${adminMuted}`}>Setelah memilih, Anda bisa mengatur crop (rasio kartu paket) sebelum unggah.</p>
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    className={`${adminGhostBtn} mt-4 border-orange-200 text-orange-800 hover:bg-orange-50`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah…
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Pilih gambar
                        </>
                    )}
                </button>
            </div>

            {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}

            {pv ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner">
                    <div className="relative aspect-video w-full max-w-xl bg-slate-900/5">
                        <img src={pv} alt="Pratinjau gambar paket" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
                        <p className={`text-xs ${adminMuted}`}>Pratinjau dari path yang akan disimpan.</p>
                        <button
                            type="button"
                            onClick={() => {
                                onImagePathChange('');
                                setUploadError(null);
                            }}
                            className={`${adminGhostBtn} border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700`}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus path
                        </button>
                    </div>
                </div>
            ) : null}

            <AdminField
                label="Path / URL gambar (tersisi otomatis setelah unggah)"
                hint="Boleh diedit manual: path R2 seperti images/b2c-packages/….jpg atau URL https penuh."
                error={error}
            >
                <input
                    className={adminInput}
                    value={imagePath}
                    onChange={(e) => onImagePathChange(e.target.value)}
                    placeholder="images/b2c-packages/… atau https://…"
                    autoComplete="off"
                />
            </AdminField>

            {cropSrc ? (
                <ImageCropModal
                    open={cropOpen}
                    onOpenChange={onCropModalClose}
                    imageSrc={cropSrc}
                    aspect={CARD_ASPECT}
                    onApply={onCropApply}
                />
            ) : null}
        </div>
    );
}
