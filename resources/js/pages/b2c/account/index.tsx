import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

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
    if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'rejected') return 'border-red-200 bg-red-50 text-red-700';
    return 'border-amber-200 bg-amber-50 text-amber-700';
}

function b2bStatusLabel(status: string): string {
    if (status === 'none') return 'Belum ada pengajuan agen';
    if (status === 'pending') return 'Menunggu review admin';
    if (status === 'approved') return 'Disetujui — akses portal B2B';
    if (status === 'rejected') return 'Ditolak — hubungi admin atau ajukan ulang';
    return status;
}

export default function B2cAccount({ registrations, b2bPortal }: { registrations: RegistrationItem[]; b2bPortal: B2bPortalSummary }) {
    return (
        <PublicLayout>
            <Head title="Akun B2C" />
            <SeoHead title="Akun B2C - Cahaya Anbiya" description="Status pendaftaran paket B2C Anda." />

            <section className="bg-section-photos-home min-h-screen px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Card className="border border-[#d4af37]/25 bg-white shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#1e3a5f]">Akun Anda</CardTitle>
                            <CardDescription>
                                Satu akun untuk jalur wisatawan (B2C) dan agen (B2B). Status persetujuan masing-masing jalur ditampilkan di bawah.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-xl border border-[#c7ddff]/80 bg-[#f8fafc] p-4">
                                <p className="text-sm font-semibold text-[#1e3a5f]">Status agen (B2B)</p>
                                <p className="mt-1 text-sm text-slate-600">{b2bStatusLabel(b2bPortal.status)}</p>
                                {b2bPortal.company_name ? (
                                    <p className="mt-1 text-xs text-slate-500">
                                        Perusahaan: <span className="font-medium text-slate-700">{b2bPortal.company_name}</span>
                                    </p>
                                ) : null}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Button type="button" variant="outline" size="sm" className="border-[#38bdf8]/50 bg-[#f0f9ff] text-[#0369a1]" asChild>
                                        <Link href="/b2b/register" aria-label="B2B — buat pengajuan agen">
                                            B2B — Form pengajuan agen
                                        </Link>
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" className="border-[#38bdf8]/50 bg-[#f0f9ff] text-[#0369a1]" asChild>
                                        <Link
                                            href="/login?mode=b2b&redirect=/b2b"
                                            aria-label="B2B — masuk ke portal agen setelah akun disetujui"
                                        >
                                            B2B — Masuk portal agen
                                        </Link>
                                    </Button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Tombol pertama untuk <strong className="font-medium text-slate-700">pendaftaran agen baru</strong>. Tombol kedua untuk{' '}
                                    <strong className="font-medium text-slate-700">agen yang sudah disetujui</strong> dan punya akses portal.
                                </p>
                            </div>

                            <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-4">
                                <p className="text-sm font-semibold text-[#1e3a5f]">Paket wisata (B2C)</p>
                                <p className="mt-1 text-xs text-slate-600">Jalur wisatawan — daftar paket umroh/wisata dari katalog.</p>
                                {registrations.length === 0 ? (
                                    <div className="mt-3 rounded-lg border border-emerald-100 bg-white/80 p-4 text-sm text-slate-600">
                                        Belum ada registrasi paket B2C.
                                    </div>
                                ) : (
                                    <div className="mt-3 space-y-3">
                                        {registrations.map((item) => (
                                            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-[#1e3a5f]">{item.package.name}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {item.full_name} · {item.pax} pax · {item.package.price_display}
                                                        </p>
                                                    </div>
                                                    <Badge className={statusBadgeClass(item.registration_status)}>
                                                        {item.registration_status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                {item.registration_status === 'approved' ? (
                                                    <p className="mt-3 text-sm text-emerald-700">
                                                        Approved: Anda bisa lanjut proses pembayaran. Invoice akan ditampilkan di fitur invoice B2C.
                                                    </p>
                                                ) : null}
                                                {item.registration_status === 'pending' ? (
                                                    <p className="mt-3 text-sm text-amber-700">Pending: pendaftaran sedang direview admin.</p>
                                                ) : null}
                                                {item.registration_status === 'rejected' ? (
                                                    <p className="mt-3 text-sm text-red-700">
                                                        Rejected{item.notes ? `: ${item.notes}` : '.'}
                                                    </p>
                                                ) : null}
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Payment: {item.payment_status.replace('_', ' ')} · Visa: {item.visa_status.replace('_', ' ')} · Ticket:{' '}
                                                    {item.ticket_status.replace('_', ' ')} · Hotel: {item.hotel_status.replace('_', ' ')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        className="border border-[#ff5200]/40 bg-gradient-to-r from-[#ff5200] to-[#e64a00] text-white shadow-sm hover:from-[#ff6b35] hover:to-[#ff5200]"
                                        asChild
                                    >
                                        <Link href="/packages" aria-label="B2C — buka katalog paket wisata">
                                            B2C — Lihat &amp; pilih paket wisata
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}

