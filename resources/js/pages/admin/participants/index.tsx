import AdminFloatingToast, { type AdminToastPayload } from '@/components/admin/AdminFloatingToast';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    adminCheckboxLight,
    adminGhostBtn,
    adminInput,
    adminMuted,
    adminOutlineButtonLight,
    adminPageTitle,
    adminPrimaryBtn,
    adminSelectTriggerLight,
} from '@/lib/admin-portal-theme';
import { cn } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ExternalLink, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Participant = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    package_name: string;
    package_id: number;
    registration_status: 'pending' | 'approved' | 'rejected';
    payment_status: 'unpaid' | 'waiting_confirmation' | 'paid';
    visa_status: 'not_processed' | 'in_progress' | 'completed';
    ticket_status: 'not_booked' | 'booked';
    hotel_status: 'not_assigned' | 'assigned';
    created_at: string | null;
    updated_at: string | null;
};

type Paginated<T> = {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    from?: number | null;
    to?: number | null;
};

type PackageOption = { id: number; name: string };

type Filters = {
    package_id: string | null;
    registration_status: string | null;
    payment_status: string | null;
    search: string;
};

function badgeClass(status: Participant['registration_status']): string {
    if (status === 'approved') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'rejected') return 'border border-red-200 bg-red-50 text-red-700';
    return 'border border-amber-200 bg-amber-50 text-amber-700';
}

function paymentBadgeClass(status: Participant['payment_status']): string {
    if (status === 'paid') return 'border border-emerald-200 bg-emerald-50 text-emerald-800';
    if (status === 'waiting_confirmation') return 'border border-sky-200 bg-sky-50 text-sky-900';
    return 'border border-slate-200 bg-white text-slate-700';
}

function formatRegDate(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

function OpsChips({ p }: { p: Participant }) {
    return (
        <div className="flex max-w-[11rem] flex-wrap gap-1">
            <span className="rounded border border-violet-200/90 bg-violet-50 px-1 py-0.5 text-[9px] font-semibold uppercase text-violet-900">V {p.visa_status.replace(/_/g, ' ')}</span>
            <span className="rounded border border-indigo-200/90 bg-indigo-50 px-1 py-0.5 text-[9px] font-semibold uppercase text-indigo-900">T {p.ticket_status.replace(/_/g, ' ')}</span>
            <span className="rounded border border-amber-200/90 bg-amber-50 px-1 py-0.5 text-[9px] font-semibold uppercase text-amber-900">H {p.hotel_status.replace(/_/g, ' ')}</span>
        </div>
    );
}

function stripPaginationLabel(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').trim();
}

function firstError(val: unknown): string | undefined {
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
    return undefined;
}

const bulkDeleteBtn =
    'inline-flex items-center gap-2 rounded-xl border-2 border-rose-400 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 dark:bg-white dark:hover:bg-rose-50';

export default function ParticipantIndex({
    participants,
    packages,
    filters,
    flash,
}: {
    participants: Paginated<Participant>;
    packages: PackageOption[];
    filters: Filters;
    flash?: { type: string; message: string } | null;
}) {
    const pageErrors = usePage().props.errors as Record<string, string> | undefined;
    const [local, setLocal] = useState<Filters>({
        package_id: filters.package_id,
        registration_status: filters.registration_status,
        payment_status: filters.payment_status,
        search: filters.search ?? '',
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [toast, setToast] = useState<AdminToastPayload | null>(null);

    useEffect(() => {
        if (flash?.message) {
            setToast({
                type: flash.type === 'error' ? 'error' : 'success',
                message: flash.message,
            });
        }
    }, [flash?.message, flash?.type]);

    const query = useMemo(
        () => ({
            package_id: local.package_id || undefined,
            registration_status: local.registration_status || undefined,
            payment_status: local.payment_status || undefined,
            search: local.search || undefined,
        }),
        [local],
    );

    const applyFilters = (e?: FormEvent) => {
        e?.preventDefault();
        router.get('/admin/participants', query, { preserveState: true, preserveScroll: true });
    };

    const pageRows = participants.data;
    const pageIds = pageRows.map((p) => p.id);
    const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    const someOnPageSelected = pageIds.some((id) => selectedIds.includes(id));

    const toggleSelectAllPage = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
        } else {
            setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
        }
    };

    const toggleOne = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        router.delete(route('admin.participants.destroy-multiple'), {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setBulkDialogOpen(false);
            },
        });
    };

    const paginationLinks = participants.links ?? [];
    /** Laravel paginator: index 0 = prev, last = next (locale-independent). */
    const prevUrl = paginationLinks[0]?.url ?? null;
    const nextUrl = paginationLinks.length > 0 ? paginationLinks[paginationLinks.length - 1]?.url ?? null : null;

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title="Participant Management" />
            <AdminFloatingToast toast={toast} onDismiss={() => setToast(null)} />

            <h1 className={adminPageTitle}>Participant Management</h1>
            <p className={`mt-1 max-w-3xl ${adminMuted}`}>
                Satu daftar untuk semua pendaftaran B2C. Centang baris di kiri untuk menghapus beberapa registrasi sekaligus (akun login user tidak dihapus; kuota paket diperbarui). Klik{' '}
                <strong>View detail</strong> untuk mengelola siklus penuh.
            </p>

            <form
                onSubmit={applyFilters}
                className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-white md:grid-cols-5"
            >
                <div className="space-y-2">
                    <Label>Package</Label>
                    <Select
                        value={local.package_id ?? 'all'}
                        onValueChange={(v) => setLocal((s) => ({ ...s, package_id: v === 'all' ? null : v }))}
                    >
                        <SelectTrigger className={cn(adminSelectTriggerLight)}>
                            <SelectValue placeholder="All packages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All packages</SelectItem>
                            {packages.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Registration</Label>
                    <Select
                        value={local.registration_status ?? 'all'}
                        onValueChange={(v) => setLocal((s) => ({ ...s, registration_status: v === 'all' ? null : v }))}
                    >
                        <SelectTrigger className={cn(adminSelectTriggerLight)}>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Payment</Label>
                    <Select
                        value={local.payment_status ?? 'all'}
                        onValueChange={(v) => setLocal((s) => ({ ...s, payment_status: v === 'all' ? null : v }))}
                    >
                        <SelectTrigger className={cn(adminSelectTriggerLight)}>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="waiting_confirmation">Waiting Confirmation</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Search name/email</Label>
                    <Input
                        className={cn(adminInput)}
                        value={local.search}
                        onChange={(e) => setLocal((s) => ({ ...s, search: e.target.value }))}
                        placeholder="John / john@email.com"
                    />
                </div>

                <div className="flex gap-2 md:col-span-5">
                    <Button type="submit" className={cn(adminPrimaryBtn)}>
                        Apply filters
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(adminGhostBtn)}
                        onClick={() => {
                            setLocal({ package_id: null, registration_status: null, payment_status: null, search: '' });
                            router.get('/admin/participants');
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </form>

            <div className="mt-6 flex flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 dark:bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-orange-50/25 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                            {selectedIds.length > 0 ? (
                                <>
                                    <span className="tabular-nums text-orange-700">{selectedIds.length}</span> dipilih
                                    {participants.total != null ? (
                                        <span className={`ml-2 font-normal ${adminMuted}`}>
                                            (total {participants.total} registrasi di database)
                                        </span>
                                    ) : null}
                                </>
                            ) : (
                                <span className={adminMuted}>Centang kotak di kiri baris untuk menandai registrasi yang akan dihapus.</span>
                            )}
                        </p>
                        {firstError(pageErrors?.ids) ? <p className="mt-1 text-sm text-red-600">{firstError(pageErrors?.ids)}</p> : null}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={selectedIds.length === 0}
                        className={cn(bulkDeleteBtn)}
                        onClick={() => setBulkDialogOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                        Hapus yang dipilih
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[76rem] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="w-12 px-3 py-3 text-center" scope="col">
                                    <Checkbox
                                        checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                                        onCheckedChange={() => toggleSelectAllPage()}
                                        className={cn('mx-auto size-4', adminCheckboxLight)}
                                        aria-label="Pilih semua di halaman ini"
                                    />
                                </th>
                                <th className="px-3 py-3">Full name</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Phone</th>
                                <th className="px-3 py-3">Package</th>
                                <th className="px-3 py-3">Reg. date</th>
                                <th className="px-3 py-3">Registration</th>
                                <th className="px-3 py-3">Payment</th>
                                <th className="px-3 py-3">Visa / ticket / hotel</th>
                                <th className="px-3 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pageRows.map((p) => (
                                <tr key={p.id} className="transition-colors hover:bg-orange-50/30">
                                    <td className="px-3 py-3 text-center align-middle">
                                        <Checkbox
                                            checked={selectedIds.includes(p.id)}
                                            onCheckedChange={() => toggleOne(p.id)}
                                            className={cn('mx-auto size-4', adminCheckboxLight)}
                                            aria-label={`Pilih ${p.full_name}`}
                                        />
                                    </td>
                                    <td className="px-3 py-3 font-medium text-[#1e3a5f]">{p.full_name}</td>
                                    <td className="max-w-[10rem] truncate px-3 py-3 text-slate-700" title={p.email}>
                                        {p.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{p.phone}</td>
                                    <td className="max-w-[12rem] px-3 py-3 text-slate-700">{p.package_name}</td>
                                    <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-600">{formatRegDate(p.created_at)}</td>
                                    <td className="px-3 py-3">
                                        <Badge className={cn('text-[10px] font-semibold uppercase', badgeClass(p.registration_status))}>{p.registration_status}</Badge>
                                    </td>
                                    <td className="px-3 py-3">
                                        <Badge variant="outline" className={cn('text-[10px] font-medium capitalize', paymentBadgeClass(p.payment_status))}>
                                            {p.payment_status.replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-3 align-top">
                                        <OpsChips p={p} />
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className={cn(adminOutlineButtonLight, 'h-8 gap-1 rounded-lg px-3 text-[11px]')}
                                            asChild
                                        >
                                            <Link href={`/admin/participants/${p.id}`}>
                                                View detail
                                                <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {pageRows.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-8 text-center text-slate-500" colSpan={10}>
                                        No participants found.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {participants.last_page != null && participants.last_page > 1 ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
                        <span>
                            {participants.from != null && participants.to != null && participants.total != null ? (
                                <>
                                    Menampilkan{' '}
                                    <span className="font-medium tabular-nums text-slate-800">
                                        {participants.from}–{participants.to}
                                    </span>{' '}
                                    dari <span className="font-medium tabular-nums text-slate-800">{participants.total}</span>
                                </>
                            ) : (
                                <>Halaman {participants.current_page ?? 1}</>
                            )}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!prevUrl}
                                className={cn(adminGhostBtn, 'h-9 px-3')}
                                onClick={() => prevUrl && router.get(prevUrl, {}, { preserveScroll: true })}
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden />
                                Sebelumnya
                            </Button>
                            <span className="tabular-nums text-slate-500">
                                {participants.current_page ?? 1} / {participants.last_page}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!nextUrl}
                                className={cn(adminGhostBtn, 'h-9 px-3')}
                                onClick={() => nextUrl && router.get(nextUrl, {}, { preserveScroll: true })}
                            >
                                Berikutnya
                                <ChevronRight className="h-4 w-4" aria-hidden />
                            </Button>
                            <div className="hidden items-center gap-1 sm:flex">
                                {paginationLinks
                                    .slice(1, -1)
                                    .filter((l) => l.url)
                                    .map((l, idx) => (
                                        <Button
                                            key={`${l.label}-${idx}`}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                adminGhostBtn,
                                                'h-9 min-w-9 px-2 font-medium',
                                                l.active && 'border-orange-300 bg-orange-50 text-orange-950',
                                            )}
                                            onClick={() => l.url && router.get(l.url, {}, { preserveScroll: true })}
                                        >
                                            {stripPaginationLabel(l.label)}
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                <DialogContent className="border-slate-200 bg-white dark:bg-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Hapus registrasi yang dipilih?</DialogTitle>
                        <DialogDescription className="text-slate-600">
                            <span className="font-semibold tabular-nums text-slate-900">{selectedIds.length}</span> baris registrasi paket akan dihapus permanen dari database.
                            Akun pengguna (login) tidak dihapus; kuota <strong>pax</strong> pada masing-masing paket akan dikurangi seperti saat hapus satu di halaman paket.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" className={cn(adminGhostBtn)} onClick={() => setBulkDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" variant="outline" className={cn(bulkDeleteBtn)} onClick={confirmBulkDelete}>
                            Ya, hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPortalShell>
    );
}
