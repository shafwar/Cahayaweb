import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, Package, UserRound } from 'lucide-react';
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

/** Match B2B register-agent field styling */
const inputClassName =
    'h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20';

const textareaClassName =
    'min-h-[5.5rem] w-full resize-y rounded-md border border-[#c7ddff] bg-white px-3 py-3 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20 focus:outline-none';

const cardShellClass = 'overflow-hidden border border-[#d4af37]/25 bg-white py-0 shadow-xl gap-0';

const cardHeaderClass =
    'relative border-b border-[#ff5200]/15 bg-gradient-to-r from-[#ff5200]/5 via-[#ff5200]/8 to-[#ff5200]/3 px-6 py-5 sm:px-8 sm:py-6';

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

                <section className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
                    <nav className="flex flex-wrap items-center gap-1 text-sm text-[#64748b]">
                        <Link href="/packages" className="font-medium text-[#2d4a6f] transition hover:text-[#1e3a5f]">
                            Paket wisata
                        </Link>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden />
                        <span className="font-semibold text-[#1e3a5f]">Pendaftaran</span>
                    </nav>

                    <div className="mt-6 space-y-8">
                        {/* Ringkasan paket — same card shell as B2B register */}
                        <Card className={cardShellClass}>
                            <CardHeader className={cardHeaderClass}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff5200]/3 to-transparent opacity-50" />
                                <div className="relative flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5200]/10 ring-2 ring-[#ff5200]/20">
                                        <Package className="h-6 w-6 text-[#ff5200]" aria-hidden />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Ringkasan paket</CardTitle>
                                        <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">{pkg.name}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 sm:p-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f8fafc] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Periode keberangkatan</p>
                                        <p className="mt-1 text-sm font-semibold text-[#1e3a5f]">{pkg.departure_period}</p>
                                    </div>
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#fffbeb] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Harga</p>
                                        <p className="mt-1 text-sm font-semibold text-[#b45309]">{pkg.price_display}</p>
                                    </div>
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f0fdf4] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Kuota</p>
                                        <p className="mt-1 text-sm font-semibold text-[#166534]">
                                            Tersisa <span className="tabular-nums">{pkg.available_pax}</span> pax dari{' '}
                                            <span className="tabular-nums">{pkg.pax_capacity}</span>
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f8fafc] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Batas pendaftaran (referensi)</p>
                                        <p className="mt-1 text-sm font-semibold text-[#1e3a5f]">{deadlineLabel}</p>
                                    </div>
                                </div>
                                <p className="text-xs leading-relaxed text-[#64748b]">
                                    Pendaftaran online diatur oleh kantor (status <strong className="text-[#1e3a5f]">Open / Closed</strong> di admin).
                                    Tanggal di atas hanya sebagai informasi; form mengikuti status paket.
                                </p>
                            </CardContent>
                        </Card>

                        <form onSubmit={submit} className="space-y-8">
                            <Card className={cardShellClass}>
                                <CardHeader className={cardHeaderClass}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff5200]/3 to-transparent opacity-50" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5200]/10 ring-2 ring-[#ff5200]/20">
                                            <UserRound className="h-6 w-6 text-[#ff5200]" aria-hidden />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Data peserta</CardTitle>
                                            <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                Lengkapi data berikut dengan benar. Tim kami akan menghubungi Anda setelah pengajuan diterima.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 p-6 sm:p-8">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div className="space-y-3 lg:col-span-2">
                                            <Label htmlFor="reg-full-name" className="text-base font-semibold text-[#1e3a5f]">
                                                Nama lengkap <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-full-name"
                                                type="text"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                className={inputClassName}
                                                placeholder="Sesuai paspor / KTP"
                                                required
                                            />
                                            <p className="text-xs text-[#64748b]">Gunakan nama resmi sesuai dokumen perjalanan.</p>
                                            <InputError message={errors.full_name} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="reg-email" className="text-base font-semibold text-[#1e3a5f]">
                                                Email <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={inputClassName}
                                                placeholder="nama@email.com"
                                                required
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="reg-phone" className="text-base font-semibold text-[#1e3a5f]">
                                                Nomor telepon (WhatsApp) <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={inputClassName}
                                                placeholder="08…"
                                                required
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="reg-passport" className="text-base font-semibold text-[#1e3a5f]">
                                                Nomor paspor <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-passport"
                                                type="text"
                                                value={data.passport_number}
                                                onChange={(e) => setData('passport_number', e.target.value)}
                                                className={inputClassName}
                                                required
                                            />
                                            <InputError message={errors.passport_number} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="reg-dob" className="text-base font-semibold text-[#1e3a5f]">
                                                Tanggal lahir <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-dob"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className={inputClassName}
                                                required
                                            />
                                            <InputError message={errors.date_of_birth} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="reg-gender" className="text-base font-semibold text-[#1e3a5f]">
                                                Jenis kelamin <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Select
                                                value={data.gender}
                                                onValueChange={(value) => setData('gender', value as 'male' | 'female' | 'other')}
                                                required
                                            >
                                                <SelectTrigger id="reg-gender" className={inputClassName}>
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    side="bottom"
                                                    sideOffset={4}
                                                    className="border border-[#c7ddff] bg-white shadow-lg"
                                                >
                                                    <SelectItem value="male" className="text-[#1e3a5f] hover:bg-[#ff5200]/10">
                                                        Laki-laki
                                                    </SelectItem>
                                                    <SelectItem value="female" className="text-[#1e3a5f] hover:bg-[#ff5200]/10">
                                                        Perempuan
                                                    </SelectItem>
                                                    <SelectItem value="other" className="text-[#1e3a5f] hover:bg-[#ff5200]/10">
                                                        Lainnya
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.gender} />
                                        </div>

                                        <div className="space-y-3 lg:col-span-2">
                                            <Label htmlFor="reg-address" className="text-base font-semibold text-[#1e3a5f]">
                                                Alamat lengkap <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <textarea
                                                id="reg-address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={3}
                                                className={textareaClassName}
                                                required
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <div className="space-y-3 lg:col-span-2">
                                            <Label htmlFor="reg-pax" className="text-base font-semibold text-[#1e3a5f]">
                                                Jumlah peserta (pax) <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="reg-pax"
                                                type="number"
                                                min={1}
                                                max={maxPax}
                                                value={data.pax}
                                                onChange={(e) =>
                                                    setData('pax', Math.min(maxPax, Math.max(1, parseInt(e.target.value || '1', 10))))
                                                }
                                                className={`${inputClassName} max-w-[12rem] tabular-nums`}
                                                required
                                            />
                                            <p className="text-xs text-[#64748b]">Maksimal {maxPax} pax sesuai kuota tersisa.</p>
                                            <InputError message={errors.pax} />
                                            <InputError message={errors.package} />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f8fafc] p-5">
                                        <p className="text-base font-semibold text-[#1e3a5f]">Syarat & ketentuan</p>
                                        <div className="mt-3 max-h-44 overflow-y-auto rounded-lg border border-[#c7ddff] bg-white p-4 text-xs leading-relaxed text-[#475569]">
                                            <div className="whitespace-pre-wrap">{pkg.terms_and_conditions}</div>
                                        </div>
                                    </div>

                                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#c7ddff] bg-[#fffbeb]/70 p-4 transition hover:border-[#ff5200]/30">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(data.terms_accepted)}
                                            onChange={(e) => setData('terms_accepted', e.target.checked)}
                                            className="mt-1 h-4 w-4 shrink-0 rounded border-[#cbd5e1] text-[#ff5200] focus:ring-[#ff5200]/40"
                                        />
                                        <span className="text-sm leading-snug text-[#334155]">
                                            Saya telah membaca dan menyetujui syarat & ketentuan di atas.
                                        </span>
                                    </label>
                                    <InputError message={errors.terms_accepted} />

                                    <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 min-w-[10rem] rounded-xl bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#ff5200] px-8 text-sm font-bold text-white shadow-lg hover:opacity-95"
                                        >
                                            {processing ? 'Mengirim…' : 'Kirim pendaftaran'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 border-2 border-[#1e3a5f]/20 px-6 text-sm font-semibold text-[#1e3a5f] hover:border-[#d4af37]/50 hover:bg-[#f8fafc]"
                                            asChild
                                        >
                                            <Link href="/packages">Batal & kembali ke paket</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
