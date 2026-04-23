import AdminFloatingToast, { type AdminToastPayload } from '@/components/admin/AdminFloatingToast';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cAdminRegistrationBell from '@/components/admin/B2cAdminRegistrationBell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import B2cPackageFormPageLayout from '@/components/admin/B2cPackageFormPageLayout';
import { Button } from '@/components/ui/button';
import { adminGhostBtn, adminMuted, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { useLogout } from '@/hooks/useLogout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut, Users } from 'lucide-react';
import { B2C_UMRAH_APRIL_2026_FULL, getB2cQuickFixDeadlineAndOpen } from '@/lib/b2cPackageFillTemplates';
import { FormEventHandler, useState } from 'react';

type Pkg = {
    id: number;
    slug: string;
    package_code: string;
    name: string;
    departure_period: string;
    description: string;
    location: string | null;
    duration_label: string | null;
    package_type: string;
    price_display: string;
    pax_capacity: number;
    pax_booked: number;
    registration_deadline: string;
    terms_and_conditions: string;
    status: 'open' | 'closed';
    image_path: string | null;
    highlights_text: string;
    features_text: string;
    dates_text: string;
    hotels_text: string;
    sort_order: number;
};

const EDIT_INTRO =
    'Edit the fields below to change what appears on the public B2C Packages page and in the registration flow. Capacity, deadlines, and copy should stay accurate for visitors. Changes apply after you click Save changes. On wide screens, use the list on the right to jump between sections.';

export default function B2cPackagesEdit({ package: pkg }: { package: Pkg }) {
    const { logout, isLoggingOut } = useLogout();
    const [toast, setToast] = useState<AdminToastPayload | null>(null);
    const { data, setData, put, processing, errors } = useForm({
        package_code: pkg.package_code,
        name: pkg.name,
        departure_period: pkg.departure_period,
        description: pkg.description,
        location: pkg.location ?? '',
        duration_label: pkg.duration_label ?? '',
        package_type: pkg.package_type,
        price_display: pkg.price_display,
        pax_capacity: pkg.pax_capacity,
        pax_booked: pkg.pax_booked,
        registration_deadline: pkg.registration_deadline,
        terms_and_conditions: pkg.terms_and_conditions,
        status: pkg.status,
        image_path: pkg.image_path ?? '',
        highlights_text: pkg.highlights_text,
        features_text: pkg.features_text,
        dates_text: pkg.dates_text,
        hotels_text: pkg.hotels_text,
        sort_order: pkg.sort_order,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/b2c-packages/${pkg.slug}`, {
            preserveScroll: true,
            onError: (errs) => {
                const lines = Object.entries(errs).map(([key, val]) => {
                    const text = Array.isArray(val) ? val.join(' ') : String(val);
                    return `${key}: ${text}`;
                });
                setToast({
                    type: 'error',
                    message: ['Gagal menyimpan — periksa form.', ...lines].join('\n'),
                });
            },
        });
    };

    return (
        <AdminPortalShell className="w-full max-w-none px-0">
            <Head title={`Edit — ${pkg.name}`} />
            <AdminFloatingToast toast={toast} onDismiss={() => setToast(null)} durationMs={7000} />

            <form onSubmit={submit} className="pb-6">
                <B2cPackageFormPageLayout
                    title={pkg.name}
                    description={EDIT_INTRO}
                    meta={<p className={`font-mono text-xs ${adminMuted}`}>Slug: {pkg.slug}</p>}
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
                    headerActions={
                        <Link
                            href={`/admin/b2c-packages/${pkg.slug}/registrations`}
                            className={`${adminGhostBtn} inline-flex items-center border-amber-200 text-amber-900 hover:bg-amber-50`}
                        >
                            <Users className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                            Registrations
                        </Link>
                    }
                    stickyNote="Changes apply to the public page after you save."
                    stickyActions={
                        <>
                            <Link href="/admin/b2c-packages">
                                <button type="button" className={adminGhostBtn}>
                                    Cancel
                                </button>
                            </Link>
                            <Button type="submit" disabled={processing} className={`${adminPrimaryBtn} min-w-[11rem]`}>
                                {processing ? 'Saving…' : 'Save changes'}
                            </Button>
                        </>
                    }
                >
                    <details className="mb-6 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 px-4 py-3 sm:px-5">
                        <summary className="cursor-pointer text-sm font-semibold text-amber-950">
                            Template & perbaikan cepat (klik untuk buka)
                        </summary>
                        <p className={`mt-2 text-xs sm:text-sm ${adminMuted}`}>
                            Jika tombol <strong>Register Online</strong> di situs mati karena deadline lewat: gunakan tombol biru di bawah, lalu{' '}
                            <strong>Save changes</strong>. Panduan salin manual:{' '}
                            <code className="rounded bg-white/80 px-1 py-0.5 text-[11px]">docs/B2C_PACKAGE_FORM_TEMPLATE.md</code>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                className={`${adminPrimaryBtn} border border-amber-400/80 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm hover:from-amber-700 hover:to-orange-700`}
                                onClick={() => {
                                    const q = getB2cQuickFixDeadlineAndOpen(45);
                                    setData('registration_deadline', q.registration_deadline);
                                    setData('status', q.status);
                                }}
                            >
                                Aktifkan Register Online (deadline +45 hari 23:59 + Open)
                            </button>
                            <button
                                type="button"
                                className={`${adminGhostBtn} border-amber-300/80 text-amber-950 hover:bg-white/90`}
                                onClick={() => {
                                    const T = B2C_UMRAH_APRIL_2026_FULL;
                                    const q = getB2cQuickFixDeadlineAndOpen(45);
                                    setData('departure_period', T.departure_period);
                                    setData('description', T.description);
                                    setData('location', T.location);
                                    setData('duration_label', T.duration_label);
                                    setData('package_type', T.package_type);
                                    setData('price_display', T.price_display);
                                    setData('pax_capacity', T.pax_capacity);
                                    setData('registration_deadline', q.registration_deadline);
                                    setData('terms_and_conditions', T.terms_and_conditions);
                                    setData('highlights_text', T.highlights_text);
                                    setData('features_text', T.features_text);
                                    setData('dates_text', T.dates_text);
                                    setData('hotels_text', T.hotels_text);
                                    setData('sort_order', T.sort_order);
                                    setData('status', 'open');
                                }}
                            >
                                Isi teks & jadwal dari template Umrah April (tanpa ubah kode/nama)
                            </button>
                        </div>
                    </details>

                    <B2cPackageAdminForm
                        data={data as B2cPackageFormShape}
                        setData={(key, value) => setData(key as keyof typeof data, value as never)}
                        errors={errors}
                        showPaxBooked
                    />
                </B2cPackageFormPageLayout>
            </form>
        </AdminPortalShell>
    );
}
