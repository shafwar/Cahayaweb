import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cAdminRegistrationBell from '@/components/admin/B2cAdminRegistrationBell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminBackLink, adminGhostBtn, adminGlassPanel, adminMuted, adminPageTitle, adminSectionDesc, adminSectionHeader, adminSectionTitle } from '@/lib/admin-portal-theme';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, CheckCircle2, ClipboardList, Trash2, Users, XCircle } from 'lucide-react';

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
    registration_status: 'pending' | 'approved' | 'rejected';
    payment_status: 'unpaid' | 'waiting_confirmation' | 'paid';
    visa_status: 'not_processed' | 'in_progress' | 'completed';
    ticket_status: 'not_booked' | 'booked';
    hotel_status: 'not_assigned' | 'assigned';
    reviewed_at: string | null;
    notes: string | null;
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

function registrationStatusBadge(status: Reg['registration_status']) {
    if (status === 'approved')
        return 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/15';
    if (status === 'rejected') return 'border-red-300 bg-red-50 text-red-900 ring-1 ring-red-500/15';
    return 'border-amber-300 bg-amber-50 text-amber-950 ring-1 ring-amber-500/15';
}

function paymentBadgeClass(status: Reg['payment_status']) {
    if (status === 'paid') return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    if (status === 'waiting_confirmation') return 'border-sky-300 bg-sky-50 text-sky-900';
    return 'border-slate-300 bg-white text-slate-700';
}

/** Tombol aksi terang & kontras — hindari outline gelap dari tema default. */
const btnApprove =
    'h-9 shrink-0 rounded-lg border-2 border-emerald-500 bg-emerald-500 px-3 text-xs font-semibold text-white shadow-sm transition hover:border-emerald-600 hover:bg-emerald-600 disabled:pointer-events-none disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-100 disabled:shadow-none';

const btnReject =
    'h-9 shrink-0 rounded-lg border-2 border-red-400 bg-white px-3 text-xs font-semibold text-red-700 shadow-sm transition hover:border-red-500 hover:bg-red-50 disabled:pointer-events-none disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-100';

const btnDetail =
    'h-9 shrink-0 rounded-lg border-2 border-sky-400 bg-sky-50 px-3 text-xs font-semibold text-sky-950 shadow-sm transition hover:border-sky-500 hover:bg-sky-100';

const btnDeleteRow =
    'inline-flex h-9 shrink-0 gap-1 rounded-lg border-2 border-rose-400 bg-rose-50 px-3 text-xs font-semibold text-rose-900 shadow-sm transition hover:border-rose-500 hover:bg-rose-100';

export default function B2cPackageRegistrations({ package: pkg, registrations }: { package: PkgSummary; registrations: Reg[] }) {
    const pendingCount = registrations.filter((r) => r.registration_status === 'pending').length;
    const approvedCount = registrations.filter((r) => r.registration_status === 'approved').length;

    const confirmDeleteRegistration = (r: Reg) => {
        const ok = window.confirm(
            `Hapus registrasi B2C untuk "${r.full_name}" dari paket ini saja?\n\n` +
                `Ini menghapus baris pendaftaran paket dan mengembalikan kuota pax. Akun pengguna (login) dan data pengajuan agen B2B tidak akan dihapus.`,
        );
        if (!ok) return;
        router.delete(`/admin/b2c-packages/registrations/${r.id}`, { preserveScroll: true });
    };

    const confirmDeleteAllRegistrations = () => {
        const typed = window.prompt(
            `PERINGATAN: Semua registrasi B2C untuk paket ini akan dihapus.\n\n` +
                `Akun user tidak dihapus; data B2B tidak disentuh.\n\n` +
                `Ketik kode paket persis untuk melanjutkan:\n"${pkg.package_code}"`,
        );
        if (typed === null) return;
        const code = typed.trim();
        if (code !== pkg.package_code) {
            window.alert('Kode paket tidak cocok. Tidak ada yang dihapus.');
            return;
        }
        const ok = window.confirm(`Yakin hapus ${registrations.length} registrasi untuk paket ini?`);
        if (!ok) return;
        router.delete(`/admin/b2c-packages/${pkg.slug}/registrations`, {
            preserveScroll: true,
            data: { confirm_package_code: code },
        });
    };

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`Registrations — ${pkg.name}`} />

            <Link href="/admin/b2c-packages" className={`${adminBackLink} mb-6`}>
                <ArrowLeft className="h-4 w-4" />
                All packages
            </Link>

            <div className={cn(adminGlassPanel, 'overflow-hidden')}>
                <div className={adminSectionHeader}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className={`break-words ${adminPageTitle}`}>{pkg.name}</h1>
                            <p className={`mt-1 font-mono text-xs ${adminMuted}`}>{pkg.package_code}</p>
                            <p className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${adminMuted}`}>
                                <span className="inline-flex items-center gap-1.5">
                                    <ClipboardList className="h-4 w-4 text-orange-500" aria-hidden />
                                    Kelola peserta & persetujuan
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <B2cAdminRegistrationBell />
                            <Badge className="border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                                Pax {pkg.pax_booked}/{pkg.pax_capacity}
                            </Badge>
                            <Badge
                                className={
                                    pkg.registration_open
                                        ? 'border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-950'
                                        : 'border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'
                                }
                            >
                                {pkg.registration_open ? 'Registration open' : 'Registration closed'}
                            </Badge>
                            <Link href={`/admin/b2c-packages/${pkg.slug}/edit`}>
                                <Button type="button" variant="outline" className={adminGhostBtn}>
                                    Edit package
                                </Button>
                            </Link>
                            {registrations.length > 0 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="inline-flex gap-2 rounded-xl border-2 border-rose-400 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm hover:bg-rose-50"
                                    onClick={confirmDeleteAllRegistrations}
                                >
                                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                                    Hapus semua registrasi
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-orange-50/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-800">
                            <Users className="h-5 w-5 shrink-0 text-[#ff5200]" aria-hidden />
                            <span className="font-semibold">{registrations.length} registrasi</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs font-medium">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-amber-900 shadow-sm">
                                Pending: <strong className="tabular-nums">{pendingCount}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-emerald-900 shadow-sm">
                                Approved: <strong className="tabular-nums">{approvedCount}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    {registrations.length === 0 ? (
                        <p className={`py-8 text-center ${adminMuted}`}>Belum ada registrasi untuk paket ini.</p>
                    ) : (
                        <>
                            <div className="mb-4 flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#ff5200] ring-1 ring-orange-500/20">
                                    <CalendarClock className="h-5 w-5" aria-hidden />
                                </div>
                                <div>
                                    <h2 className={adminSectionTitle}>Daftar peserta</h2>
                                    <p className={adminSectionDesc}>
                                        Approve / Reject untuk review. Hapus baris hanya menghapus data registrasi paket B2C ini (kuota pax dikembalikan); akun pengguna
                                        dan jalur B2B tidak dihapus.
                                    </p>
                                </div>
                            </div>

                            <div className="-mx-1 overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-inner shadow-slate-100">
                                <table className="w-full min-w-[88rem] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                            <th className="whitespace-nowrap px-4 py-3.5">Participant</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Contact</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Passport</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Address</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Pax</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Payment</th>
                                            <th className="whitespace-nowrap px-4 py-3.5">Registered</th>
                                            <th className="sticky right-0 z-[1] whitespace-nowrap border-l border-slate-200 bg-slate-50 px-4 py-3.5 text-right shadow-[-8px_0_12px_-8px_rgba(15,23,42,0.12)]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {registrations.map((r) => (
                                            <tr key={r.id} className="group border-b border-slate-100 bg-white transition-colors hover:bg-orange-50/40">
                                                <td className="max-w-[14rem] px-4 py-3 align-top">
                                                    <div className="font-semibold text-[#1e3a5f]">{r.full_name}</div>
                                                    <div className="mt-0.5 text-xs capitalize text-slate-500">{r.gender}</div>
                                                </td>
                                                <td className="max-w-[12rem] px-4 py-3 align-top text-xs leading-relaxed">
                                                    <div className="break-all font-medium text-slate-800">{r.email}</div>
                                                    <div className="mt-1 text-slate-600">{r.phone}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs text-slate-700">{r.passport_number}</td>
                                                <td className="max-w-[14rem] px-4 py-3 align-top">
                                                    <span className="line-clamp-2 text-xs leading-relaxed text-slate-600" title={r.address}>
                                                        {r.address}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums font-medium text-slate-800">{r.pax}</td>
                                                <td className="whitespace-nowrap px-4 py-3 align-top">
                                                    <Badge className={cn('text-[10px] font-bold uppercase tracking-wide', registrationStatusBadge(r.registration_status))}>
                                                        {r.registration_status}
                                                    </Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 align-top">
                                                    <Badge variant="outline" className={cn('border font-medium capitalize', paymentBadgeClass(r.payment_status))}>
                                                        {r.payment_status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-slate-600">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                                                <td className="sticky right-0 z-[1] border-l border-slate-100 bg-white px-4 py-3 align-top shadow-[-10px_0_14px_-10px_rgba(15,23,42,0.08)] group-hover:bg-orange-50/40">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={r.registration_status === 'approved'}
                                                            className={btnApprove}
                                                            onClick={() =>
                                                                router.post(`/admin/b2c-packages/registrations/${r.id}/approve`, {}, { preserveScroll: true })
                                                            }
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={r.registration_status === 'rejected'}
                                                            className={btnReject}
                                                            onClick={() => {
                                                                const notes = window.prompt('Catatan admin (opsional):', r.notes ?? '');
                                                                if (notes === null) return;
                                                                router.post(
                                                                    `/admin/b2c-packages/registrations/${r.id}/reject`,
                                                                    { notes },
                                                                    { preserveScroll: true },
                                                                );
                                                            }}
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" aria-hidden />
                                                            Reject
                                                        </Button>
                                                        <Button type="button" size="sm" variant="outline" className={btnDetail} asChild>
                                                            <Link href={`/admin/participants/${r.id}`}>Detail</Link>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className={btnDeleteRow}
                                                            onClick={() => confirmDeleteRegistration(r)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminPortalShell>
    );
}
