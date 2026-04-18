import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminGhostBtn } from '@/lib/admin-portal-theme';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Bell, Inbox } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type InboxItem = {
    id: number;
    full_name: string;
    email: string;
    pax: number;
    package_name: string | null;
    package_slug: string | null;
    created_at: string | null;
};

const POLL_MS = 18_000;

export default function AdminB2cInboxBell({ className = '' }: { className?: string }) {
    const [unread, setUnread] = useState(0);
    const [items, setItems] = useState<InboxItem[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSummary = useCallback(async () => {
        try {
            const { data } = await axios.get<{ unread_count?: number; items?: InboxItem[] }>('/admin/b2c-inbox/summary', {
                headers: { Accept: 'application/json' },
            });
            setUnread(typeof data.unread_count === 'number' ? data.unread_count : 0);
            setItems(Array.isArray(data.items) ? data.items : []);
        } catch {
            /* ignore poll errors */
        }
    }, []);

    useEffect(() => {
        void fetchSummary();
        const id = window.setInterval(() => void fetchSummary(), POLL_MS);
        return () => window.clearInterval(id);
    }, [fetchSummary]);

    useEffect(() => {
        return router.on('finish', () => {
            void fetchSummary();
        });
    }, [fetchSummary]);

    const onOpenChange = async (next: boolean) => {
        setOpen(next);
        if (!next) {
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get<{ unread_count?: number; items?: InboxItem[] }>('/admin/b2c-inbox/summary', {
                headers: { Accept: 'application/json' },
            });
            const u = typeof data.unread_count === 'number' ? data.unread_count : 0;
            setUnread(u);
            setItems(Array.isArray(data.items) ? data.items : []);
            if (u > 0) {
                try {
                    await axios.post('/admin/b2c-inbox/mark-seen', {}, { headers: { Accept: 'application/json' } });
                    setUnread(0);
                } catch {
                    /* keep badge if mark-seen fails */
                }
            }
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const label = unread > 99 ? '99+' : String(unread);

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={`relative ${adminGhostBtn} border-amber-200/90 text-amber-950 hover:bg-amber-50 ${className}`}
                    aria-label={`Inbox pendaftaran, ${unread} belum dibaca`}
                >
                    <Bell className="h-4 w-4 shrink-0" aria-hidden />
                    {unread > 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                            {label}
                        </span>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(100vw-2rem,22rem)]">
                <DropdownMenuLabel className="flex flex-col gap-1 font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                        <Inbox className="h-4 w-4 text-amber-600" aria-hidden />
                        Pendaftaran B2C
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                        Diperbarui otomatis ±18 detik. Belum termasuk pesan dari formulir Contact lain.
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {loading ? (
                    <div className="px-2 py-3 text-sm text-slate-500">Memuat…</div>
                ) : items.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-slate-600">
                        {unread === 0 ? 'Belum ada pendaftaran baru sejak terakhir dibuka.' : 'Membuka…'}
                    </div>
                ) : (
                    items.map((row) => (
                        <DropdownMenuItem key={row.id} asChild className="cursor-pointer p-0 focus:bg-amber-50/80">
                            <Link
                                href={row.package_slug ? `/admin/b2c-packages/${row.package_slug}/registrations` : '/admin/b2c-packages'}
                                className="block w-full px-2 py-2.5 text-left"
                            >
                                <div className="text-sm font-medium text-slate-900">{row.full_name}</div>
                                <div className="text-xs text-slate-500">{row.email}</div>
                                {row.package_name ? <div className="mt-0.5 text-xs text-amber-800">{row.package_name}</div> : null}
                                <div className="mt-1 text-[11px] text-slate-400">
                                    {row.created_at ? new Date(row.created_at).toLocaleString() : ''} · {row.pax} pax
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-slate-50">
                    <Link href="/admin/b2c-packages" className="block w-full px-2 py-2 text-center text-sm font-medium text-orange-700">
                        Lihat semua paket
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
