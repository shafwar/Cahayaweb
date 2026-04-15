import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminBackLink, adminChip, adminGhostBtn, adminPrimaryBtn } from '@/lib/admin-portal-theme';
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
                        className={`${adminGhostBtn} border-red-400/35 text-red-200 hover:border-red-400/50 hover:bg-red-500/10`}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? '…' : 'Logout'}
                    </Button>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-[#ff5200]/25 to-[#fec901]/10 p-3 ring-1 ring-[#ff5200]/25">
                        <Package className="h-8 w-8 text-[#fec901]" />
                    </div>
                    <div>
                        <div className={adminChip}>
                            <Sparkles className="h-3.5 w-3.5" />
                            B2C registration
                        </div>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Packages</h1>
                        <p className="mt-1 max-w-2xl text-sm text-[#94a3b8]">
                            Create and manage bookable packages. The public Packages page uses this list when database packages are enabled.
                        </p>
                    </div>
                </div>
            </div>

            {flash?.message ? (
                <div
                    className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                        flash.type === 'error'
                            ? 'border-red-400/50 bg-red-500/10 text-red-100'
                            : 'border-[#fec901]/35 bg-[#fec901]/10 text-[#fef3c7]'
                    }`}
                >
                    {flash.message}
                </div>
            ) : null}

            {packages.length === 0 ? (
                <div className="rounded-2xl border border-[#2d4a6f]/40 bg-[#0d1422]/70 p-10 text-center">
                    <p className="text-[#cbd5e1]">No packages yet. Create one to enable online registration on the B2C packages page.</p>
                    <Link href="/admin/b2c-packages/create" className="mt-4 inline-block text-sm font-medium text-[#fec901] hover:underline">
                        Create first package
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#2d4a6f]/40 bg-[#0d1422]/70 shadow-xl backdrop-blur-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-[#2d4a6f]/40 bg-[#070d16]/80 text-xs uppercase tracking-wide text-[#94a3b8]">
                            <tr>
                                <th className="px-4 py-3">Package</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Pax</th>
                                <th className="px-4 py-3">Deadline</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4a6f]/30">
                            {packages.map((p) => (
                                <tr key={p.id} className="transition-colors hover:bg-[#ff5200]/5">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-white">{p.name}</div>
                                        <div className="text-xs text-[#94a3b8]">{p.departure_period}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-[#cbd5e1]">{p.package_code}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[#e2e8f0]">
                                            {p.pax_booked}/{p.pax_capacity}
                                        </span>
                                        <div className="text-xs text-[#64748b]">{p.registrations_count} registration(s)</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[#cbd5e1]">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#fec901]" />
                                            {new Date(p.registration_deadline).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={p.registration_open ? 'default' : 'secondary'}
                                            className={
                                                p.registration_open && p.status === 'open'
                                                    ? 'border border-[#fec901]/40 bg-[#fec901]/15 text-[#fef3c7]'
                                                    : 'border border-[#2d4a6f]/50 bg-[#1e3a5f]/50 text-[#94a3b8]'
                                            }
                                        >
                                            {p.status === 'open' && p.registration_open ? 'Open' : p.status === 'closed' ? 'Closed' : 'Unavailable'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link href={`/admin/b2c-packages/${p.slug}/registrations`}>
                                                <Button size="sm" variant="ghost" className="text-[#cbd5e1] hover:bg-[#fec901]/10 hover:text-[#fec901]" title="Participants">
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/b2c-packages/${p.slug}/edit`}>
                                                <Button size="sm" variant="ghost" className="text-[#cbd5e1] hover:bg-[#ff5200]/10 hover:text-white" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="ghost" className="text-red-300 hover:bg-red-500/10 hover:text-red-100" title="Delete" onClick={() => onDelete(p)}>
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
