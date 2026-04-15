import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminBackLink, adminGhostBtn } from '@/lib/admin-portal-theme';
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

export default function B2cPackageRegistrations({ package: pkg, registrations }: { package: PkgSummary; registrations: Reg[] }) {
    return (
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`Registrations — ${pkg.name}`} />

            <Link href="/admin/b2c-packages" className={`${adminBackLink} mb-6`}>
                <ArrowLeft className="h-4 w-4" />
                All packages
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white sm:text-3xl">{pkg.name}</h1>
                    <p className="mt-1 font-mono text-xs text-[#94a3b8]">{pkg.package_code}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Badge className="border border-[#2d4a6f]/50 bg-[#1e3a5f]/60 text-[#e2e8f0]">
                        Pax {pkg.pax_booked}/{pkg.pax_capacity}
                    </Badge>
                    <Badge
                        className={
                            pkg.registration_open
                                ? 'border border-[#fec901]/40 bg-[#fec901]/15 text-[#fef3c7]'
                                : 'border border-[#475569]/50 bg-[#334155]/60 text-[#cbd5e1]'
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

            <div className="mt-8 flex items-center gap-2 text-[#cbd5e1]">
                <Users className="h-5 w-5 text-[#fec901]" />
                <span className="font-medium">{registrations.length} registration(s)</span>
            </div>

            {registrations.length === 0 ? (
                <p className="mt-6 text-[#94a3b8]">No registrations yet.</p>
            ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#2d4a6f]/40 bg-[#0d1422]/70">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-[#2d4a6f]/40 bg-[#070d16]/80 text-xs uppercase tracking-wide text-[#94a3b8]">
                            <tr>
                                <th className="px-4 py-3">Participant</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Passport</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Pax</th>
                                <th className="px-4 py-3">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4a6f]/30 text-[#e2e8f0]">
                            {registrations.map((r) => (
                                <tr key={r.id} className="hover:bg-[#ff5200]/5">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{r.full_name}</div>
                                        <div className="text-xs text-[#94a3b8]">{r.gender}</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        <div>{r.email}</div>
                                        <div className="text-[#94a3b8]">{r.phone}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.passport_number}</td>
                                    <td className="max-w-xs truncate px-4 py-3 text-xs text-[#cbd5e1]">{r.address}</td>
                                    <td className="px-4 py-3">{r.pax}</td>
                                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminPortalShell>
    );
}
