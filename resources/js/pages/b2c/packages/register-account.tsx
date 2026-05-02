import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { getB2cRegistrationAccountTestFill } from '@/lib/b2cPackageFillTemplates';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, Lock, Package, UserRound } from 'lucide-react';
import { FormEventHandler } from 'react';

type PackageSummary = {
    id: number;
    slug: string;
    name: string;
    price_display: string;
    departure_period: string;
};

type ParticipantSummary = {
    full_name: string;
    email: string;
    phone: string;
    pax: number;
};

const inputClassName =
    'h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20';

const cardShellClass = 'overflow-hidden border border-[#d4af37]/25 bg-white py-0 shadow-xl gap-0';

const cardHeaderClass =
    'relative border-b border-[#ff5200]/15 bg-gradient-to-r from-[#ff5200]/5 via-[#ff5200]/8 to-[#ff5200]/3 px-6 py-5 sm:px-8 sm:py-6';

/** Secondary actions: terang & kontras (hindari navy gelap pada tombol). */
const secondaryBtnClass =
    'h-11 rounded-xl border-2 border-[#38bdf8]/50 bg-[#f0f9ff] px-4 text-sm font-semibold text-[#0369a1] shadow-sm transition hover:bg-[#e0f2fe] hover:border-[#0ea5e9]/60';

export default function PackageRegisterAccount({
    package: pkg,
    participant,
    login_url,
    register_form_url,
}: {
    package: PackageSummary;
    participant: ParticipantSummary;
    login_url: string;
    register_form_url: string;
}) {
    const showDevTestFill = import.meta.env.DEV;

    const { data, setData, post, processing, errors } = useForm({
        account_mode: 'create' as 'create' | 'login',
        account_password: '',
        account_password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/packages/register/${pkg.slug}/account`, { preserveScroll: true });
    };

    return (
        <PublicLayout hideCmsChrome>
            <Head title={`Akun — ${pkg.name}`} />
            <SeoHead
                title={`Lanjutkan akun — ${pkg.name}`}
                description="Buat akun atau masuk untuk menyelesaikan pendaftaran paket Cahaya Anbiya Travel."
            />

            <div className="relative min-h-screen border-t border-[#d4af37]/25 bg-[#f1f5f9] text-[#0f172a]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 h-[420px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,58,95,0.12),transparent_70%)] blur-3xl" />
                    <div className="absolute right-0 bottom-1/4 h-[380px] w-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14),transparent_70%)] blur-3xl" />
                </div>

                <section className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
                    <nav className="flex flex-wrap items-center gap-1 text-sm text-[#64748b]">
                        <Link href="/packages" className="font-medium text-[#2d4a6f] transition hover:text-[#1e3a5f]">
                            Paket wisata
                        </Link>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden />
                        <Link href={register_form_url} className="font-medium text-[#2d4a6f] transition hover:text-[#1e3a5f]">
                            Data peserta
                        </Link>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden />
                        <span className="font-semibold text-[#1e3a5f]">Akun</span>
                    </nav>

                    <div className="mt-6 space-y-8">
                        <Card className={cardShellClass}>
                            <CardHeader className={cardHeaderClass}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff5200]/3 to-transparent opacity-50" />
                                <div className="relative flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5200]/10 ring-2 ring-[#ff5200]/20">
                                        <Package className="h-6 w-6 text-[#ff5200]" aria-hidden />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Ringkasan</CardTitle>
                                        <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">{pkg.name}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 sm:p-8">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#fffbeb] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Harga</p>
                                        <p className="mt-1 text-sm font-semibold text-[#b45309]">{pkg.price_display}</p>
                                    </div>
                                    <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f8fafc] p-4">
                                        <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Periode</p>
                                        <p className="mt-1 text-sm font-semibold text-[#1e3a5f]">{pkg.departure_period}</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f0fdf4]/90 p-4">
                                    <p className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Data peserta (ringkas)</p>
                                    <p className="mt-2 text-sm font-semibold text-[#166534]">{participant.full_name}</p>
                                    <p className="text-sm text-[#334155]">{participant.email}</p>
                                    <p className="text-xs text-[#64748b]">
                                        {participant.phone} · {participant.pax} pax
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <form onSubmit={submit} className="space-y-8">
                            <Card className={cardShellClass}>
                                <CardHeader className={cardHeaderClass}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff5200]/3 to-transparent opacity-50" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5200]/10 ring-2 ring-[#ff5200]/20">
                                            <Lock className="h-6 w-6 text-[#ff5200]" aria-hidden />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Akun peserta</CardTitle>
                                            <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                Satu akun untuk B2B dan B2C — status approval tetap dipisah per jalur.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 p-6 sm:p-8">
                                    {showDevTestFill ? (
                                        <details className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 px-4 py-3 sm:px-5">
                                            <summary className="cursor-pointer text-sm font-semibold text-amber-950">
                                                Pengujian lokal — isi password dummy
                                            </summary>
                                            <div className="mt-3">
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-amber-300/80 bg-white/90 px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-white"
                                                    onClick={() => {
                                                        const T = getB2cRegistrationAccountTestFill();
                                                        setData(T);
                                                    }}
                                                >
                                                    Isi password dari template
                                                </button>
                                            </div>
                                        </details>
                                    ) : null}

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('account_mode', 'create')}
                                            className={`rounded-xl border-2 px-4 py-4 text-left text-sm font-semibold transition ${
                                                data.account_mode === 'create'
                                                    ? 'border-[#ff5200] bg-[#fff4ee] text-[#c2410c] shadow-sm'
                                                    : 'border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1] hover:bg-[#e0f2fe]'
                                            }`}
                                        >
                                            Buat akun baru
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('account_mode', 'login')}
                                            className={`rounded-xl border-2 px-4 py-4 text-left text-sm font-semibold transition ${
                                                data.account_mode === 'login'
                                                    ? 'border-[#ff5200] bg-[#fff4ee] text-[#c2410c] shadow-sm'
                                                    : 'border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1] hover:bg-[#e0f2fe]'
                                            }`}
                                        >
                                            Saya sudah punya akun
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="acc-password" className="text-base font-semibold text-[#1e3a5f]">
                                            {data.account_mode === 'create' ? 'Password akun baru' : 'Password akun Anda'}{' '}
                                            <span className="text-[#ff5200]">*</span>
                                        </Label>
                                        <Input
                                            id="acc-password"
                                            type="password"
                                            value={data.account_password}
                                            onChange={(e) => setData('account_password', e.target.value)}
                                            className={inputClassName}
                                            autoComplete={data.account_mode === 'create' ? 'new-password' : 'current-password'}
                                            required
                                        />
                                        <InputError message={errors.account_password} />
                                    </div>

                                    {data.account_mode === 'create' ? (
                                        <div className="space-y-3">
                                            <Label htmlFor="acc-password2" className="text-base font-semibold text-[#1e3a5f]">
                                                Konfirmasi password <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Input
                                                id="acc-password2"
                                                type="password"
                                                value={data.account_password_confirmation}
                                                onChange={(e) => setData('account_password_confirmation', e.target.value)}
                                                className={inputClassName}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <InputError message={errors.account_password_confirmation} />
                                        </div>
                                    ) : null}

                                    <div className="flex flex-wrap gap-3">
                                        <Button type="button" variant="outline" className={secondaryBtnClass} asChild>
                                            <Link href={login_url}>Buka halaman login</Link>
                                        </Button>
                                        <Button type="button" variant="outline" className={secondaryBtnClass} asChild>
                                            <Link href={register_form_url}>
                                                <span className="inline-flex items-center gap-2">
                                                    <UserRound className="h-4 w-4" aria-hidden />
                                                    Ubah data peserta
                                                </span>
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 min-w-[12rem] rounded-xl bg-gradient-to-r from-[#ff7a33] via-[#ff5200] to-[#ea580c] px-8 text-sm font-bold text-white shadow-lg hover:brightness-[1.03]"
                                        >
                                            {processing ? 'Menyelesaikan…' : 'Selesaikan pendaftaran'}
                                        </Button>
                                        <Button type="button" variant="outline" className={secondaryBtnClass} asChild>
                                            <Link href="/packages">Kembali ke daftar paket</Link>
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
