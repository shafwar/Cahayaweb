/**
 * Near–real-time registration inbox for B2C admin (lightweight polling).
 * Upgrade path: Laravel Echo + Reverb / Pusher when broadcasting is configured.
 */
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { Bell, Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'b2c_admin_reg_seen_max_id';
const POLL_MS = 16_000;

type FeedItem = {
    id: number;
    full_name: string;
    email: string;
    package_name: string;
    package_slug: string | null;
    created_at: string | null;
};

type FeedResponse = {
    latest_id: number;
    items: FeedItem[];
};

function readSeen(): number {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === null) {
            return 0;
        }
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : 0;
    } catch {
        return 0;
    }
}

function writeSeen(id: number): void {
    try {
        localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
        /* ignore */
    }
}

export default function B2cAdminRegistrationBell() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [latestId, setLatestId] = useState(0);
    const [seenMax, setSeenMax] = useState(readSeen);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchFeed = useCallback(async () => {
        try {
            const { data } = await axios.get<FeedResponse>('/admin/b2c-packages/registration-feed', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            setItems(data.items ?? []);
            setLatestId(data.latest_id ?? 0);
            setFetchError(null);
        } catch (e) {
            setFetchError('Gagal memuat notifikasi');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFeed();
        const t = window.setInterval(() => void fetchFeed(), POLL_MS);
        return () => window.clearInterval(t);
    }, [fetchFeed]);

    const unread = items.filter((r) => r.id > seenMax).length;

    const onOpenChange = (open: boolean) => {
        if (open && latestId > 0) {
            setSeenMax(latestId);
            writeSeen(latestId);
        }
    };

    return (
        <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 shrink-0 border-slate-200 bg-white text-slate-700 shadow-sm hover:border-orange-200 hover:bg-orange-50/80 hover:text-orange-900"
                    aria-label="Notifikasi pendaftaran B2C"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                    {!loading && unread > 0 ? (
                        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white shadow">
                            {unread > 9 ? '9+' : unread}
                        </span>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[10040] w-[min(100vw-2rem,22rem)] max-h-[min(70vh,24rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 shadow-xl">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pendaftaran terbaru
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {fetchError ? (
                    <div className="px-3 py-4 text-sm text-red-600">{fetchError}</div>
                ) : items.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-slate-500">Belum ada pendaftaran.</div>
                ) : (
                    items.map((r) => {
                        const href = r.package_slug ? `/admin/b2c-packages/${r.package_slug}/registrations` : '/admin/b2c-packages';
                        return (
                            <DropdownMenuItem key={r.id} asChild className="cursor-pointer p-0 focus:bg-orange-50/60">
                                <Link href={href} className="block w-full px-3 py-2.5 text-left">
                                    <p className="truncate text-sm font-medium text-slate-900">{r.full_name}</p>
                                    <p className="truncate text-xs text-slate-500">{r.email}</p>
                                    <p className="mt-0.5 truncate text-xs text-amber-900/90">{r.package_name}</p>
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                                    </p>
                                </Link>
                            </DropdownMenuItem>
                        );
                    })
                )}
                <DropdownMenuSeparator />
                <p className="px-3 pb-2 pt-1 text-[10px] leading-relaxed text-slate-400">
                    Sinkron otomatis setiap ±{Math.round(POLL_MS / 1000)} dtk (ringan). Push instan: Reverb / Pusher + Echo.
                </p>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
