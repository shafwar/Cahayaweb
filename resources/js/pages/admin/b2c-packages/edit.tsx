import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import B2cPackageFormPageLayout from '@/components/admin/B2cPackageFormPageLayout';
import { Button } from '@/components/ui/button';
import { adminGhostBtn, adminMuted, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { useLogout } from '@/hooks/useLogout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

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

export default function B2cPackagesEdit({ package: pkg }: { package: Pkg }) {
    const { logout, isLoggingOut } = useLogout();
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
        put(`/admin/b2c-packages/${pkg.slug}`);
    };

    return (
        <AdminPortalShell className="w-full max-w-none px-0">
            <Head title={`Edit — ${pkg.name}`} />

            <form onSubmit={submit} className="pb-6">
                <B2cPackageFormPageLayout
                    title={pkg.name}
                    description="Updates below are reflected on the public site after you save. On wide screens, use the list on the right to jump between sections."
                    meta={<p className={`font-mono text-xs ${adminMuted}`}>Slug: {pkg.slug}</p>}
                    topBarEnd={
                        <>
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
