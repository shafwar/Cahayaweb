import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

type RegistrationPayload = {
    id: number;
    registration_status: 'pending' | 'approved' | 'rejected';
    full_name: string;
    pax: number;
    package: {
        name: string;
        slug?: string | null;
        price_display: string;
    };
};

export default function SubmissionComplete({ registration }: { registration: RegistrationPayload }) {
    const pending = registration.registration_status === 'pending';

    return (
        <PublicLayout hideCmsChrome>
            <Head title="Pendaftaran terkirim" />
            <SeoHead title="Pendaftaran paket terkirim" description="Status pengajuan paket B2C Cahaya Anbiya." />

            <section className="relative min-h-screen border-t border-[#d4af37]/25 bg-[#f1f5f9] px-4 py-12 sm:px-6 lg:py-16">
                <div className="mx-auto max-w-lg">
                    <Card className="overflow-hidden border border-[#d4af37]/25 bg-white shadow-xl">
                        <CardHeader className="border-b border-[#ff5200]/15 bg-gradient-to-r from-[#ff5200]/5 via-[#ff5200]/8 to-[#ff5200]/3">
                            <CardTitle className="text-xl text-[#1e3a5f] sm:text-2xl">Pendaftaran berhasil dikirim</CardTitle>
                            <CardDescription className="text-[#475569]">
                                Paket: <span className="font-semibold text-[#1e3a5f]">{registration.package.name}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-[#64748b]">Status pengajuan:</span>
                                <Badge
                                    className={
                                        pending
                                            ? 'border-amber-200 bg-amber-50 text-amber-800'
                                            : registration.registration_status === 'approved'
                                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                              : 'border-red-200 bg-red-50 text-red-800'
                                    }
                                >
                                    {registration.registration_status.toUpperCase()}
                                </Badge>
                            </div>

                            {pending ? (
                                <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950">
                                    Pengajuan Anda berstatus <strong>Pending</strong>. Tim admin akan meninjaunya. Gunakan halaman akun B2C untuk memantau
                                    persetujuan, pembayaran, dan dokumen perjalanan.
                                </div>
                            ) : null}

                            <dl className="space-y-2 text-sm text-[#334155]">
                                <div>
                                    <dt className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Nama peserta</dt>
                                    <dd className="font-medium text-[#1e3a5f]">{registration.full_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Jumlah pax</dt>
                                    <dd className="tabular-nums">{registration.pax}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold tracking-wider text-[#64748b] uppercase">Harga (referensi)</dt>
                                    <dd>{registration.package.price_display}</dd>
                                </div>
                            </dl>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                <Button
                                    className="rounded-xl bg-gradient-to-r from-[#ff7a33] via-[#ff5200] to-[#ea580c] font-semibold text-white shadow-lg hover:brightness-[1.03]"
                                    asChild
                                >
                                    <Link href="/b2c/account">Buka akun B2C</Link>
                                </Button>
                                <Button variant="outline" className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#f0f9ff] font-semibold text-[#0369a1] hover:bg-[#e0f2fe]" asChild>
                                    <Link href="/packages">Lihat paket lainnya</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
