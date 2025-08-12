import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastItem {
    id: number;
    message: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const show = (message: string) => setToasts((t) => [...t, { id: Date.now(), message }]);
    const remove = (id: number) => setToasts((t) => t.filter((i) => i.id !== id));
    const ToastContainer = () => (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] mx-auto w-full max-w-md px-3">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto mb-2 rounded-md border bg-background/95 p-3 text-sm shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60"
                        onClick={() => remove(t.id)}
                    >
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
    return { show, ToastContainer } as const;
}


