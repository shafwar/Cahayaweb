import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <Head title={`Registrations — ${pkg.name}`} />
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Link href="/admin/b2c-packages" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    All packages
                </Link>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">{pkg.name}</h1>
                        <p className="mt-1 font-mono text-xs text-slate-400">{pkg.package_code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-slate-800 text-slate-100">
                            Pax {pkg.pax_booked}/{pkg.pax_capacity}
                        </Badge>
                        <Badge className={pkg.registration_open ? 'bg-emerald-600' : 'bg-slate-600'}>
                            {pkg.registration_open ? 'Registration open' : 'Registration closed'}
                        </Badge>
                        <Link href={`/admin/b2c-packages/${pkg.slug}/edit`}>
                            <Button variant="outline" size="sm" className="border-white/20 text-slate-100">
                                Edit package
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-slate-300">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{registrations.length} registration(s)</span>
                </div>

                {registrations.length === 0 ? (
                    <p className="mt-6 text-slate-400">No registrations yet.</p>
                ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Participant</th>
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Passport</th>
                                    <th className="px-4 py-3">Address</th>
                                    <th className="px-4 py-3">Pax</th>
                                    <th className="px-4 py-3">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {registrations.map((r) => (
                                    <tr key={r.id} className="align-top hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{r.full_name}</div>
                                            <div className="text-xs text-slate-400">{r.gender}</div>
                                            <div className="text-xs text-slate-500">DOB {r.date_of_birth}</div>
                                            {r.user_id ? <div className="mt-1 text-[10px] text-emerald-400/90">User #{r.user_id}</div> : null}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-300">
                                            <div>{r.email}</div>
                                            <div className="mt-1">{r.phone}</div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-300">{r.passport_number}</td>
                                        <td className="max-w-[200px] px-4 py-3 text-xs leading-snug text-slate-400">
                                            <span className="line-clamp-3">{r.address}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-200">{r.pax}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="border-t border-white/10 p-4 text-xs text-slate-500">
                            Address and terms acceptance are stored per registration; export or CRM features can be added later.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
