import AdminActionToastHost from '@/components/admin/AdminActionToastHost';
import AdminB2cInboxBell from '@/components/admin/AdminB2cInboxBell';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminBackLink, adminGhostBtn, adminMuted, adminPageTitle } from '@/lib/admin-portal-theme';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Users } from 'lucide-react';

type Reg = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    passport_number: string;
    address: string;
    date_of_birth: string | null;
    gender: string;
    departure_period_snapshot: string;
    pax: number;
    terms_accepted_at: string | null;
    created_at: string | null;
    user_id: number | null;
};

type PkgSummary = {
    id: number;
    name: string;
    slug: string;
    package_code: string;
    pax_capacity: number;
    pax_booked: number;
    registration_open: boolean;
};

export default function B2cPackageRegistrations({
    package: pkg,
    registrations,
    flash,
}: {
    package: PkgSummary;
    registrations: Reg[];
    flash?: { type: string; message: string } | null;
}) {
    return (
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`Registrations — ${pkg.name}`} />
            <AdminActionToastHost flash={flash} />

            <Link href="/admin/b2c-packages" className={`${adminBackLink} mb-6`}>
                <ArrowLeft className="h-4 w-4" />
                All packages
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/90 pb-8">
                <div className="min-w-0">
                    <h1 className={`break-words ${adminPageTitle}`}>{pkg.name}</h1>
                    <p className={`mt-1 font-mono text-xs ${adminMuted}`}>{pkg.package_code}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <AdminB2cInboxBell />
                    <Badge className="border border-slate-200 bg-slate-100 text-slate-800">
                        Pax {pkg.pax_booked}/{pkg.pax_capacity}
                    </Badge>
                    <Badge
                        className={
                            pkg.registration_open
                                ? 'border border-amber-200 bg-amber-50 text-amber-900'
                                : 'border border-slate-200 bg-slate-100 text-slate-600'
                        }
                    >
                        {pkg.registration_open ? 'Registration open' : 'Registration closed'}
                    </Badge>
                    <Link href={`/admin/b2c-packages/${pkg.slug}/edit`}>
                        <Button type="button" variant="outline" className={adminGhostBtn}>
                            Edit package
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-slate-700">
                <Users className="h-5 w-5 text-amber-600" />
                <span className="font-medium">{registrations.length} registration(s)</span>
            </div>

            {registrations.length === 0 ? (
                <p className={`mt-6 ${adminMuted}`}>No registrations yet.</p>
            ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-medium uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Participant</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Passport</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Pax</th>
                                <th className="px-4 py-3">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                            {registrations.map((r) => (
                                <tr key={r.id} className="hover:bg-orange-50/30">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-[#1e3a5f]">{r.full_name}</div>
                                        <div className="text-xs text-slate-500">{r.gender}</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        <div>{r.email}</div>
                                        <div className="text-slate-500">{r.phone}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.passport_number}</td>
                                    <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-600">{r.address}</td>
                                    <td className="px-4 py-3">{r.pax}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminPortalShell>
    );
}
