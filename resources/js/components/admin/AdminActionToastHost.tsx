import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Flash = { type: string; message: string } | null | undefined;

type Queued = { id: number; type: string; message: string };

const AUTO_DISMISS_MS = 5200;

/**
 * Shows centered action toasts from Inertia `flash` (success / error) after redirects.
 * Pass the same `flash` prop your page receives from Laravel.
 */
export default function AdminActionToastHost({ flash }: { flash?: Flash }) {
    const [queue, setQueue] = useState<Queued[]>([]);
    const prevFlashRef = useRef<string>('');

    const dismiss = useCallback((id: number) => {
        setQueue((q) => q.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        if (!flash?.message) {
            prevFlashRef.current = '';
            return;
        }
        const key = `${flash.type ?? ''}:${flash.message}`;
        if (key === prevFlashRef.current) {
            return;
        }
        prevFlashRef.current = key;
        const id = Date.now();
        setQueue((q) => [...q, { id, type: flash.type ?? 'success', message: flash.message }]);
        const t = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
        return () => window.clearTimeout(t);
    }, [flash, dismiss]);

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-3">
            <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-2">
                <AnimatePresence initial={false}>
                    {queue.map((t) => {
                        const ok = t.type !== 'error';
                        return (
                            <motion.div
                                key={t.id}
                                role="status"
                                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
                                    ok
                                        ? 'border-emerald-200 bg-white text-emerald-950'
                                        : 'border-red-200 bg-white text-red-950'
                                }`}
                            >
                                {ok ? (
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                                ) : (
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                                )}
                                <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
                                <button
                                    type="button"
                                    onClick={() => dismiss(t.id)}
                                    className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                    aria-label="Tutup notifikasi"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
