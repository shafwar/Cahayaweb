import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminMuted, adminPageTitle } from '@/lib/admin-portal-theme';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

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

export default function ParticipantIndex({
    participants,
    packages,
    filters,
}: {
    participants: Paginated<Participant>;
    packages: PackageOption[];
    filters: Filters;
}) {
    const [local, setLocal] = useState<Filters>({
        package_id: filters.package_id,
        registration_status: filters.registration_status,
        payment_status: filters.payment_status,
        search: filters.search ?? '',
    });

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

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title="Participant Management" />
            <h1 className={adminPageTitle}>Participant Management</h1>
            <p className={`mt-1 max-w-3xl ${adminMuted}`}>
                Satu daftar untuk semua pendaftaran B2C. Klik <strong>View detail</strong> untuk mengelola siklus penuh: registrasi, pembayaran, visa, tiket, hotel, dan catatan internal — konsisten dengan halaman registrasi per paket.
            </p>

            <form onSubmit={applyFilters} className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5">
                <div className="space-y-2">
                    <Label>Package</Label>
                    <Select
                        value={local.package_id ?? 'all'}
                        onValueChange={(v) => setLocal((s) => ({ ...s, package_id: v === 'all' ? null : v }))}
                    >
                        <SelectTrigger><SelectValue placeholder="All packages" /></SelectTrigger>
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
                        <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
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
                        <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
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
                        value={local.search}
                        onChange={(e) => setLocal((s) => ({ ...s, search: e.target.value }))}
                        placeholder="John / john@email.com"
                    />
                </div>

                <div className="md:col-span-5 flex gap-2">
                    <Button type="submit">Apply filters</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setLocal({ package_id: null, registration_status: null, payment_status: null, search: '' });
                            router.get('/admin/participants');
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </form>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[72rem] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Full name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Package</th>
                            <th className="px-4 py-3">Reg. date</th>
                            <th className="px-4 py-3">Registration</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Visa / ticket / hotel</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {participants.data.map((p) => (
                            <tr key={p.id} className="transition-colors hover:bg-orange-50/30">
                                <td className="px-4 py-3 font-medium text-[#1e3a5f]">{p.full_name}</td>
                                <td className="max-w-[10rem] truncate px-4 py-3 text-slate-700" title={p.email}>
                                    {p.email}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{p.phone}</td>
                                <td className="max-w-[12rem] px-4 py-3 text-slate-700">{p.package_name}</td>
                                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">{formatRegDate(p.created_at)}</td>
                                <td className="px-4 py-3">
                                    <Badge className={cn('text-[10px] font-semibold uppercase', badgeClass(p.registration_status))}>{p.registration_status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className={cn('text-[10px] font-medium capitalize', paymentBadgeClass(p.payment_status))}>
                                        {p.payment_status.replace(/_/g, ' ')}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <OpsChips p={p} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1 rounded-lg border-slate-200 font-semibold text-[#1e3a5f] hover:border-orange-300 hover:bg-orange-50"
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
                        {participants.data.length === 0 ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan={9}>
                                    No participants found.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </AdminPortalShell>
    );
}

