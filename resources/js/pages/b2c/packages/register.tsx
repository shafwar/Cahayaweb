import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { FormEventHandler } from 'react';

type PackageInfo = {
    id: number;
    slug: string;
    name: string;
    departure_period: string;
    price_display: string;
    terms_and_conditions: string;
    registration_deadline: string;
    pax_capacity: number;
    pax_booked: number;
    available_pax: number;
};

const fieldClass =
    'w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-[#0f172a] shadow-sm placeholder:text-[#94a3b8] transition focus:border-[#2d4a6f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40';

const labelClass = 'mb-1.5 block text-sm font-semibold tracking-wide text-[#1e3a5f]';

export default function PackageRegister({ package: pkg }: { package: PackageInfo }) {
    const deadlineLabel = pkg.registration_deadline
        ? new Date(pkg.registration_deadline).toLocaleString('id-ID', {
              dateStyle: 'long',
              timeStyle: 'short',
          })
        : '—';

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
        passport_number: '',
        address: '',
        date_of_birth: '',
        gender: 'male' as 'male' | 'female' | 'other',
        pax: 1,
        terms_accepted: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/packages/register/${pkg.slug}`, { preserveScroll: true });
    };

    const maxPax = Math.max(1, Math.min(50, pkg.available_pax));

    return (
        <PublicLayout hideCmsChrome>
            <Head title={`Daftar — ${pkg.name}`} />
            <SeoHead
                title={`Daftar paket — ${pkg.name}`}
                description={`Formulir pendaftaran online untuk ${pkg.name} — Cahaya Anbiya Travel.`}
            />
            <div className="relative min-h-screen border-t border-[#d4af37]/25 bg-[#f1f5f9] text-[#0f172a]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 h-[420px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,58,95,0.12),transparent_70%)] blur-3xl" />
                    <div className="absolute right-0 bottom-1/4 h-[380px] w-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14),transparent_70%)] blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-[320px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_70%)] blur-3xl" />
                </div>

                <section className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
                    <nav className="flex flex-wrap items-center gap-1 text-sm text-[#64748b]">
                        <Link href="/packages" className="font-medium text-[#2d4a6f] transition hover:text-[#1e3a5f]">
                            Paket wisata
                        </Link>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden />
                        <span className="font-semibold text-[#1e3a5f]">Pendaftaran</span>
                    </nav>

                    <div className="mt-6 overflow-hidden rounded-3xl border-2 border-[#d4af37]/25 bg-white shadow-2xl">
                        <div className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#3d5a80] px-6 py-8 sm:px-8">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-[#d4af37] uppercase">
                                <ClipboardList className="h-3.5 w-3.5" aria-hidden />
                                Form online
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Pendaftaran paket</h1>
                            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">{pkg.name}</p>
                        </div>

                        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                            <div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#f8fafc] to-white p-4 shadow-sm">
                                <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Periode keberangkatan</p>
                                <p className="mt-1 text-sm font-semibold text-[#1e3a5f]">{pkg.departure_period}</p>
                            </div>
                            <div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#fffbeb] to-white p-4 shadow-sm">
                                <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Harga</p>
                                <p className="mt-1 text-sm font-semibold text-[#b45309]">{pkg.price_display}</p>
                            </div>
                            <div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#f0fdf4] to-white p-4 shadow-sm">
                                <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Kuota</p>
                                <p className="mt-1 text-sm font-semibold text-[#166534]">
                                    Tersisa <span className="tabular-nums">{pkg.available_pax}</span> pax dari{' '}
                                    <span className="tabular-nums">{pkg.pax_capacity}</span>
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#f8fafc] to-white p-4 shadow-sm">
                                <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Batas pendaftaran (referensi)</p>
                                <p className="mt-1 text-sm font-semibold text-[#1e3a5f]">{deadlineLabel}</p>
                            </div>
                        </div>
                        <p className="border-t border-[#e2e8f0] px-6 pb-6 text-xs leading-relaxed text-[#64748b] sm:px-8">
                            Pendaftaran online diatur oleh kantor (status <strong className="text-[#1e3a5f]">Open / Closed</strong> di admin).
                            Tanggal di atas hanya sebagai informasi; keberlangsungan form mengikuti status paket.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="mt-8 space-y-6 rounded-3xl border-2 border-[#d4af37]/20 bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-[#1e3a5f]">Data peserta</h2>
                            <p className="mt-1 text-sm text-[#64748b]">Lengkapi data berikut dengan benar. Tim kami akan menghubungi Anda setelah pengajuan diterima.</p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass} htmlFor="reg-full-name">
                                    Nama lengkap
                                </label>
                                <input
                                    id="reg-full-name"
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    className={fieldClass}
                                    placeholder="Sesuai paspor / KTP"
                                    required
                                />
                                {errors.full_name ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.full_name}</p> : null}
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="reg-email">
                                    Email
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={fieldClass}
                                    placeholder="nama@email.com"
                                    required
                                />
                                {errors.email ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p> : null}
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="reg-phone">
                                    Nomor telepon (WhatsApp)
                                </label>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={fieldClass}
                                    placeholder="08…"
                                    required
                                />
                                {errors.phone ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p> : null}
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="reg-passport">
                                    Nomor paspor
                                </label>
                                <input
                                    id="reg-passport"
                                    type="text"
                                    value={data.passport_number}
                                    onChange={(e) => setData('passport_number', e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                                {errors.passport_number ? (
                                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.passport_number}</p>
                                ) : null}
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="reg-dob">
                                    Tanggal lahir
                                </label>
                                <input
                                    id="reg-dob"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                                {errors.date_of_birth ? (
                                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.date_of_birth}</p>
                                ) : null}
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="reg-gender">
                                    Jenis kelamin
                                </label>
                                <select
                                    id="reg-gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value as 'male' | 'female' | 'other')}
                                    className={fieldClass}
                                >
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.gender ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.gender}</p> : null}
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass} htmlFor="reg-address">
                                    Alamat lengkap
                                </label>
                                <textarea
                                    id="reg-address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={3}
                                    className={`${fieldClass} resize-y min-h-[5.5rem]`}
                                    required
                                />
                                {errors.address ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.address}</p> : null}
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass} htmlFor="reg-pax">
                                    Jumlah peserta (pax)
                                </label>
                                <input
                                    id="reg-pax"
                                    type="number"
                                    min={1}
                                    max={maxPax}
                                    value={data.pax}
                                    onChange={(e) =>
                                        setData('pax', Math.min(maxPax, Math.max(1, parseInt(e.target.value || '1', 10))))
                                    }
                                    className={`${fieldClass} max-w-[12rem] tabular-nums`}
                                    required
                                />
                                <p className="mt-1.5 text-xs text-[#64748b]">Maksimal {maxPax} pax sesuai kuota tersisa.</p>
                                {errors.pax ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.pax}</p> : null}
                                {errors.package ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.package}</p> : null}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                            <p className="text-sm font-bold text-[#1e3a5f]">Syarat & ketentuan</p>
                            <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white p-4 text-xs leading-relaxed text-[#475569]">
                                <div className="whitespace-pre-wrap">{pkg.terms_and_conditions}</div>
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#fffbeb]/60 p-4 transition hover:border-[#d4af37]/40">
                            <input
                                type="checkbox"
                                checked={Boolean(data.terms_accepted)}
                                onChange={(e) => setData('terms_accepted', e.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#cbd5e1] text-[#1e3a5f] focus:ring-[#d4af37]"
                            />
                            <span className="text-sm leading-snug text-[#334155]">
                                Saya telah membaca dan menyetujui syarat & ketentuan di atas.
                            </span>
                        </label>
                        {errors.terms_accepted ? (
                            <p className="text-xs font-medium text-red-600">{errors.terms_accepted}</p>
                        ) : null}

                        <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#ff5200] px-8 text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Mengirim…' : 'Kirim pendaftaran'}
                            </button>
                            <Link
                                href="/packages"
                                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl border-2 border-[#1e3a5f]/20 px-6 text-sm font-semibold text-[#1e3a5f] transition hover:border-[#d4af37]/50 hover:bg-[#f8fafc]"
                            >
                                Batal & kembali ke paket
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </PublicLayout>
    );
}
