import { adminGhostBtn, adminMuted } from '@/lib/admin-portal-theme';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getR2Url } from '@/utils/imageHelper';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

export type B2cPackageImageUploadProps = {
    imagePath: string;
    onImagePathChange: (path: string) => void;
    error?: string;
};

type CmsGuide = {
    b2c_package_poster?: { short?: string };
    images?: { short?: string };
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
    const { props } = usePage<{ cmsMediaGuide?: CmsGuide }>();
    const guide =
        props.cmsMediaGuide?.b2c_package_poster?.short ??
        'Poster portrait (±1080×1920 atau lebih tinggi) · JPEG/PNG/WebP · Maks 12MB · Tanpa crop — langsung unggah';

    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadFile = useCallback(
        async (file: File) => {
            setUploading(true);
            setUploadError(null);
            try {
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    setUploadError('Gunakan JPEG, PNG, atau WebP.');
                    return;
                }

                // Langsung ke server tanpa dialog crop. Kompresi ringan di main thread (tanpa web worker) agar perilaku stabil di semua browser.
                const compressed = await compressImageForUpload(file, {
                    maxSizeMB: 10,
                    maxWidthOrHeight: 2800,
                    initialQuality: 0.88,
                    useWebWorker: false,
                });
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
                    d?.errors?.image?.[0] ?? d?.message ?? 'Upload gagal. Coba lagi atau periksa koneksi / R2.';
                setUploadError(msg);
                console.error(err);
            } finally {
                setUploading(false);
            }
        },
        [onImagePathChange],
    );

    const beginPick = useCallback(
        (file: File) => {
            setUploadError(null);
            void uploadFile(file);
        },
        [uploadFile],
    );

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
                <p className={`mt-1 text-xs ${adminMuted}`}>File langsung diunggah ke R2 setelah kompresi ringan — tidak ada langkah crop/zoom.</p>
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
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {pv ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner">
                    <div className="relative flex max-h-[min(75vh,960px)] w-full max-w-md items-center justify-center bg-slate-100/80 p-2">
                        <img src={pv} alt="Pratinjau poster paket" className="max-h-[min(75vh,960px)] w-full object-contain" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
                        <p className={`text-xs ${adminMuted}`}>Pratinjau utuh (rasio poster dipertahankan).</p>
                        <button
                            type="button"
                            onClick={() => {
                                onImagePathChange('');
                                setUploadError(null);
                            }}
                            className={`${adminGhostBtn} border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700`}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus gambar
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
