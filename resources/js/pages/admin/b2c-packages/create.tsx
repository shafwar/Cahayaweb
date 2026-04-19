import AdminFloatingToast, { type AdminToastPayload } from '@/components/admin/AdminFloatingToast';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cAdminRegistrationBell from '@/components/admin/B2cAdminRegistrationBell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import B2cPackageFormPageLayout from '@/components/admin/B2cPackageFormPageLayout';
import { Button } from '@/components/ui/button';
import { adminGhostBtn, adminMuted, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { useLogout } from '@/hooks/useLogout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { B2C_UMRAH_APRIL_2026_FULL } from '@/lib/b2cPackageFillTemplates';

const CREATE_INTRO =
    'A B2C package is what visitors see on the public Packages page: name, travel period, displayed price, capacity, registration deadline, and optional details (description, terms, highlights, hotels, etc.). Nothing is saved until you click Create package at the bottom. On wide screens, use the list on the right to jump between sections.';

export default function B2cPackagesCreate() {
    const { logout, isLoggingOut } = useLogout();
    const [toast, setToast] = useState<AdminToastPayload | null>(null);
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
                setToast({
                    type: 'error',
                    message: ['Gagal membuat paket — periksa form.', ...lines].join('\n'),
                });
            },
        });
    };

    return (
        <AdminPortalShell className="w-full max-w-none px-0">
            <Head title="New B2C package" />
            <AdminFloatingToast toast={toast} onDismiss={() => setToast(null)} durationMs={7000} />

            <form onSubmit={submit} className="pb-6">
                <B2cPackageFormPageLayout
                    title="Create package"
                    description={CREATE_INTRO}
                    topBarEnd={
                        <>
                            <B2cAdminRegistrationBell />
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
                                    const T = B2C_UMRAH_APRIL_2026_FULL;
                                    setData('package_code', T.package_code);
                                    setData('name', T.name);
                                    setData('departure_period', T.departure_period);
                                    setData('description', T.description);
                                    setData('location', T.location);
                                    setData('duration_label', T.duration_label);
                                    setData('package_type', T.package_type);
                                    setData('price_display', T.price_display);
                                    setData('pax_capacity', T.pax_capacity);
                                    setData('registration_deadline', T.registration_deadline);
                                    setData('terms_and_conditions', T.terms_and_conditions);
                                    setData('highlights_text', T.highlights_text);
                                    setData('features_text', T.features_text);
                                    setData('dates_text', T.dates_text);
                                    setData('hotels_text', T.hotels_text);
                                    setData('sort_order', T.sort_order);
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
