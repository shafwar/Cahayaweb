import AdminFloatingToast, { type AdminToastPayload } from '@/components/admin/AdminFloatingToast';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cAdminRegistrationBell from '@/components/admin/B2cAdminRegistrationBell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    adminBackLink,
    adminGhostBtn,
    adminGlassPanel,
    adminMuted,
    adminOutlineButtonLight,
    adminPageTitle,
    adminSectionDesc,
    adminSectionHeader,
    adminSectionTitle,
} from '@/lib/admin-portal-theme';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, CheckCircle2, ClipboardList, ExternalLink, Info, MoreHorizontal, Trash2, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

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

function shortLabel(s: string): string {
    return s.replace(/_/g, ' ');
}

/** Compact operational chips: visa / ticket / hotel — full editing on participant detail page. */
function OpsChips({ r }: { r: Reg }) {
    return (
        <div className="mt-1.5 flex flex-row flex-wrap gap-1">
            <span className="rounded-md border border-violet-200/90 bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-900">
                Visa {shortLabel(r.visa_status)}
            </span>
            <span className="rounded-md border border-indigo-200/90 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-900">
                Tix {shortLabel(r.ticket_status)}
            </span>
            <span className="rounded-md border border-amber-200/90 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-900">
                Hotel {shortLabel(r.hotel_status)}
            </span>
        </div>
    );
}

function formatRegisteredAt(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

export default function B2cPackageRegistrations({
    package: pkg,
    registrations,
    flash,
}: {
    package: PkgSummary;
    registrations: Reg[];
    flash?: { type: string; message: string } | null;
}) {
    const [toast, setToast] = useState<AdminToastPayload | null>(null);

    useEffect(() => {
        if (flash?.message) {
            setToast({
                type: flash.type === 'error' ? 'error' : 'success',
                message: flash.message,
            });
        }
    }, [flash?.message, flash?.type]);

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
            <AdminFloatingToast toast={toast} onDismiss={() => setToast(null)} />

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
                                        Gunakan <strong>View detail</strong> untuk mengubah payment, visa, tiket, hotel, dan catatan internal. Quick action di menu tetap bisa{' '}
                                        <strong>Approve</strong> / <strong>Reject</strong>. Hapus baris hanya menghapus registrasi paket ini (pax dikembalikan); akun login dan B2B tidak dihapus.
                                    </p>
                                </div>
                            </div>

                            <div className="-mx-1 overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-inner shadow-slate-100">
                                <table className="w-full min-w-[64rem] table-fixed border-collapse text-left text-sm">
                                    <colgroup>
                                        <col className="w-[12%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[8%]" />
                                        <col className="w-[16%]" />
                                        <col className="w-[4%]" />
                                        <col className="w-[8%]" />
                                        <col className="w-[14%]" />
                                        <col className="w-[10%]" />
                                        <col className="w-[7.5rem]" />
                                        <col className="w-[4.5rem]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                            <th className="px-3 py-3.5 pr-2">Participant</th>
                                            <th className="px-3 py-3.5">Contact</th>
                                            <th className="px-3 py-3.5">Passport</th>
                                            <th className="px-3 py-3.5">Address</th>
                                            <th className="px-3 py-3.5 text-center">Pax</th>
                                            <th className="px-3 py-3.5">Status</th>
                                            <th className="px-3 py-3.5">Payment &amp; ops</th>
                                            <th className="px-3 py-3.5">Registered</th>
                                            <th className="px-2 py-3.5 text-center">Detail</th>
                                            <th className="px-2 py-3.5 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {registrations.map((r) => (
                                            <tr key={r.id} className="transition-colors hover:bg-orange-50/40">
                                                <td className="px-3 py-3 align-top">
                                                    <div className="break-words font-semibold leading-snug text-[#1e3a5f]">{r.full_name}</div>
                                                    <div className="mt-0.5 text-xs capitalize text-slate-500">{r.gender}</div>
                                                </td>
                                                <td className="px-3 py-3 align-top text-xs leading-relaxed">
                                                    <div className="break-all font-medium text-slate-800">{r.email}</div>
                                                    <div className="mt-1 break-words text-slate-600">{r.phone}</div>
                                                </td>
                                                <td className="px-3 py-3 align-top font-mono text-xs text-slate-700">{r.passport_number}</td>
                                                <td className="px-3 py-3 align-top">
                                                    <span className="line-clamp-3 text-xs leading-relaxed text-slate-600" title={r.address}>
                                                        {r.address}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 align-top text-center tabular-nums font-medium text-slate-800">{r.pax}</td>
                                                <td className="px-3 py-3 align-top">
                                                    <Badge className={cn('text-[10px] font-bold uppercase tracking-wide', registrationStatusBadge(r.registration_status))}>
                                                        {r.registration_status}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-3 align-top">
                                                    <Badge variant="outline" className={cn('border font-medium capitalize', paymentBadgeClass(r.payment_status))}>
                                                        {r.payment_status.replace(/_/g, ' ')}
                                                    </Badge>
                                                    <OpsChips r={r} />
                                                </td>
                                                <td className="px-3 py-3 align-top text-xs tabular-nums text-slate-600">{formatRegisteredAt(r.created_at)}</td>
                                                <td className="px-2 py-3 align-middle text-center">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(adminOutlineButtonLight, 'h-8 gap-1 rounded-lg px-2.5 text-[11px]')}
                                                        asChild
                                                    >
                                                        <Link href={`/admin/participants/${r.id}`}>
                                                            View detail
                                                            <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                                                        </Link>
                                                    </Button>
                                                </td>
                                                <td className="px-2 py-3 align-middle text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 w-9 shrink-0 border-2 border-orange-400 bg-orange-50/90 p-0 text-orange-800 shadow-sm ring-1 ring-orange-200/80 hover:bg-orange-100 hover:text-orange-950 focus-visible:ring-2 focus-visible:ring-orange-400"
                                                                aria-label={`Actions for ${r.full_name}`}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4 text-orange-700" aria-hidden />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52">
                                                            <DropdownMenuItem
                                                                disabled={r.registration_status === 'approved'}
                                                                className="gap-2"
                                                                onClick={() =>
                                                                    router.post(`/admin/b2c-packages/registrations/${r.id}/approve`, {}, { preserveScroll: true })
                                                                }
                                                            >
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={r.registration_status === 'rejected'}
                                                                className="gap-2"
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
                                                                <XCircle className="h-4 w-4 text-red-600" aria-hidden />
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild className="gap-2">
                                                                <Link href={`/admin/participants/${r.id}`}>
                                                                    <Info className="h-4 w-4 text-sky-600" aria-hidden />
                                                                    View detail — edit statuses
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 text-rose-700 focus:bg-rose-50 focus:text-rose-900"
                                                                onClick={() => confirmDeleteRegistration(r)}
                                                            >
                                                                <Trash2 className="h-4 w-4" aria-hidden />
                                                                Hapus baris
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
