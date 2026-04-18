import AdminActionToastHost from '@/components/admin/AdminActionToastHost';
import AdminB2cInboxBell from '@/components/admin/AdminB2cInboxBell';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import B2cPackageFormPageLayout from '@/components/admin/B2cPackageFormPageLayout';
import { Button } from '@/components/ui/button';
import { adminGhostBtn, adminMuted, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { useLogout } from '@/hooks/useLogout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { FormEventHandler } from 'react';

const CREATE_INTRO =
    'A B2C package is what visitors see on the public Packages page: name, travel period, displayed price, capacity, registration deadline, and optional details (description, terms, highlights, hotels, etc.). Nothing is saved until you click Create package at the bottom. On wide screens, use the list on the right to jump between sections.';

/** Contoh pengisian — salin ke form lalu sesuaikan (kode paket harus unik). */
const FILL_TEMPLATE = {
    package_code: 'CAH-UMR-2026-04',
    name: 'Umrah Premium 12 Hari — April 2026',
    departure_period: '14–24 April 2026',
    description:
        'Paket umrah dengan hotel bintang 5 dekat Masjidil Haram, mutawwif berpengalaman, dan dokumentasi lengkap. Termasuk tiket pesawat PP, visa, asuransi, dan makan 3x sehari.',
    location: 'Makkah & Madinah',
    duration_label: '10 Days',
    package_type: 'Umrah',
    price_display: 'From Rp 45.000.000 / pax',
    pax_capacity: 40,
    registration_deadline: '2026-04-01T23:59',
    terms_and_conditions:
        'Peserta wajib memiliki paspor min. 6 bulan validitas. Pembatalan <30 hari sebelum keberangkatan dikenakan biaya sesuai kebijakan maskapai. Cahaya Anbiya berhak menolak pendaftaran jika kuota penuh.',
    highlights_text: 'Hotel 5* walking distance\nMutawwif berbahasa Indonesia\nManasik intensif',
    features_text: 'Tiket PP ekonomi premium\nVisa umrah\nAsuransi perjalanan\nMakan 3x',
    dates_text: '14 April 2026|Available\n18 April 2026|Limited',
    hotels_text: 'Pullman Zamzam Makkah|Makkah|5\nOberoi Madinah|Madinah|5',
    sort_order: 10,
};

export default function B2cPackagesCreate({ flash }: { flash?: { type: string; message: string } | null }) {
    const { logout, isLoggingOut } = useLogout();
    const { data, setData, post, processing, errors } = useForm({
        package_code: '',
        name: '',
        departure_period: '',
        description: '',
        location: '',
        duration_label: '',
        package_type: 'Religious',
        price_display: '',
        pax_capacity: 25,
        registration_deadline: '',
        terms_and_conditions: '',
        status: 'open' as 'open' | 'closed',
        image_path: '',
        highlights_text: '',
        features_text: '',
        dates_text: '',
        hotels_text: '',
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/b2c-packages', {
            preserveScroll: true,
            onError: (errs) => {
                const lines = Object.entries(errs).map(([key, val]) => {
                    const text = Array.isArray(val) ? val.join(' ') : String(val);
                    return `${key}: ${text}`;
                });
                window.alert(
                    ['Gagal membuat paket (indikasi debug — perbaiki lalu coba lagi):', '', ...lines].join('\n'),
                );
            },
        });
    };

    return (
        <AdminPortalShell className="w-full max-w-none px-0">
            <Head title="New B2C package" />
            <AdminActionToastHost flash={flash} />

            <form onSubmit={submit} className="pb-6">
                <B2cPackageFormPageLayout
                    title="Create package"
                    description={CREATE_INTRO}
                    topBarEnd={
                        <>
                            <AdminB2cInboxBell />
                            <span className={`hidden text-xs sm:inline ${adminMuted}`}>Jump list →</span>
                            <button
                                type="button"
                                onClick={logout}
                                disabled={isLoggingOut}
                                className={`${adminGhostBtn} border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50`}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {isLoggingOut ? '…' : 'Logout'}
                            </button>
                        </>
                    }
                    stickyNote="Setelah berhasil, Anda diarahkan ke halaman publik Packages (/packages). Jika gagal, muncul alert berisi penyebab (debug)."
                    stickyActions={
                        <>
                            <Link href="/admin/b2c-packages">
                                <button type="button" className={adminGhostBtn}>
                                    Cancel
                                </button>
                            </Link>
                            <Button type="submit" disabled={processing} className={`${adminPrimaryBtn} min-w-[11rem]`}>
                                {processing ? 'Saving…' : 'Create package'}
                            </Button>
                        </>
                    }
                >
                    <details className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 px-4 py-3 sm:px-5">
                        <summary className="cursor-pointer text-sm font-semibold text-amber-950">
                            Template contoh pengisian (klik untuk buka & salin)
                        </summary>
                        <p className={`mt-2 text-xs sm:text-sm ${adminMuted}`}>
                            Gunakan sebagai acuan; ganti kode paket, tanggal, dan teks agar unik. Bagian Media: unggah gambar — path terisi otomatis. File panduan lengkap:{' '}
                            <code className="rounded bg-white/80 px-1 py-0.5 text-[11px]">docs/B2C_PACKAGE_FORM_TEMPLATE.md</code>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                className={`${adminGhostBtn} border-amber-300/80 text-amber-950 hover:bg-white/90`}
                                onClick={() => {
                                    setData('package_code', FILL_TEMPLATE.package_code);
                                    setData('name', FILL_TEMPLATE.name);
                                    setData('departure_period', FILL_TEMPLATE.departure_period);
                                    setData('description', FILL_TEMPLATE.description);
                                    setData('location', FILL_TEMPLATE.location);
                                    setData('duration_label', FILL_TEMPLATE.duration_label);
                                    setData('package_type', FILL_TEMPLATE.package_type);
                                    setData('price_display', FILL_TEMPLATE.price_display);
                                    setData('pax_capacity', FILL_TEMPLATE.pax_capacity);
                                    setData('registration_deadline', FILL_TEMPLATE.registration_deadline);
                                    setData('terms_and_conditions', FILL_TEMPLATE.terms_and_conditions);
                                    setData('highlights_text', FILL_TEMPLATE.highlights_text);
                                    setData('features_text', FILL_TEMPLATE.features_text);
                                    setData('dates_text', FILL_TEMPLATE.dates_text);
                                    setData('hotels_text', FILL_TEMPLATE.hotels_text);
                                    setData('sort_order', FILL_TEMPLATE.sort_order);
                                }}
                            >
                                Isi form dari template
                            </button>
                        </div>
                    </details>

                    <B2cPackageAdminForm
                        data={data as B2cPackageFormShape}
                        setData={(key, value) => setData(key as keyof typeof data, value as never)}
                        errors={errors}
                    />
                </B2cPackageFormPageLayout>
            </form>
        </AdminPortalShell>
    );
}
