import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import type { User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, ChevronRight, Package, Plane, Sparkles } from 'lucide-react';

type B2bPortalSummary = {
    has_application: boolean;
    status: string;
    company_name?: string | null;
    reviewed_at?: string | null;
};

type RegistrationItem = {
    id: number;
    registration_status: 'pending' | 'approved' | 'rejected';
    payment_status: 'unpaid' | 'waiting_confirmation' | 'paid';
    visa_status: 'not_processed' | 'in_progress' | 'completed';
    ticket_status: 'not_booked' | 'booked';
    hotel_status: 'not_assigned' | 'assigned';
    notes?: string | null;
    reviewed_at?: string | null;
    created_at?: string | null;
    pax: number;
    full_name: string;
    package: {
        name: string;
        slug?: string | null;
        price_display: string;
    };
};

function statusBadgeClass(status: RegistrationItem['registration_status']): string {
    if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    if (status === 'rejected') return 'border-red-200 bg-red-50 text-red-800';
    return 'border-amber-200 bg-amber-50 text-amber-900';
}

function registrationStatusLabel(status: RegistrationItem['registration_status']): string {
    if (status === 'approved') return 'Disetujui';
    if (status === 'rejected') return 'Ditolak';
    return 'Menunggu review';
}

function b2bStatusLabel(status: string): string {
    if (status === 'none') return 'Belum ada pengajuan agen';
    if (status === 'pending') return 'Menunggu review admin';
    if (status === 'approved') return 'Disetujui — Anda memiliki akses portal B2B';
    if (status === 'rejected') return 'Ditolak — hubungi admin atau ajukan ulang';
    return status;
}

function b2bAccentClass(status: string): string {
    if (status === 'approved') return 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white';
    if (status === 'rejected') return 'border-l-red-500 bg-gradient-to-br from-red-50/50 to-white';
    if (status === 'pending') return 'border-l-amber-500 bg-gradient-to-br from-amber-50/60 to-white';
    return 'border-l-sky-500 bg-gradient-to-br from-sky-50/70 to-white';
}

function b2bStatusPillClass(status: string): string {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-800 ring-emerald-200/60';
    if (status === 'rejected') return 'bg-red-100 text-red-800 ring-red-200/60';
    if (status === 'pending') return 'bg-amber-100 text-amber-900 ring-amber-200/60';
    return 'bg-slate-100 text-slate-700 ring-slate-200/60';
}

function registrationCardAccent(status: RegistrationItem['registration_status']): string {
    if (status === 'approved') return 'border-l-emerald-500';
    if (status === 'rejected') return 'border-l-red-500';
    return 'border-l-amber-500';
}

export default function B2cAccount({ registrations, b2bPortal }: { registrations: RegistrationItem[]; b2bPortal: B2bPortalSummary }) {
    const { props } = usePage<{ auth?: { user: User | null } }>();
    const user = props.auth?.user ?? null;

    return (
        <PublicLayout>
            <Head title="Akun B2C" />
            <SeoHead title="Akun B2C - Cahaya Anbiya" description="Status pendaftaran paket B2C Anda." />

            <section className="bg-section-photos-home min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-10 text-center lg:mb-12 lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/15 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1e3a5f]/80 shadow-sm backdrop-blur-sm">
                            <Sparkles className="size-3.5 text-[#c9a227]" aria-hidden />
                            Area pengguna
                        </div>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1e3a5f] sm:text-4xl">Akun Anda</h1>
                        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 lg:mx-0">
                            Satu akun untuk jalur wisatawan (B2C) dan agen perjalanan (B2B). Pilih jalur di bawah — status masing-masing ditampilkan
                            dengan jelas.
                        </p>
                        {user ? (
                            <div className="mx-auto mt-5 flex max-w-xl flex-col gap-1 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-3 text-left shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between lg:mx-0 lg:max-w-none">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Masuk sebagai</p>
                                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                </div>
                                <p className="truncate text-sm text-slate-600 sm:max-w-[50%] sm:text-right" title={user.email}>
                                    {user.email}
                                </p>
                            </div>
                        ) : null}
                    </header>

                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
                        {/* B2B */}
                        <article
                            className={`relative overflow-hidden rounded-2xl border border-slate-200/90 border-l-4 bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] ring-1 ring-slate-100 sm:p-8 ${b2bAccentClass(b2bPortal.status)}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/25">
                                    <Briefcase className="size-6" strokeWidth={1.75} aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jalur agen</p>
                                    <h2 className="mt-1 text-xl font-bold text-[#1e3a5f]">B2B — Portal & pengajuan</h2>
                                    <span
                                        className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${b2bStatusPillClass(b2bPortal.status)}`}
                                    >
                                        {b2bPortal.status === 'none'
                                            ? 'Belum mengajukan'
                                            : b2bPortal.status === 'pending'
                                              ? 'Sedang ditinjau'
                                              : b2bPortal.status === 'approved'
                                                ? 'Aktif'
                                                : b2bPortal.status === 'rejected'
                                                  ? 'Perlu tindakan'
                                                  : b2bPortal.status}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-5 text-[15px] leading-relaxed text-slate-700">{b2bStatusLabel(b2bPortal.status)}</p>
                            {b2bPortal.company_name ? (
                                <p className="mt-2 text-sm text-slate-600">
                                    Perusahaan: <span className="font-semibold text-slate-900">{b2bPortal.company_name}</span>
                                </p>
                            ) : null}

                            <Separator className="my-6 bg-slate-200/80" />

                            <p className="text-sm font-medium text-slate-800">Langkah berikutnya</p>
                            <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                                    <span>
                                        <strong className="font-semibold text-slate-800">Pengajuan baru</strong> — isi formulir agen jika Anda belum
                                        pernah mengajukan.
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                                    <span>
                                        <strong className="font-semibold text-slate-800">Sudah disetujui</strong> — masuk portal B2B dengan akun yang
                                        sama.
                                    </span>
                                </li>
                            </ul>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 flex-1 border-slate-300 bg-white font-medium text-[#0c4a6e] shadow-sm hover:bg-slate-50"
                                    asChild
                                >
                                    <Link href="/b2b/register" aria-label="Buka formulir pengajuan agen B2B">
                                        Form pengajuan agen
                                    </Link>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 flex-1 border-slate-300 bg-white font-medium text-[#0c4a6e] shadow-sm hover:bg-slate-50"
                                    asChild
                                >
                                    <Link href="/login?mode=b2b&redirect=/b2b" aria-label="Masuk ke portal agen B2B">
                                        Masuk portal agen
                                    </Link>
                                </Button>
                            </div>
                        </article>

                        {/* B2C */}
                        <article className="relative overflow-hidden rounded-2xl border border-slate-200/90 border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50/50 via-white to-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] ring-1 ring-teal-100/80 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-700/25">
                                    <Plane className="size-6" strokeWidth={1.75} aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-800/80">Jalur wisatawan</p>
                                    <h2 className="mt-1 text-xl font-bold text-[#1e3a5f]">B2C — Paket wisata</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        Daftar dan pantau pendaftaran paket umroh atau wisata dari katalog kami.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                {registrations.length === 0 ? (
                                    <div className="flex flex-col items-center rounded-xl border border-dashed border-teal-200/90 bg-white/90 px-5 py-10 text-center shadow-inner">
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                                            <Package className="size-7" strokeWidth={1.5} aria-hidden />
                                        </div>
                                        <p className="mt-4 text-base font-semibold text-slate-800">Belum ada pendaftaran paket</p>
                                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                                            Jelajahi katalog paket, pilih tanggal yang sesuai, lalu kirim formulir — riwayat akan muncul di sini.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {registrations.map((item) => (
                                            <li
                                                key={item.id}
                                                className={`rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 border-l-4 ${registrationCardAccent(item.registration_status)}`}
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-[#1e3a5f]">{item.package.name}</p>
                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {item.full_name} · {item.pax} pax · {item.package.price_display}
                                                        </p>
                                                    </div>
                                                    <Badge className={`shrink-0 text-xs font-semibold ${statusBadgeClass(item.registration_status)}`}>
                                                        {registrationStatusLabel(item.registration_status)}
                                                    </Badge>
                                                </div>
                                                {item.registration_status === 'approved' ? (
                                                    <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                                                        Pendaftaran disetujui — Anda dapat melanjutkan ke pembayaran. Invoice akan tersedia di fitur
                                                        invoice B2C.
                                                    </p>
                                                ) : null}
                                                {item.registration_status === 'pending' ? (
                                                    <p className="mt-3 text-sm leading-relaxed text-amber-900">
                                                        Sedang ditinjau tim kami. Anda akan dihubungi jika ada informasi tambahan.
                                                    </p>
                                                ) : null}
                                                {item.registration_status === 'rejected' ? (
                                                    <p className="mt-3 text-sm leading-relaxed text-red-800">
                                                        Pengajuan ditolak{item.notes ? `: ${item.notes}` : '.'}
                                                    </p>
                                                ) : null}
                                                <Separator className="my-3 bg-slate-100" />
                                                <p className="text-xs leading-relaxed text-slate-500">
                                                    <span className="font-medium text-slate-600">Progres:</span> Pembayaran{' '}
                                                    {item.payment_status.replace('_', ' ')} · Visa {item.visa_status.replace('_', ' ')} · Tiket{' '}
                                                    {item.ticket_status.replace('_', ' ')} · Hotel {item.hotel_status.replace('_', ' ')}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-8">
                                <Button
                                    type="button"
                                    size="lg"
                                    className="h-12 w-full border border-[#ff5200]/35 bg-gradient-to-r from-[#ff5200] to-[#e64a00] text-base font-semibold text-white shadow-md shadow-orange-500/20 transition hover:from-[#ff6b35] hover:to-[#ff5200] sm:w-auto sm:min-w-[280px]"
                                    asChild
                                >
                                    <Link href="/packages" aria-label="Buka katalog paket wisata B2C">
                                        Lihat & pilih paket wisata
                                    </Link>
                                </Button>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
