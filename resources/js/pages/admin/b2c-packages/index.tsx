import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminBackLink, adminChip, adminGhostBtn, adminMuted, adminPageTitle, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, LogOut, Package, Pencil, Plus, Sparkles, Trash2, Users } from 'lucide-react';
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
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title="B2C Packages — Admin" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Link href="/admin" className={adminBackLink}>
                    <ArrowLeft className="h-4 w-4" />
                    Admin home
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/admin/b2c-packages/create">
                        <Button type="button" className={`${adminPrimaryBtn} gap-2`}>
                            <Plus className="h-4 w-4" />
                            New package
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={logout}
                        disabled={isLoggingOut}
                        className={`${adminGhostBtn} border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50`}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? '…' : 'Logout'}
                    </Button>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-3 ring-1 ring-orange-100">
                        <Package className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                        <div className={adminChip}>
                            <Sparkles className="h-3.5 w-3.5" />
                            B2C registration
                        </div>
                        <h1 className={`mt-3 ${adminPageTitle}`}>Packages</h1>
                        <p className={`mt-1 max-w-2xl text-sm ${adminMuted}`}>
                            Create and manage bookable packages. The public Packages page uses this list when database packages are enabled.
                        </p>
                    </div>
                </div>
            </div>

            {flash?.message ? (
                <div
                    className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                        flash.type === 'error'
                            ? 'border-red-200 bg-red-50 text-red-800'
                            : 'border-amber-200 bg-amber-50 text-amber-900'
                    }`}
                >
                    {flash.message}
                </div>
            ) : null}

            {packages.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center shadow-sm">
                    <p className="text-slate-600">No packages yet. Create one to enable online registration on the B2C packages page.</p>
                    <Link href="/admin/b2c-packages/create" className="mt-4 inline-block text-sm font-medium text-orange-600 hover:underline">
                        Create first package
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-medium uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Package</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Pax</th>
                                <th className="px-4 py-3">Deadline</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {packages.map((p) => (
                                <tr key={p.id} className="transition-colors hover:bg-orange-50/40">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-[#1e3a5f]">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.departure_period}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.package_code}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-slate-800">
                                            {p.pax_booked}/{p.pax_capacity}
                                        </span>
                                        <div className="text-xs text-slate-500">{p.registrations_count} registration(s)</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-amber-600" />
                                            {new Date(p.registration_deadline).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={p.registration_open ? 'default' : 'secondary'}
                                            className={
                                                p.registration_open && p.status === 'open'
                                                    ? 'border border-amber-200 bg-amber-50 text-amber-900'
                                                    : 'border border-slate-200 bg-slate-100 text-slate-600'
                                            }
                                        >
                                            {p.status === 'open' && p.registration_open ? 'Open' : p.status === 'closed' ? 'Closed' : 'Unavailable'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link href={`/admin/b2c-packages/${p.slug}/registrations`}>
                                                <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-amber-50 hover:text-amber-800" title="Participants">
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/b2c-packages/${p.slug}/edit`}>
                                                <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-orange-50 hover:text-orange-700" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" title="Delete" onClick={() => onDelete(p)}>
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
        </AdminPortalShell>
    );
}
