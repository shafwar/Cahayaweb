import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function B2cAccount({ registrations }: { registrations: RegistrationItem[] }) {
    return (
        <PublicLayout>
            <Head title="Akun B2C" />
            <SeoHead title="Akun B2C - Cahaya Anbiya" description="Status pendaftaran paket B2C Anda." />

            <section className="bg-section-photos-home min-h-screen px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Card className="border border-[#d4af37]/25 bg-white shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#1e3a5f]">Akun B2C Anda</CardTitle>
                            <CardDescription>Status registrasi paket dan akses invoice setelah disetujui.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {registrations.length === 0 ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                    Belum ada registrasi paket B2C.
                                </div>
                            ) : (
                                registrations.map((item) => (
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
                                ))
                            )}

                            <div className="pt-2">
                                <Button type="button" variant="outline" asChild>
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

