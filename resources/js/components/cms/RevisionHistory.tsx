import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { router } from '@inertiajs/react';
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

export default function RevisionHistory({
    sectionKey,
    trigger,
}: {
    sectionKey: string;
    trigger: React.ReactNode;
}) {
    const { isAdmin, editMode } = useEditMode();
    const [isOpen, setIsOpen] = useState(false);
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState<number | null>(null);

    // Only show in edit mode and for admins
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
            console.log('📦 Revisions received:', response.data);
            setRevisions(response.data.revisions || []);
        } catch (error) {
            console.error('❌ Failed to fetch revisions:', error);
            alert('Gagal memuat riwayat perubahan. Error: ' + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (revisionId: number) => {
        if (!confirm('Apakah Anda yakin ingin mengembalikan ke versi ini?\n\nIni akan mengganti konten saat ini dengan versi yang dipilih.')) {
            return;
        }

        setRestoring(revisionId);
        try {
            console.log('🔄 Restoring revision:', revisionId, 'for key:', sectionKey);
            
            const response = await axios.post('/admin/restore-revision', {
                key: sectionKey,
                revision_id: revisionId,
            });

            console.log('✅ Restore response:', response.data);

            // Close modal immediately
            setIsOpen(false);

            // Force complete page reload to show restored content
            router.reload({
                onSuccess: () => {
                    console.log('✅ Page reloaded after restore');
                    
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white shadow-2xl';
                    notification.innerHTML = `
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <div class="font-bold">Berhasil Dikembalikan!</div>
                                <div class="text-sm opacity-90">Konten telah dikembalikan ke versi sebelumnya</div>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 4000);
                },
                onError: (errors) => {
                    console.error('❌ Reload failed:', errors);
                }
            });
        } catch (error) {
            console.error('❌ Failed to restore revision:', error);
            alert('Gagal mengembalikan ke versi sebelumnya.\nError: ' + ((error as any).response?.data?.message || (error as any).message));
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
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('📖 Opening history for:', sectionKey);
                    setIsOpen(true);
                }}
                className="cursor-pointer"
                title="View history & restore previous versions"
            >
                {trigger}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                console.log('🚫 Backdrop clicked - closing modal');
                                setIsOpen(false);
                            }}
                            className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm"
                            style={{ pointerEvents: 'auto' }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed left-1/2 top-1/2 z-[100001] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Riwayat Perubahan</h2>
                                    <p className="text-sm text-gray-400">
                                        Section: <code className="rounded bg-gray-800 px-1.5 py-0.5">{sectionKey}</code>
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('❌ Close button clicked');
                                        setIsOpen(false);
                                    }}
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                                    type="button"
                                    style={{ pointerEvents: 'auto' }}
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
                                    </div>
                                ) : revisions.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400">
                                        <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>Belum ada riwayat perubahan</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {revisions.map((revision) => (
                                            <div
                                                key={revision.id}
                                                className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-800"
                                                style={{ pointerEvents: 'auto' }}
                                            >
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                                                                {revision.change_type}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{revision.created_at}</span>
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-500">by {revision.changed_by}</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            console.log('🔄 Restore clicked for revision:', revision.id);
                                                            handleRestore(revision.id);
                                                        }}
                                                        disabled={restoring === revision.id}
                                                        className="rounded-md bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                                        type="button"
                                                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                                    >
                                                        {restoring === revision.id ? (
                                                            <span className="flex items-center gap-1">
                                                                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Restoring...
                                                            </span>
                                                        ) : '↺ Restore'}
                                                    </button>
                                                </div>

                                                {/* Content Preview */}
                                                {revision.content && (
                                                    <div className="mt-3 rounded border border-gray-700 bg-gray-900/50 p-3">
                                                        <p className="text-xs font-medium text-gray-400">Content:</p>
                                                        <p className="mt-1 text-sm text-white">{revision.content.substring(0, 150)}{revision.content.length > 150 ? '...' : ''}</p>
                                                    </div>
                                                )}

                                                {/* Image Preview */}
                                                {revision.image && (
                                                    <div className="mt-3">
                                                        <p className="mb-2 text-xs font-medium text-gray-400">Image:</p>
                                                        <img
                                                            src={revision.image}
                                                            alt="Revision preview"
                                                            className="h-20 w-auto rounded border border-gray-700 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end border-t border-gray-700 pt-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('❌ Tutup button clicked');
                                        setIsOpen(false);
                                    }}
                                    className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600"
                                    type="button"
                                    style={{ pointerEvents: 'auto' }}
                                >
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

