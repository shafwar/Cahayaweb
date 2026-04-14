import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, LogOut, Package, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

type Row = {
    id: number;
    slug: string;
    package_code: string;
    name: string;
    departure_period: string;
    price_display: string;
    pax_capacity: number;
    pax_booked: number;
    registration_deadline: string;
    status: string;
    registration_open: boolean;
    registrations_count: number;
    sort_order: number;
    updated_at: string | null;
};

export default function B2cPackagesIndex({ packages, flash }: { packages: Row[]; flash?: { type: string; message: string } | null }) {
    const { logout, isLoggingOut } = useLogout();

    const onDelete = (row: Row) => {
        if (!confirm(`Delete package "${row.name}"? This is only allowed if there are no registrations.`)) return;
        router.delete(`/admin/b2c-packages/${row.slug}`, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <Head title="B2C Packages — Admin" />
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Admin home
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/admin/b2c-packages/create">
                            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500">
                                <Plus className="h-4 w-4" />
                                New package
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={logout} disabled={isLoggingOut} className="border-red-400/40 text-red-200 hover:bg-red-500/10">
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoggingOut ? '…' : 'Logout'}
                        </Button>
                    </div>
                </div>

                <div className="mb-8 flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-500/15 p-3 ring-1 ring-emerald-400/30">
                        <Package className="h-8 w-8 text-emerald-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">B2C registration — Packages</h1>
                        <p className="mt-1 max-w-2xl text-sm text-slate-400">
                            Create and manage bookable packages. Participants register from the public Packages page when packages are loaded from this list.
                        </p>
                    </div>
                </div>

                {flash?.message ? (
                    <div
                        className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                            flash.type === 'error'
                                ? 'border-red-400/50 bg-red-500/10 text-red-100'
                                : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-50'
                        }`}
                    >
                        {flash.message}
                    </div>
                ) : null}

                {packages.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                        <p className="text-slate-300">No packages yet. Create one to enable online registration on the B2C packages page.</p>
                        <Link href="/admin/b2c-packages/create" className="mt-4 inline-block text-emerald-400 hover:underline">
                            Create first package
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Package</th>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Pax</th>
                                    <th className="px-4 py-3">Deadline</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {packages.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{p.name}</div>
                                            <div className="text-xs text-slate-400">{p.departure_period}</div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-300">{p.package_code}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-200">
                                                {p.pax_booked}/{p.pax_capacity}
                                            </span>
                                            <div className="text-xs text-slate-500">{p.registrations_count} registration(s)</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-300">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(p.registration_deadline).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={p.registration_open ? 'default' : 'secondary'} className={p.registration_open ? 'bg-emerald-600' : ''}>
                                                {p.status === 'open' && p.registration_open ? 'Open' : p.status === 'closed' ? 'Closed' : 'Unavailable'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/b2c-packages/${p.slug}/registrations`}>
                                                    <Button size="sm" variant="ghost" className="text-slate-200 hover:text-white" title="Participants">
                                                        <Users className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/b2c-packages/${p.slug}/edit`}>
                                                    <Button size="sm" variant="ghost" className="text-slate-200 hover:text-white" title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="ghost" className="text-red-300 hover:text-red-100" title="Delete" onClick={() => onDelete(p)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
