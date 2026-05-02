import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminMuted, adminPageTitle } from '@/lib/admin-portal-theme';
import { Head, Link, router } from '@inertiajs/react';
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
    created_at: string | null;
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
            <p className={`mt-1 ${adminMuted}`}>Kelola peserta B2C lintas semua package.</p>

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

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Full Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Package</th>
                            <th className="px-4 py-3">Registration</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {participants.data.map((p) => (
                            <tr key={p.id}>
                                <td className="px-4 py-3 font-medium text-[#1e3a5f]">{p.full_name}</td>
                                <td className="px-4 py-3">{p.email}</td>
                                <td className="px-4 py-3">{p.phone}</td>
                                <td className="px-4 py-3">{p.package_name}</td>
                                <td className="px-4 py-3"><Badge className={badgeClass(p.registration_status)}>{p.registration_status}</Badge></td>
                                <td className="px-4 py-3">{p.payment_status}</td>
                                <td className="px-4 py-3 text-right">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/admin/participants/${p.id}`}>Detail</Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {participants.data.length === 0 ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
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

