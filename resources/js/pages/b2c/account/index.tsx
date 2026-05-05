import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, Building2, ChevronRight, CreditCard, Package, Plane, Sparkles, Stamp, Ticket } from 'lucide-react';

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

function registrationSoftBg(status: RegistrationItem['registration_status']): string {
    if (status === 'approved') return 'from-emerald-50/50';
    if (status === 'rejected') return 'from-red-50/40';
    return 'from-amber-50/45';
}

function registrationAccentBar(status: RegistrationItem['registration_status']): string {
    if (status === 'approved') return 'bg-emerald-500';
    if (status === 'rejected') return 'bg-red-500';
    return 'bg-amber-400';
}

function labelPayment(s: RegistrationItem['payment_status']): string {
    if (s === 'unpaid') return 'Belum bayar';
    if (s === 'waiting_confirmation') return 'Menunggu konfirmasi';
    if (s === 'paid') return 'Lunas';
    return s;
}

function labelVisa(s: RegistrationItem['visa_status']): string {
    if (s === 'not_processed') return 'Belum diproses';
    if (s === 'in_progress') return 'Diproses';
    if (s === 'completed') return 'Selesai';
    return s;
}

function labelTicket(s: RegistrationItem['ticket_status']): string {
    if (s === 'not_booked') return 'Belum booking';
    if (s === 'booked') return 'Sudah booking';
    return s;
}

function labelHotel(s: RegistrationItem['hotel_status']): string {
    if (s === 'not_assigned') return 'Belum ditetapkan';
    if (s === 'assigned') return 'Sudah ditetapkan';
    return s;
}

/** Isi kartu: padding horizontal seragam dengan footer */
const cardBodyClass = 'flex min-h-0 flex-1 flex-col px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8';

/** Footer: lebar penuh, tombol sejajar & proporsional */
const cardFooterShell =
    'mt-auto -mx-0 border-t border-slate-200/80 bg-slate-50/95 px-6 py-7 sm:px-8 sm:py-8 rounded-b-2xl';

const actionRowClass = 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3';

/** Tombol sekunder — satu gaya untuk semua kartu */
const btnOutline =
    'inline-flex h-12 min-h-[48px] w-full min-w-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-50';

/** Tombol primer B2B — navy, bayangan sama tipisnya dengan B2C */
const btnPrimaryNavy =
    'inline-flex h-12 min-h-[48px] w-full min-w-0 items-center justify-center rounded-xl border border-[#1e3a5f]/30 bg-[#1e3a5f] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#274a7a]';

/** Tombol primer B2C — oranye lebih tenang, proporsi sama dengan navy */
const btnPrimaryBrand =
    'inline-flex h-12 min-h-[48px] w-full min-w-0 items-center justify-center rounded-xl border border-orange-700/25 bg-gradient-to-b from-[#ff7328] to-[#ea580c] px-4 text-sm font-semibold text-white shadow-sm transition hover:from-[#ff8c42] hover:to-[#f97316]';

function PathFooterIntro({ title, hint }: { title: string; hint: string }) {
    return (
        <div className="mb-5 max-w-xl">
            <p className="text-base font-bold leading-snug text-slate-900">{title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{hint}</p>
        </div>
    );
}

export default function B2cAccount({ registrations, b2bPortal }: { registrations: RegistrationItem[]; b2bPortal: B2bPortalSummary }) {
    const { props } = usePage<{ auth?: { user: User | null } }>();
    const user = props.auth?.user ?? null;

    return (
        <PublicLayout>
            <Head title="Akun B2C" />
            <SeoHead title="Akun B2C - Cahaya Anbiya" description="Status pendaftaran paket B2C Anda." />

            <section className="relative z-[1] bg-section-photos-home min-h-screen px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <header className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-200/40 sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/12 bg-[#f8fafc] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e3a5f]/85 sm:text-xs">
                                    <Sparkles className="size-3.5 shrink-0 text-[#c9a227]" aria-hidden />
                                    Area pengguna
                                </div>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1e3a5f] sm:text-4xl">Akun Anda</h1>
                                <p className="mt-3 text-base leading-relaxed text-slate-600">
                                    Satu login untuk <span className="font-semibold text-slate-800">wisatawan (B2C)</span> dan{' '}
                                    <span className="font-semibold text-slate-800">agen (B2B)</span>. Kartu kiri untuk pengajuan & portal agen; kartu
                                    kanan untuk pendaftaran paket dan ringkasan progres per pesanan.
                                </p>
                            </div>
                            {user ? (
                                <div className="w-full shrink-0 rounded-xl border border-slate-200 bg-slate-50/90 px-5 py-4 lg:max-w-sm">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Sesi aktif</p>
                                    <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">{user.name}</p>
                                    <p className="mt-1 truncate text-xs leading-relaxed text-slate-600" title={user.email}>
                                        {user.email}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
                        <article
                            className={cn(
                                'flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 border-l-4 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] ring-1 ring-slate-100/90',
                                b2bAccentClass(b2bPortal.status),
                            )}
                        >
                            <div className={cardBodyClass}>
                                <div className="flex gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1e3a5f] text-white shadow-sm">
                                        <Briefcase className="size-6" strokeWidth={1.75} aria-hidden />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">Jalur agen</p>
                                        <h2 className="mt-1.5 text-xl font-bold leading-snug text-[#1e3a5f] sm:text-[1.35rem]">B2B — Portal & pengajuan</h2>
                                        <span
                                            className={cn(
                                                'mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                                                b2bStatusPillClass(b2bPortal.status),
                                            )}
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

                                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                    Setelah disetujui, gunakan email akun ini untuk masuk ke portal B2B (dokumen & komunikasi dengan tim internal).
                                </p>

                                <Separator className="my-6 bg-slate-200/80" />

                                <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
                                    <p className="text-sm font-bold text-slate-800">Langkah berikutnya</p>
                                    <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-slate-600">
                                        <li className="flex gap-3">
                                            <ChevronRight className="mt-0.5 size-4 shrink-0 text-[#1e3a5f]" aria-hidden />
                                            <span>
                                                <span className="font-semibold text-slate-800">Pengajuan baru</span> — lengkapi data perusahaan & unggah
                                                dokumen pada formulir resmi.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <ChevronRight className="mt-0.5 size-4 shrink-0 text-[#1e3a5f]" aria-hidden />
                                            <span>
                                                <span className="font-semibold text-slate-800">Sudah disetujui</span> — pilih &quot;Masuk portal agen&quot;
                                                dan login dengan akun yang sama.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className={cardFooterShell}>
                                <PathFooterIntro
                                    title="Aksi untuk jalur agen"
                                    hint="Dua tombol di bawah memiliki lebar sama di layar lebar — kiri untuk pengajuan pertama, kanan untuk login portal."
                                />
                                <div className={actionRowClass}>
                                    <Button type="button" variant="outline" className={btnOutline} asChild>
                                        <Link href="/b2b/register" className="no-underline" aria-label="Buka formulir pengajuan agen B2B">
                                            Form pengajuan agen
                                        </Link>
                                    </Button>
                                    <Button type="button" className={btnPrimaryNavy} asChild>
                                        <Link href="/login?mode=b2b&redirect=/b2b" className="text-white no-underline hover:text-white" aria-label="Masuk ke portal agen B2B">
                                            Masuk portal agen
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </article>

                        <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50/40 via-white to-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] ring-1 ring-teal-100/70">
                            <div className={cardBodyClass}>
                                <div className="flex gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                                        <Plane className="size-6" strokeWidth={1.75} aria-hidden />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-900/70 sm:text-xs">Jalur wisatawan</p>
                                        <h2 className="mt-1.5 text-xl font-bold leading-snug text-[#1e3a5f] sm:text-[1.35rem]">B2C — Paket wisata</h2>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            Satu baris di bawah menampilkan ringkasan administrasi per pendaftaran (pembayaran hingga hotel).
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex-1">
                                    {registrations.length === 0 ? (
                                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-teal-200/90 bg-white/95 px-5 py-10 text-center">
                                            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                                                <Package className="size-7" strokeWidth={1.5} aria-hidden />
                                            </div>
                                            <p className="mt-4 text-base font-semibold text-slate-800">Belum ada pendaftaran paket</p>
                                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                                                Pilih paket di katalog, isi data peserta, lalu kirim — riwayat dan status review akan muncul di kartu ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-4">
                                            {registrations.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className={cn(
                                                        'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br to-white p-5 shadow-sm sm:p-6',
                                                        registrationSoftBg(item.registration_status),
                                                    )}
                                                >
                                                    <div
                                                        className={cn('absolute left-4 top-6 bottom-6 w-1 rounded-full sm:left-5', registrationAccentBar(item.registration_status))}
                                                        aria-hidden
                                                    />
                                                    <div className="relative pl-6 sm:pl-7">
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="text-base font-semibold text-[#1e3a5f]">{item.package.name}</p>
                                                                <p className="mt-2 text-sm text-slate-600">
                                                                    {item.full_name} · {item.pax} pax · {item.package.price_display}
                                                                </p>
                                                            </div>
                                                            <Badge className={cn('shrink-0 text-xs font-semibold', statusBadgeClass(item.registration_status))}>
                                                                {registrationStatusLabel(item.registration_status)}
                                                            </Badge>
                                                        </div>
                                                        {item.registration_status === 'approved' ? (
                                                            <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                                                                Pendaftaran disetujui — lanjut ke pembayaran. Invoice tersedia di fitur invoice B2C.
                                                            </p>
                                                        ) : null}
                                                        {item.registration_status === 'pending' ? (
                                                            <p className="mt-3 text-sm leading-relaxed text-amber-900">
                                                                Sedang ditinjau tim kami. Anda akan dihubungi jika diperlukan informasi tambahan.
                                                            </p>
                                                        ) : null}
                                                        {item.registration_status === 'rejected' ? (
                                                            <p className="mt-3 text-sm leading-relaxed text-red-800">
                                                                Pengajuan ditolak{item.notes ? `: ${item.notes}` : '.'}
                                                            </p>
                                                        ) : null}
                                                        <Separator className="my-5 bg-slate-200/70" />
                                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Ringkasan progres</p>
                                                        <dl className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-4">
                                                            <div className="flex gap-3 rounded-xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm sm:flex-col sm:px-4 sm:py-3.5">
                                                                <CreditCard className="mt-0.5 size-[18px] shrink-0 text-slate-400 sm:mt-0" aria-hidden />
                                                                <div className="min-w-0">
                                                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pembayaran</dt>
                                                                    <dd className="mt-1 text-base font-bold leading-snug text-slate-900">{labelPayment(item.payment_status)}</dd>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 rounded-xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm sm:flex-col sm:px-4 sm:py-3.5">
                                                                <Stamp className="mt-0.5 size-[18px] shrink-0 text-slate-400 sm:mt-0" aria-hidden />
                                                                <div className="min-w-0">
                                                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visa</dt>
                                                                    <dd className="mt-1 text-base font-bold leading-snug text-slate-900">{labelVisa(item.visa_status)}</dd>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 rounded-xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm sm:flex-col sm:px-4 sm:py-3.5">
                                                                <Ticket className="mt-0.5 size-[18px] shrink-0 text-slate-400 sm:mt-0" aria-hidden />
                                                                <div className="min-w-0">
                                                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tiket</dt>
                                                                    <dd className="mt-1 text-base font-bold leading-snug text-slate-900">{labelTicket(item.ticket_status)}</dd>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 rounded-xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm sm:flex-col sm:px-4 sm:py-3.5">
                                                                <Building2 className="mt-0.5 size-[18px] shrink-0 text-slate-400 sm:mt-0" aria-hidden />
                                                                <div className="min-w-0">
                                                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hotel</dt>
                                                                    <dd className="mt-1 text-base font-bold leading-snug text-slate-900">{labelHotel(item.hotel_status)}</dd>
                                                                </div>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className={cn(cardFooterShell, 'border-teal-100/80 bg-teal-50/45')}>
                                <PathFooterIntro
                                    title="Aksi untuk jalur wisatawan"
                                    hint="Tombol oranye membuka katalog paket; tombol outline untuk menghubungi tim jika ada pertanyaan sebelum mendaftar."
                                />
                                <div className={cn(actionRowClass, 'sm:[&>*:first-child]:order-2 sm:[&>*:last-child]:order-1')}>
                                    <Button type="button" variant="outline" className={btnOutline} asChild>
                                        <Link href="/contact" className="no-underline" aria-label="Hubungi tim Cahaya Anbiya">
                                            Hubungi tim kami
                                        </Link>
                                    </Button>
                                    <Button type="button" className={btnPrimaryBrand} asChild>
                                        <Link href="/packages" className="text-white no-underline hover:text-white" aria-label="Buka katalog paket wisata B2C">
                                            Lihat & pilih paket wisata
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
