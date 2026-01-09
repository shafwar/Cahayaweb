import axios from 'axios';
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { RotateCcw, AlertCircle, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';

export default function AdminResetImagesPage() {
    const [isResetting, setIsResetting] = useState(false);
    const [result, setResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

    const heroImages = [
        { id: 1, name: 'Hero 1 - Umrah Premium', original: 'umrah.jpeg', key: 'home.hero.1.image' },
        { id: 2, name: 'Hero 2 - Hajj Packages', original: 'arabsaudi.jpg', key: 'home.hero.2.image' },
        { id: 3, name: 'Hero 3 - Turkey Tours', original: 'TURKEY.jpeg', key: 'home.hero.3.image' },
        { id: 4, name: 'Hero 4 - Egypt Adventures', original: 'egypt.jpeg', key: 'home.hero.4.image' },
        { id: 5, name: 'Hero 5 - Jordan Explorer', original: 'jordan.jpeg', key: 'home.hero.5.image' },
    ];

    const handleResetSingle = async (key: string, name: string) => {
        if (!confirm(`Reset "${name}" ke gambar original?\n\nIni akan menghapus gambar yang di-upload dan kembali ke gambar bawaan.`)) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            const { data } = await axios.post('/admin/reset-to-default', { key });

            if (data?.status === 'ok') {
                setResult({
                    status: 'success',
                    message: `✅ ${name} berhasil direset ke original!`,
                });

                // Reload after 1 second
                setTimeout(() => {
                    window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
                }, 1000);
            } else {
                throw new Error(data?.message || 'Unknown error');
            }
        } catch (error) {
            let errorMessage = 'Unknown error';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
                errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setResult({
                status: 'error',
                message: `❌ Gagal reset: ${errorMessage}`,
            });
            setIsResetting(false);
        }
    };

    const handleResetAll = async () => {
        if (
            !confirm(
                '⚠️ RESET SEMUA HERO IMAGES?\n\n' +
                    'Ini akan menghapus SEMUA gambar yang di-upload di hero section dan kembali ke gambar original (default).\n\n' +
                    'Apakah Anda yakin?'
            )
        ) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            const { data } = await axios.post('/admin/reset-all-heroes');

            if (data?.status === 'ok') {
                setResult({
                    status: 'success',
                    message: `✅ Semua hero images berhasil direset ke original! (${data.deleted} sections deleted)`,
                });

                setTimeout(() => {
                    window.location.href = '/home?t=' + Date.now();
                }, 1500);
            } else {
                throw new Error(data?.message || 'Unknown error');
            }
        } catch (error) {
            let errorMessage = 'Unknown error';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
                errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setResult({
                status: 'error',
                message: `❌ Gagal reset: ${errorMessage}`,
            });
            setIsResetting(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="Reset Images - Admin" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.visit('/home')}
                            className="mb-4 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </button>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
                                    <RotateCcw className="h-8 w-8 text-purple-400" />
                                    Reset Images
                                </h1>
                                <p className="mt-2 text-gray-400">
                                    Reset hero images to original/default without terminal commands!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Result Alert */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 rounded-lg p-4 ${
                                result.status === 'success'
                                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {result.status === 'success' ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                <span>{result.message}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Reset All Button */}
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white">🔥 Reset All Hero Images</h2>
                                <p className="mt-2 text-sm text-gray-400">
                                    Hapus SEMUA gambar yang di-upload di hero section (Hero 1-5) dan kembali ke gambar
                                    original (umrah.jpeg, arabsaudi.jpg, TURKEY.jpeg, egypt.jpeg, jordan.jpeg)
                                </p>
                            </div>
                            <button
                                onClick={handleResetAll}
                                disabled={isResetting}
                                className="ml-4 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isResetting ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Reset All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Individual Reset */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Individual Reset</h2>
                        <p className="text-sm text-gray-400">
                            Reset satu per satu jika hanya ingin reset gambar tertentu
                        </p>

                        {heroImages.map((hero) => (
                            <div
                                key={hero.id}
                                className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm transition-all hover:border-gray-600"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{hero.name}</h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            Original: <code className="text-purple-400">{hero.original}</code>
                                        </p>
                                        <p className="text-xs text-gray-500">Key: {hero.key}</p>
                                    </div>
                                    <button
                                        onClick={() => handleResetSingle(hero.key, hero.name)}
                                        disabled={isResetting}
                                        className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-600 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {isResetting ? (
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <RotateCcw className="h-4 w-4" />
                                        )}
                                        Reset
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-400">
                            <AlertCircle className="h-5 w-5" />
                            How to Use
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">1.</span>
                                <span>
                                    <strong>Individual Reset:</strong> Click "Reset" button on any hero image to reset
                                    only that image to original.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">2.</span>
                                <span>
                                    <strong>Reset All:</strong> Click red "Reset All" button at top to reset ALL hero
                                    images at once.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">3.</span>
                                <span>
                                    <strong>Confirmation:</strong> Both options will ask for confirmation before
                                    proceeding.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">4.</span>
                                <span>
                                    <strong>Auto Reload:</strong> Page will reload automatically after reset to show
                                    original images.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">⚠️</span>
                                <span>
                                    <strong>Warning:</strong> Ini akan menghapus gambar yang di-upload dari database.
                                    Revisions tetap tersimpan untuk history.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

