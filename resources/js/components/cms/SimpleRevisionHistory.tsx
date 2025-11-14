import axios from 'axios';
import { router } from '@inertiajs/react';
import { History, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEditMode } from './EditModeProvider';

interface Revision {
    id: number;
    content: string | null;
    image: string | null;
    changed_by: string;
    change_type: string;
    created_at: string;
    created_at_formatted: string;
}

export default function SimpleRevisionHistory({ sectionKey }: { sectionKey: string }) {
    const { isAdmin, editMode } = useEditMode();
    const [isOpen, setIsOpen] = useState(false);
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState<number | null>(null);

    // Only render in edit mode
    if (!isAdmin || !editMode) {
        return null;
    }

    const fetchRevisions = async () => {
        setLoading(true);
        try {
            console.log('🔍 Fetching revisions for:', sectionKey);
            const response = await axios.get('/admin/revisions', {
                params: { key: sectionKey, limit: 10 },
            });
            console.log('📦 Revisions received:', response.data.revisions?.length || 0);
            setRevisions(response.data.revisions || []);
        } catch (error) {
            console.error('❌ Failed to fetch revisions:', error);
            alert('Gagal memuat riwayat: ' + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (revisionId: number) => {
        const confirmed = window.confirm(
            '⚠️ Apakah Anda yakin?\n\n' +
            'Ini akan mengembalikan konten ke versi sebelumnya.\n' +
            'Versi saat ini akan disimpan sebagai backup.'
        );

        if (!confirmed) {
            console.log('❌ Restore cancelled by user');
            return;
        }

        setRestoring(revisionId);
        console.log('🔄 Starting restore for revision:', revisionId);

        try {
            const response = await axios.post('/admin/restore-revision', {
                key: sectionKey,
                revision_id: revisionId,
            });

            console.log('✅ Restore API success:', response.data);

            // Close modal
            setIsOpen(false);

            // Show immediate feedback
            alert('✅ Berhasil dikembalikan!\n\nPage akan di-reload untuk menampilkan perubahan.');

            // Force full reload to show changes
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('❌ Restore failed:', error);
            alert('❌ Gagal restore:\n\n' + ((error as any).response?.data?.message || (error as any).message));
        } finally {
            setRestoring(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRevisions();
        }
    }, [isOpen]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('📖 History button clicked for:', sectionKey);
                    setIsOpen(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-110 active:scale-95"
                title="View History & Restore"
                type="button"
            >
                <History className="h-4 w-4" />
            </button>

            {/* Modal - Simplified */}
            {isOpen && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        onClick={() => {
                            console.log('🚫 Backdrop clicked - closing');
                            setIsOpen(false);
                        }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-2xl rounded-xl border border-gray-600 bg-gray-900 p-6 shadow-2xl">
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">🔄 Riwayat Perubahan</h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Key: <code className="rounded bg-gray-800 px-2 py-1 text-xs">{sectionKey}</code>
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    console.log('❌ Close clicked');
                                    setIsOpen(false);
                                }}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"></div>
                                    <span className="ml-3 text-gray-400">Loading revisions...</span>
                                </div>
                            ) : revisions.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">
                                    <History className="mx-auto mb-3 h-12 w-12" />
                                    <p className="text-lg">Belum ada riwayat perubahan</p>
                                    <p className="mt-2 text-sm">Edit content untuk membuat backup pertama</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {revisions.map((revision, idx) => (
                                        <div
                                            key={revision.id}
                                            className="rounded-lg border border-gray-700 bg-gray-800 p-4 hover:border-blue-500"
                                        >
                                            {/* Header Row */}
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300">
                                                            #{revisions.length - idx} · {revision.change_type}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{revision.created_at}</span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">by {revision.changed_by}</p>
                                                </div>

                                                {/* Restore Button */}
                                                <button
                                                    onClick={() => {
                                                        console.log('🔄 Restore button clicked:', revision.id);
                                                        handleRestore(revision.id);
                                                    }}
                                                    disabled={restoring === revision.id}
                                                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl disabled:cursor-wait disabled:opacity-50"
                                                    type="button"
                                                >
                                                    {restoring === revision.id ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Restoring...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            ↺ Restore
                                                        </span>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Content Preview */}
                                            {revision.content && (
                                                <div className="mt-3 rounded border border-gray-700 bg-gray-900/70 p-3">
                                                    <p className="text-xs font-semibold text-gray-400">Content:</p>
                                                    <p className="mt-1 text-sm text-white">
                                                        {revision.content.length > 200
                                                            ? revision.content.substring(0, 200) + '...'
                                                            : revision.content}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Image Preview */}
                                            {revision.image && (
                                                <div className="mt-3">
                                                    <p className="mb-2 text-xs font-semibold text-gray-400">Image:</p>
                                                    <img
                                                        src={revision.image}
                                                        alt="Revision preview"
                                                        className="h-32 w-auto rounded border border-gray-700 object-cover shadow-lg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
                            <p className="text-xs text-gray-500">
                                {revisions.length} revision{revisions.length !== 1 ? 's' : ''} available
                            </p>
                            <button
                                onClick={() => {
                                    console.log('❌ Tutup clicked');
                                    setIsOpen(false);
                                }}
                                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                                type="button"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

